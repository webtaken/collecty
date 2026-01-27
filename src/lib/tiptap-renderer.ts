import type { RichTextContent } from "@/db/schema/lead-magnets";

/**
 * A simple server-side renderer for Tiptap JSON content.
 * Converts basic nodes and marks to HTML strings.
 */
export function renderTiptapToHtml(node?: RichTextContent): string {
  if (!node) return "";

  // Handle array of nodes (doc.content)
  if (Array.isArray(node)) {
    return node.map((child) => renderTiptapToHtml(child)).join("");
  }

  // Handle single node
  const { type, content, text, marks, attrs } = node;

  let html = "";

  // Handle text nodes with marks
  if (type === "text" && text) {
    html = escapeHtml(text);
    if (marks) {
      marks.forEach((mark) => {
        if (mark.type === "bold") html = `<strong>${html}</strong>`;
        if (mark.type === "italic") html = `<em>${html}</em>`;
        if (mark.type === "strike") html = `<s>${html}</s>`;
        if (mark.type === "link" && mark.attrs?.href) {
          html = `<a href="${escapeHtml(String(mark.attrs.href))}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${html}</a>`;
        }
      });
    }
    return html;
  }

  // Recursive content rendering
  const childrenHtml = content
    ? content.map((child) => renderTiptapToHtml(child)).join("")
    : "";

  // Block nodes
  switch (type) {
    case "doc":
      return childrenHtml;
    case "paragraph":
      return `<p style="margin-bottom: 0.75rem; line-height: 1.5;">${childrenHtml}</p>`;
    case "heading":
      const level = attrs?.level || 1;
      const fontSize =
        level === 1 ? "1.5rem" : level === 2 ? "1.25rem" : "1.1rem";
      return `<h${level} style="font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; font-size: ${fontSize};">${childrenHtml}</h${level}>`;
    case "bulletList":
      return `<ul style="margin-bottom: 1rem; padding-left: 1.5rem; list-style-type: disc;">${childrenHtml}</ul>`;
    case "orderedList":
      return `<ol style="margin-bottom: 1rem; padding-left: 1.5rem; list-style-type: decimal;">${childrenHtml}</ol>`;
    case "listItem":
      return `<li style="margin-bottom: 0.25rem;">${childrenHtml}</li>`;
    default:
      return childrenHtml;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
