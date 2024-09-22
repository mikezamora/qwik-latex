import { component$, useId, useSignal } from "@builder.io/qwik";
import { ClipboardInput } from "./components/clipboard/ClipboardInput";
import "./global.css";
import { latex, LaTeX } from ".";

export default component$(() => {
  const outputRef = useSignal<Element>();

  const id = useId();
  const elementId = `${id}-test-elementId`;
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <title>Qwik LaTeX</title>
      </head>
      <body class="bg-zinc-300 p-4">
        <h1 class="pb-4 text-4xl text-blue-500">Qwik LaTeX</h1>
        <h2 class="text-2xl text-blue-700">LaTeX Examples</h2>
        <p class="text-md ">Rendering LaTex via 'latex' prop</p>
        <div class="m-4 pb-4">
          <LaTeX
            latex={latex`\[
  \mathbf{y}(t) = \sum_{i=1}^{n} \int_{a}^{b} \mathbf{A}_i(t) \cdot \mathbf{x}_i(\tau) e^{\mathbf{B}_i(t-\tau)} \, d\tau + \mathbf{C}(t)
  \]
  `}
          />
        </div>

        <h2 class="text-2xl ">Extension Demos</h2>
        <h3 class="text-xl text-blue-700">auto-render</h3>
        <p>Render Math in Element</p>
        <div class="p-4">
          <div class="pb-4">
            <h4 class="pb-2"> - Via 'elementRef'</h4>
            <div ref={outputRef}>
              <p>
                {latex`$f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$`}
              </p>
            </div>
            <LaTeX shouldRenderMathInElement elementRef={outputRef} />
          </div>

          <div class="pb-4">
            <h4 class="pb-2"> - Via 'elementId'</h4>
            <p id={elementId}>
              {latex`$\displaystyle \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }$
        $\displaystyle \left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)$`}
            </p>
            <LaTeX shouldRenderMathInElement elementId={elementId} />
          </div>

          <div class="pb-4">
            <h4 class="pb-2"> - Via 'Slot' child components</h4>
            <LaTeX shouldRenderMathInElement>
              <p>
                {latex`$\displaystyle {1 +  \frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots }= \prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}, \quad\quad \text{for }\lvert q\rvert<1.$`}
              </p>
            </LaTeX>
          </div>
        </div>
        <h3 class="text-xl text-blue-700">mhchem</h3>
        <p class="">Render Chemistry equations</p>
        <div class="p-4">
          <LaTeX latex="$\ce{CO2 + C -> 2 CO}$"></LaTeX>
        </div>

        <h3 class="text-xl text-blue-700">copy-tex</h3>
        <p class="">Copy TeX source to clipboard</p>
        <div class="flex p-4">
          <LaTeX shouldRenderMathInElement>
            <p>{latex`$C_p[\ce{H2O(l)}] = \pu{75.3 J // mol K}$`}</p>
          </LaTeX>
          <ClipboardInput class="ml-8 flex-grow"></ClipboardInput>
        </div>
      </body>
    </>
  );
});
