export interface Theme {
  color_prefilled: string;
  color_resolved: string;
  color_draft: string;
  color_highlight_foreground: string;
  color_highlight_bg1: string;
  color_highlight_bg2: string;
  color_background: string;
}

const DEFAULT_THEME: Theme = {
  color_prefilled: '#050505',
  color_resolved: '#156363',
  color_draft: '#447862',
  color_highlight_foreground: '#007896',
  color_highlight_bg1: rgba('#dcc1c3', 1),
  color_highlight_bg2: rgba('#dcd1d1', 0.5),
  color_background: '#fefefe',
};

export function getCurrentTheme(): Theme {
  return DEFAULT_THEME;
}

function rgba(hex: string, alpha: number): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
