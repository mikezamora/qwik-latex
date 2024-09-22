import { jsx, Fragment } from "@builder.io/qwik/jsx-runtime";
import { component$, useStyles$, useSignal, $, useOnDocument, Slot } from "@builder.io/qwik";
import katex from "katex";
import styles from "./katex/katex.css.qwik.mjs";
import "./katex/mhchem/mhchem.qwik.mjs";
import { init } from "./katex/copy-tex/copy-tex.qwik.mjs";
import renderMathInElement from "./katex/auto-render/auto-render.qwik.mjs";
const LaTeX = component$(({ options = {}, latex = "", shouldRenderMathInElement = false, elementRef, elementId }) => {
  const { displayMode = false, leqno = false, fleqn = false, throwOnError = true, errorColor = "#cc0000", macros = {}, minRuleThickness = 0, colorIsTextColor = false, maxSize = 1e3, maxExpand = 1e3, strict = "warn", trust = false } = options;
  useStyles$(styles);
  const outputRef = useSignal();
  const mathInElementRenderer = $((outputElement) => {
    init();
    renderMathInElement(outputElement, {
      displayMode,
      leqno,
      fleqn,
      throwOnError,
      errorColor,
      macros,
      minRuleThickness,
      colorIsTextColor,
      maxSize,
      maxExpand,
      strict,
      // eslint-disable-next-line qwik/valid-lexical-scope
      trust,
      delimiters: [
        {
          left: "$$",
          right: "$$",
          display: true
        },
        {
          left: "$",
          right: "$",
          display: false
        },
        {
          left: "\\begin{equation}",
          right: "\\end{equation}",
          display: true
        },
        {
          left: "\\begin{align}",
          right: "\\end{align}",
          display: true
        },
        {
          left: "\\begin{alignat}",
          right: "\\end{alignat}",
          display: true
        },
        {
          left: "\\begin{gather}",
          right: "\\end{gather}",
          display: true
        },
        {
          left: "\\begin{CD}",
          right: "\\end{CD}",
          display: true
        },
        {
          left: "\\(",
          right: "\\)",
          display: false
        },
        {
          left: "\\[",
          right: "\\]",
          display: true
        }
      ]
    });
  });
  useOnDocument("load", $(() => {
    init();
    if (shouldRenderMathInElement && elementRef?.value) {
      const outputElement = elementRef.value;
      mathInElementRenderer(outputElement);
    } else if (shouldRenderMathInElement && elementId) {
      const outputElement = document.getElementById(elementId);
      mathInElementRenderer(outputElement);
    } else if (shouldRenderMathInElement && outputRef?.value) {
      const outputElement = outputRef.value;
      mathInElementRenderer(outputElement);
    }
  }));
  if (shouldRenderMathInElement && elementRef?.value) {
    return /* @__PURE__ */ jsx(Fragment, {});
  } else if (shouldRenderMathInElement) {
    return /* @__PURE__ */ jsx("div", {
      ref: outputRef,
      children: /* @__PURE__ */ jsx(Slot, {})
    });
  } else {
    const latexify = (children, options2) => {
      const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\\]*(?:\\.[^$\\]*)*\$/g;
      const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;
      const stripDollars = (stringToStrip) => stringToStrip[0] === "$" && stringToStrip[1] !== "$" ? stringToStrip.slice(1, -1) : stringToStrip.slice(2, -2);
      const getDisplay = (stringToDisplay) => stringToDisplay.match(blockRegularExpression) ? "block" : "inline";
      const renderLatexString = (latexStr, typeStr) => {
        let renderedString = latexStr;
        try {
          renderedString = katex.renderToString(latexStr, typeStr === "block" ? Object.assign({
            displayMode: true
          }, options2) : options2);
        } catch (err) {
          console.error("Error rendering LaTeX:", err);
          console.error("couldn`t convert string", latexStr);
        }
        return renderedString;
      };
      const result = [];
      const latexMatch = children.match(regularExpression);
      const stringWithoutLatex = children.split(regularExpression);
      if (latexMatch) {
        stringWithoutLatex.forEach((s, index) => {
          result.push({
            string: s,
            type: "text"
          });
          if (latexMatch[index]) {
            result.push({
              string: stripDollars(latexMatch[index]),
              type: getDisplay(latexMatch[index])
            });
          }
        });
      } else {
        result.push({
          string: children,
          type: "text"
        });
      }
      const processResult = (resultToProcess) => {
        const newResult = resultToProcess.map((val, idx) => {
          if (val.type === "text") {
            return val.string;
          }
          return /* @__PURE__ */ jsx("span", {
            dangerouslySetInnerHTML: renderLatexString(val.string, val.type)
          }, `latex-${idx}`);
        });
        return newResult;
      };
      return processResult(result);
    };
    const latexElements = latexify(latex, {
      displayMode,
      leqno,
      fleqn,
      throwOnError,
      errorColor,
      macros,
      minRuleThickness,
      colorIsTextColor,
      maxSize,
      maxExpand,
      strict,
      trust
    });
    return /* @__PURE__ */ jsx("div", {
      children: latexElements.map((element) => {
        return element || "";
      })
    });
  }
});
export {
  LaTeX
};
