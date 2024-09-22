"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const defaultCopyDelimiters = {
  inline: [
    "$",
    "$"
  ],
  display: [
    "$$",
    "$$"
  ]
};
function katexReplaceWithTex(fragment, copyDelimiters = defaultCopyDelimiters) {
  const katexHtml = fragment.querySelectorAll(".katex-mathml + .katex-html");
  for (let i = 0; i < katexHtml.length; i++) {
    const element = katexHtml[i];
    if (element.remove) {
      element.remove();
    } else if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
  const katexMathml = fragment.querySelectorAll(".katex-mathml");
  for (let i = 0; i < katexMathml.length; i++) {
    const element = katexMathml[i];
    const texSource = element.querySelector("annotation");
    if (texSource) {
      if (element.replaceWith) {
        element.replaceWith(texSource);
      } else if (element.parentNode) {
        element.parentNode.replaceChild(texSource, element);
      }
      texSource.innerHTML = copyDelimiters.inline[0] + texSource.innerHTML + copyDelimiters.inline[1];
    }
  }
  const displays = fragment.querySelectorAll(".katex-display annotation");
  for (let i = 0; i < displays.length; i++) {
    const element = displays[i];
    element.innerHTML = copyDelimiters.display[0] + element.innerHTML.substr(copyDelimiters.inline[0].length, element.innerHTML.length - copyDelimiters.inline[0].length - copyDelimiters.inline[1].length) + copyDelimiters.display[1];
  }
  return fragment;
}
exports.defaultCopyDelimiters = defaultCopyDelimiters;
exports.katexReplaceWithTex = katexReplaceWithTex;
