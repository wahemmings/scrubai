
/**
 * Content Security Policy Configuration
 * This provides protection against Cross-Site Scripting (XSS) attacks
 * and other code injection attacks by controlling which resources can be loaded
 */

export const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://*.supabase.co https://rysezrtqehpzonflkezr.supabase.co;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://rysezrtqehpzonflkezr.supabase.co;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`.replace(/\s+/g, ' ').trim();

/**
 * Apply CSP headers to fetch requests
 * @param headers - Headers object to apply CSP to
 */
export const applyCSPHeaders = (headers: Headers): Headers => {
  headers.set('Content-Security-Policy', CSP_HEADER);
  return headers;
};
