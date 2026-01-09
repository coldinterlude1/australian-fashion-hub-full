export function createPageUrl(pageName: string): string {
  // Convert page name to URL-friendly format
  return `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
}

