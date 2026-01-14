export function getCaretCoordinates(textarea, position) {
  const div = document.createElement("div");
  const style = window.getComputedStyle(textarea);

  // Copy textarea styles
  [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "letterSpacing",
    "lineHeight",
    "padding",
    "border",
    "boxSizing",
    "whiteSpace",
    "wordWrap",
    "overflowWrap",
    "width",
  ].forEach((prop) => {
    div.style[prop] = style[prop];
  });

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";

  // Set content up to caret
  div.textContent = textarea.value.substring(0, position);

  // Insert marker span
  const span = document.createElement("span");
  span.textContent = "|";
  div.appendChild(span);

  document.body.appendChild(div);

  const rect = span.getBoundingClientRect();
  document.body.removeChild(div);

  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}
