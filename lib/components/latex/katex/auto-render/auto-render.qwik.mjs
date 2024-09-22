import katex from "katex";
import splitAtDelimiters from "./splitAtDelimiters.qwik.mjs";
const renderMathInText = function(text, optionsCopy) {
  const data = splitAtDelimiters(text, optionsCopy.delimiters);
  if (data.length === 1 && data[0].type === "text") {
    return null;
  }
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "text") {
      fragment.appendChild(document.createTextNode(data[i].data));
    } else {
      const span = document.createElement("span");
      let math = data[i].data;
      optionsCopy.displayMode = data[i].display;
      try {
        if (optionsCopy.preProcess) {
          math = optionsCopy.preProcess(math);
        }
        katex.render(math, span, optionsCopy);
      } catch (e) {
        if (!(e instanceof katex.ParseError)) {
          throw e;
        }
        optionsCopy.errorCallback(
          "KaTeX auto-render: Failed to parse `" + data[i].data + "` with ",
          e
        );
        fragment.appendChild(document.createTextNode(data[i].rawData));
        continue;
      }
      fragment.appendChild(span);
    }
  }
  return fragment;
};
const renderElem = function(elem, optionsCopy) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    const childNode = elem.childNodes[i];
    if (childNode.nodeType === 3) {
      let textContentConcat = childNode.textContent;
      let sibling = childNode.nextSibling;
      let nSiblings = 0;
      while (sibling && sibling.nodeType === Node.TEXT_NODE) {
        textContentConcat += sibling.textContent;
        sibling = sibling.nextSibling;
        nSiblings++;
      }
      const frag = renderMathInText(textContentConcat, optionsCopy);
      if (frag) {
        for (let j = 0; j < nSiblings; j++) {
          childNode.nextSibling.remove();
        }
        i += frag.childNodes.length - 1;
        elem.replaceChild(frag, childNode);
      } else {
        i += nSiblings;
      }
    } else if (childNode.nodeType === 1) {
      const className = " " + childNode.className + " ";
      const shouldRender = optionsCopy.ignoredTags.indexOf(
        childNode.nodeName.toLowerCase()
      ) === -1 && optionsCopy.ignoredClasses.every(
        (x) => className.indexOf(" " + x + " ") === -1
      );
      if (shouldRender) {
        renderElem(childNode, optionsCopy);
      }
    }
  }
};
const renderMathInElement = function(elem, options) {
  if (!elem) {
    throw new Error("No element provided to render");
  }
  const optionsCopy = {};
  for (const option in options) {
    if (options.hasOwnProperty(option)) {
      optionsCopy[option] = options[option];
    }
  }
  optionsCopy.delimiters = optionsCopy.delimiters || [
    { left: "$$", right: "$$", display: true },
    { left: "\\(", right: "\\)", display: false },
    // LaTeX uses $…$, but it ruins the display of normal `$` in text:
    // {left: "$", right: "$", display: false},
    // $ must come after $$
    // Render AMS environments even if outside $$…$$ delimiters.
    { left: "\\begin{equation}", right: "\\end{equation}", display: true },
    { left: "\\begin{align}", right: "\\end{align}", display: true },
    { left: "\\begin{alignat}", right: "\\end{alignat}", display: true },
    { left: "\\begin{gather}", right: "\\end{gather}", display: true },
    { left: "\\begin{CD}", right: "\\end{CD}", display: true },
    { left: "\\[", right: "\\]", display: true }
  ];
  optionsCopy.ignoredTags = optionsCopy.ignoredTags || [
    "script",
    "noscript",
    "style",
    "textarea",
    "pre",
    "code",
    "option"
  ];
  optionsCopy.ignoredClasses = optionsCopy.ignoredClasses || [];
  optionsCopy.errorCallback = optionsCopy.errorCallback || console.error;
  optionsCopy.macros = optionsCopy.macros || {};
  renderElem(elem, optionsCopy);
};
export {
  renderMathInElement as default
};
