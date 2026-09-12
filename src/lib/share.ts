/**
 * Copy / Share / Print helpers.
 * Everything runs locally — no personal data ever leaves the browser.
 */

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/** Web Share API with clipboard fallback. Returns mode used, or null on failure. */
export async function shareText(title: string, text: string): Promise<'native' | 'clipboard' | 'none'> {
  if (canNativeShare()) {
    try {
      await navigator.share({ title, text });
      return 'native';
    } catch {
      /* user cancelled or failed — fall back below */
    }
  }
  const ok = await copyText(`${text}\n${window.location.href}`);
  return ok ? 'clipboard' : 'none';
}

export function printPage(): void {
  window.print();
}
