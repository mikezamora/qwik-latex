"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const katex2tex = require("./katex2tex.qwik.cjs");
function closestKatex(node) {
  const element = node instanceof Element ? node : node.parentElement;
  return element && element.closest(".katex");
}
function init() {
  document.addEventListener("copy", function(event) {
    const selection = window.getSelection();
    if (selection?.isCollapsed || !event.clipboardData) {
      return;
    }
    const clipboardData = event.clipboardData;
    const range = selection?.getRangeAt(0);
    if (range) {
      const startKatex = closestKatex(range.startContainer);
      if (startKatex) {
        range.setStartBefore(startKatex);
      }
      const endKatex = closestKatex(range.endContainer);
      if (endKatex) {
        range.setEndAfter(endKatex);
      }
      const fragment = range.cloneContents();
      if (!fragment.querySelector(".katex-mathml")) {
        return;
      }
      const htmlContents = Array.prototype.map.call(fragment.childNodes, (el) => el instanceof Text ? el.textContent : el.outerHTML).join("");
      clipboardData.setData("text/html", htmlContents);
      clipboardData.setData("text/plain", katex2tex.katexReplaceWithTex(fragment).textContent);
      event.preventDefault();
    }
  });
}
exports.init = init;
