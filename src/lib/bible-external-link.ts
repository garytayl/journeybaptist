/**
 * Opens a readable online Bible for a plain-text reference (e.g. "John 15:1–11").
 * Bible Gateway search works without an API key.
 */
export function bibleGatewayReadUrl(reference: string): string {
  const q = reference.trim()
  if (!q) return "https://www.biblegateway.com/"
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(q)}&version=NIV`
}
