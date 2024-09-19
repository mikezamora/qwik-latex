import { LaTeX } from "./components/latex/Latex";


export default () => {
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <title>Qwik LaTeX</title>
      </head>
      <body style={{background: "#cccccc"}}>
        <h1>Qwik LaTeX</h1>
        <LaTeX 
        options={{}}
        latex="$f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$"/>
<LaTeX latex="\[
\mathbf{y}(t) = \sum_{i=1}^{n} \int_{a}^{b} \mathbf{A}_i(t) \cdot \mathbf{x}_i(\tau) e^{\mathbf{B}_i(t-\tau)} \, d\tau + \mathbf{C}(t)
\]
"/>
      </body>
    </>
  );
};
