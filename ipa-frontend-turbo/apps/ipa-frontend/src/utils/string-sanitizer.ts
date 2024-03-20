export const sanitize = (unsanitized: string) => {
  return unsanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\*/g, '&ast;')
    .replace(/\./g, '&period;');
};
