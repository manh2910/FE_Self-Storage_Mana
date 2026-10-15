export function customerReturnPath(value: string | null): string | null {
  if (!value || /[\\\u0000-\u001f]/.test(value) || !/^\/customer(?:\/|\?|$)/.test(value)) return null
  return value
}
