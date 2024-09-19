import type { QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import katex, { TrustContext } from "katex";

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

export const LaTeX = component$<{ options?: LatexOptions, latex?: string }>(
  ({ options = {}, latex = "" }) => {
    const latexify = (children: string, options: katex.KatexOptions) => {
      console.log("children:", children);
      console.log("options:", options);
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
        let renderedString;
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
          return latexStr;
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
          console.log("val.string:", val.string);
          return (
            <span
              key={`latex-${idx}`}
              dangerouslySetInnerHTML={renderLatexString(val.string, val.type)}
            />
          );
        });

        return newResult;
      };
      return processResult(result);
    };

    const  {
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
    console.log("latexElements:", latexElements);

    return (
      <div class={"m-4"}>
        {latexElements.map((element) => {
          return element || "";
        })}
      </div>
    );
  },
);
