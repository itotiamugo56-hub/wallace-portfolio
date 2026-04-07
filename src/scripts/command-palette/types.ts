export interface CommandAction {
  id: string;
  label: string;
  shortcut?: string;
  handler?: 'clipboard' | 'url' | 'mailto' | string;  // Allow string fallback
  value?: string;
  clipboard?: string;
  url?: string;
}