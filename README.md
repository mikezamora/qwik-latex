# Qwik LaTeX

[`qwik-latex`](https://www.npmjs.com/package/qwik-latex) provides a TypeScript component for rendering LaTeX math and chemical notation in Qwik applications using the KaTeX library. It is designed for research applications requiring fast and accurate display of complex mathematical and scientific notation.

## KaTeX Integration

[KaTeX](https://github.com/KaTeX/KaTeX) is a high-speed LaTeX rendering library known for its ability to render complex mathematical expressions with low latency. Unlike MathJax, KaTeX focuses on performance by compiling LaTeX to HTML and CSS, ensuring fast page loads and reliable rendering even in resource-constrained environments.

`qwik-latex` integrates KaTeX directly into Qwik components, enabling real-time rendering of mathematical formulas, chemical equations, and customizable macros in both inline and display formats.

### Installation

To get started, you'll need to install package if you haven't already. You can do this with npm. https://www.npmjs.com/package/qwik-latex

```bash
npm install qwik-latex
```

### Latex String Literal

This library includes a string template helper `latex` that can be used to assign complex latex expressions without typescript/qwik `\` parsing issues

```tsx
import { component$ } from "@builder.io/qwik";
import { LaTeX, latex } from "qwik-latex";

export const TheoremComponent = component$(() => {
  const complexEquation = latex`$f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$`;

  return (
    <div>
      <h1>Theorem:</h1>
      <LaTeX shouldRenderMathInElement>
        <p>{equation}</p>
      </LaTeX>
    </div>
  );
});
```

### Component Props

- **`latex`**: (optional) A LaTeX string to be rendered. If omitted, the component will render LaTeX found in child elements or a target element defined by `elementId` or `elementRef`.
- **`options`**: (optional) Configuration options for KaTeX rendering:
  - **`displayMode`**: Boolean (default: `false`). If `true`, renders the LaTeX expression in display mode, centered on the page.
  - **`leqno`**: Boolean (default: `false`). If `true`, equation numbers are displayed on the left.
  - **`fleqn`**: Boolean (default: `false`). If `true`, aligns displayed equations to the left instead of centered.
  - **`throwOnError`**: Boolean (default: `true`). If `true`, throws an error if the LaTeX expression cannot be parsed. If `false`, renders the invalid input in red.
  - **`errorColor`**: String (default: `#cc0000`). Color used to highlight LaTeX errors.
  - **`macros`**: Object (default: `{}`). Define custom LaTeX macros.
  - **`strict`**: Boolean or string (default: `false`). Enables strict parsing mode to enforce LaTeX standards.
  - **`trust`**: Boolean or function (default: `false`). Controls whether potentially unsafe LaTeX commands are allowed.
- **`shouldRenderMathInElement`**: (optional) Boolean. If `true`, enables KaTeX’s `auto-render` feature to automatically detect and render LaTeX expressions in the target DOM element.

- **`elementRef`**: (optional) Qwik `Signal` used to reference a specific DOM element where LaTeX should be rendered.

- **`elementId`**: (optional) ID of the DOM element where the LaTeX should be rendered when `auto-render` is enabled.

#### Plugin Support

`qwik-latex` includes support for several important KaTeX plugins:

- [**`auto-render`**](https://katex.org/docs/autorender): This plugin enables automatic detection of LaTeX expressions within the specified DOM element. It can be activated by setting `shouldRenderMathInElement` to `true` and providing either a child component, `elementId`, or `elementRef`. This is useful for rendering dynamically loaded content that contains LaTeX.

- [**`mhchem`**](https://github.com/KaTeX/KaTeX/tree/main/contrib/mhchem): This plugin allows for the rendering of chemical equations using LaTeX’s `mhchem` syntax, which is particularly useful in scientific and chemistry-based documentation.

- [**`copy-tex`**](https://github.com/KaTeX/KaTeX/tree/main/contrib/copy-tex): This plugin enables copying of the rendered LaTeX as plain text. When users select and copy the rendered content, the original LaTeX markup is copied, ensuring fidelity in reproducing equations for use in documents or papers.

#### Examples

**Basic Usage:**

```tsx
import { component$ } from "@builder.io/qwik";
import { LaTeX, latex } from "qwik-latex";

export const MyComponent = component$(() => {
  const equation = latex`$f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$`;

  return (
    <div>
      <h1>Theorem:</h1>
      <LaTeX latex={equation} options={{ displayMode: true }} />
    </div>
  );
});
```

This renders the Pythagorean theorem in display mode using KaTeX.

**Custom Macros:**

```tsx
<LaTeX
  latex="f(x) = \\macroA + \\macroB"
  options={{ macros: { "\\macroA": "ax^2", "\\macroB": "bx + c" } }}
/>
```

In this example, custom macros are defined for `\\macroA` and `\\macroB`, allowing for reusable LaTeX components within equations.

**Error Handling:**

```tsx
<LaTeX
  latex="E = mc^"
  options={{ throwOnError: false, errorColor: "#ff0000" }}
/>
```

If there’s an error in the LaTeX string, the invalid part is rendered in red (`#ff0000`), and the component does not throw an error.

**Auto-Rendering LaTeX in an Element:**

```tsx
<div id="math-container">
  This is an equation: \(E = mc^2\)
</div>

<LaTeX shouldRenderMathInElement elementId="math-container" />
```

This example enables the `auto-render` plugin to detect and render LaTeX expressions inside a specified DOM element, using the `elementId`.

**Rendering Chemical Equations:**

```tsx
<LaTeX latex="\ce{H2O + CO2 -> H2CO3}" />
```

```tsx
<LaTeX latex={latex`$C_p[\ce{H2O(l)}] = \pu{75.3 J // mol K}$`} />
```

This renders a chemical equation using the `mhchem` plugin, useful for scientific papers.

#### Conclusion

`qwik-latex` provides a flexible and efficient solution for rendering LaTeX-based equations and scientific notation in Qwik applications. By leveraging KaTeX, it ensures high-performance rendering of complex mathematical and chemical content with support for error handling, custom macros, and KaTeX plugins like `mhchem`, `copy-tex`, and `auto-render`. This makes it suitable for academic and research-based applications where precision and performance are critical.
