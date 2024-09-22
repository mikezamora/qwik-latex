declare const latex: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export { latex };
