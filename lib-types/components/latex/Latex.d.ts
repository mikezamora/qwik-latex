import type { QRL } from "@builder.io/qwik";
import { Signal } from "@builder.io/qwik";
import { TrustContext } from "katex";
interface LatexOptions {
    displayMode?: boolean;
    leqno?: boolean;
    fleqn?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: {
        [key: string]: any;
    };
    minRuleThickness?: number;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    strict?: boolean | string | QRL<() => void>;
    trust?: boolean | ((context: TrustContext) => boolean);
}
export declare const LaTeX: import("@builder.io/qwik").Component<{
    options?: LatexOptions;
    latex?: string;
    shouldRenderMathInElement?: boolean;
    elementRef?: Signal<Element | undefined>;
    elementId?: string;
}>;
export {};
