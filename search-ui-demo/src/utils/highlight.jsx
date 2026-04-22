/**
 * highlight(text, query)
 * ─────────────────────
 * Splits `text` around every occurrence of `query` (case-insensitive)
 * and wraps each match in a <mark> element.
 *
 * Returns a React fragment — safe to render directly in JSX.
 *
 * Example:
 *   highlight("React developer", "react")
 *   → <><mark>React</mark>{" developer"}</>
 */
function highlight(text, query) {
  if (!query || !text) return text;

  // Escape special regex characters in the query string
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = String(text).split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ background: "#fff3b0", padding: 0, borderRadius: 2 }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default highlight;