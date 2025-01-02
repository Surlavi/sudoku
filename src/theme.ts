export interface Theme {
  colorPrefilled: string;
  colorSolved: string;
  colorDraft: string;
  colorHighlightFg: string;
  colorHighlightBg1: string;
  colorHighlightBg2: string;
  colorBg: string;
}

const CURRENT_THEME: Theme = {
  colorPrefilled: '#050505',
  colorSolved: '#156363',
  colorDraft: '#447862',
  colorHighlightFg: '#007896',
  colorHighlightBg1: rgba('#dcc1c3', 1),
  colorHighlightBg2: rgba('#dcd1d1', 0.5),
  colorBg: '#fefefe',
};

export function getCurrentTheme(): Theme {
  return CURRENT_THEME;
}

function rgba(hex: string, alpha: number): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CSS_JS_VAR_MAP: Record<string, string> = {
  'color-prefilled': 'colorPrefilled',
  'color-solved': 'colorSolved',
  'color-draft': 'colorDraft',
  'color-highlight-fg': 'colorHighlightFg',
  'color-highlight-bg1': 'colorHighlightBg1',
  'color-highlight-bg2': 'colorHighlightBg2',
  'color-bg': 'colorBg',
} as const;

export function init() {
  setTheme('default');
}

function setTheme(name: string) {
  for (const cssProp in CSS_JS_VAR_MAP) {
    const jsProp = CSS_JS_VAR_MAP[cssProp];
    const cssVar = `--${name}-${cssProp}`;
    const val = window.getComputedStyle(document.body).getPropertyValue(cssVar);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (CURRENT_THEME as any)[jsProp] = val;
    document.documentElement.style.setProperty(`--${cssProp}`, val);
  }
}
