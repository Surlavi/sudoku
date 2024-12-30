export interface Theme {
  color_prefilled: string;
  color_resolved: string;
  color_draft: string;
  color_highlight_foreground: string;
  color_highlight_background: string;
  color_background: string;
}

const DEFAULT_THEME: Theme = {
  color_prefilled: '#004e61',
  color_resolved: '#007896',
  color_draft: '#3e909d',
  color_highlight_foreground: '#007896',
  color_highlight_background: '#f5d7b0',
  color_background: '#fefefe',
};

export function getCurrentTheme(): Theme {
  return DEFAULT_THEME;
}
