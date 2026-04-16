/** Normalize a human-entered reference for bible-api.com (spaces, ASCII dashes). */
export function normalizeBibleApiRef(input: string): string {
  return input
    .trim()
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\s+/g, " ")
}
