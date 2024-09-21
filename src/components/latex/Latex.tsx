import type { QRL } from "@builder.io/qwik";
import {
  component$,
  useStyles$,
  useOnDocument,
  $,
  Signal,
  useSignal,
  Slot,
} from "@builder.io/qwik";

import katex, { TrustContext } from "katex";
import styles from "./katex/katex.css?inline";
import * as mhchem from "./katex/mhchem/mhchem";
import * as copytex from "./katex/copy-tex/copy-tex";
import renderMathInElement from "./katex/auto-render/auto-render";

interface LatexOptions {
  displayMode?: boolean;
  leqno?: boolean;
  fleqn?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  macros?: { [key: string]: any };
  minRuleThickness?: number;
  colorIsTextColor?: boolean;
  maxSize?: number;
  maxExpand?: number;
  strict?: boolean | string | QRL<() => void>;
  trust?: boolean | ((context: TrustContext) => boolean);
}

export const LaTeX = component$<{
  options?: LatexOptions;
  latex?: string;
  shouldRenderMathInElement?: boolean;
  elementRef?: Signal<Element | undefined>;
  elementId?: string;
}>(
  ({
    options = {},
    latex = "",
    shouldRenderMathInElement = false,
    elementRef,
    elementId,
  }) => {
    const {
      displayMode = false,
      leqno = false,
      fleqn = false,
      throwOnError = true,
      errorColor = "#cc0000",
      macros = {},
      minRuleThickness = 0,
      colorIsTextColor = false,
      maxSize = 1000,
      maxExpand = 1000,
      strict = "warn",
      trust = false,
    } = options;

    useStyles$(styles);
    const outputRef = useSignal<Element>();

    const mathInElementRenderer = $(
      (outputElement: Element | HTMLElement | null) => {
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
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            {
              left: "\\begin{equation}",
              right: "\\end{equation}",
              display: true,
            },
            { left: "\\begin{align}", right: "\\end{align}", display: true },
            {
              left: "\\begin{alignat}",
              right: "\\end{alignat}",
              display: true,
            },
            {
              left: "\\begin{gather}",
              right: "\\end{gather}",
              display: true,
            },
            { left: "\\begin{CD}", right: "\\end{CD}", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
        });
      },
    );

    useOnDocument(
      "load",
      $(() => {
        copytex.init();
        mhchem;

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
      }),
    );

    if (shouldRenderMathInElement && elementRef?.value) {
      return <></>;
    } else if (shouldRenderMathInElement) {
      return (
        <div ref={outputRef}>
          <Slot />
        </div>
      );
    } else {
      const latexify = (children: string, options: katex.KatexOptions) => {
        const regularExpression =
          /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\\]*(?:\\.[^$\\]*)*\$/g;
        const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

        const stripDollars = (stringToStrip: string) =>
          stringToStrip[0] === "$" && stringToStrip[1] !== "$"
            ? stringToStrip.slice(1, -1)
            : stringToStrip.slice(2, -2);

        const getDisplay = (stringToDisplay: string) =>
          stringToDisplay.match(blockRegularExpression) ? "block" : "inline";

        const renderLatexString = (latexStr: string, typeStr: string) => {
          let renderedString = latexStr;
          try {
            // returns HTML markup
            renderedString = katex.renderToString(
              latexStr,
              typeStr === "block"
                ? Object.assign({ displayMode: true }, options)
                : options,
            );
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
              type: "text",
            });
            if (latexMatch[index]) {
              result.push({
                string: stripDollars(latexMatch[index]),
                type: getDisplay(latexMatch[index]),
              });
            }
          });
        } else {
          result.push({
            string: children,
            type: "text",
          });
        }

        const processResult = (resultToProcess: any[]) => {
          const newResult = resultToProcess.map((val, idx) => {
            if (val.type === "text") {
              return val.string;
            }
            return (
              <span
                key={`latex-${idx}`}
                dangerouslySetInnerHTML={renderLatexString(
                  val.string,
                  val.type,
                )}
              />
            );
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
        trust,
      });

      return (
        <div>
          {latexElements.map((element) => {
            return element || "";
          })}
        </div>
      );
    }
  },
);
