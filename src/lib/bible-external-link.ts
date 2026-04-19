/**
 * External Bible readers (no API key).
 * CSB is not available from our in-app API (copyright); use these for CSB text.
 */

/** YouVersion CSB bible id (Christian Standard Bible). */
const YOUVERSION_CSB_ID = "1713"

/**
 * Opens CSB on Bible.com / YouVersion search (best CSB experience without an API key).
 */
export function youVersionCsbUrl(reference: string): string {
  const q = reference.trim()
  if (!q) return `https://www.bible.com/versions/${YOUVERSION_CSB_ID}`
  return `https://www.bible.com/search/bible?q=${encodeURIComponent(q)}&version=${YOUVERSION_CSB_ID}`
}

/**
 * Bible Gateway passage reader. Use CSB for Journey Baptist defaults.
 */
export function bibleGatewayReadUrl(
  reference: string,
  version: string = "CSB"
): string {
  const q = reference.trim()
  if (!q) return "https://www.biblegateway.com/"
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(q)}&version=${encodeURIComponent(version)}`
}
