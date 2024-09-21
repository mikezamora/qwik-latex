import { LaTeX } from "./components/latex/Latex";

export default () => {
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <title>Qwik LaTeX</title>
        {/* <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js" integrity="sha384-HORx6nWi8j5/mYA+y57/9/CZc5z8HnEw4WUZWy5yOn9ToKBv1l58vJaufFAn9Zzi" crossorigin="anonymous"></script> */}
      </head>
      <body style={{ background: "#cccccc" }}>
        <h1>Qwik LaTeX</h1>
        <LaTeX
          options={{}}
          latex={String.raw`$f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$`}
        />
        <LaTeX
          latex={String.raw`\[
\mathbf{y}(t) = \sum_{i=1}^{n} \int_{a}^{b} \mathbf{A}_i(t) \cdot \mathbf{x}_i(\tau) e^{\mathbf{B}_i(t-\tau)} \, d\tau + \mathbf{C}(t)
\]
`}
        />
        <LaTeX latex="$\ce{CO2 + C -> 2 CO}$"></LaTeX>
      </body>
    </>
  );
};
