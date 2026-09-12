/** Global app config. Replace repoUrl with your GitHub Pages repository URL. */
export const APP = {
  name: 'BD Career Tools',
  repoUrl: 'https://github.com/YOUR_USERNAME/bd-career-tools',
  /** LocalStorage keys */
  ls: {
    theme: 'bct-theme',
    lang: 'bct-lang',
    disclaimerHidden: 'bct-disclaimer-hidden',
    retirementForm: 'bct-ret-form',
  },
  /** Only non-sensitive UI prefs are ever persisted. DOBs must never be stored. */
} as const;
