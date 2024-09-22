const latex = (
  template: { raw: readonly string[] | ArrayLike<string> },
  ...substitutions: any[]
) => String.raw(template, ...substitutions);

export { latex };
