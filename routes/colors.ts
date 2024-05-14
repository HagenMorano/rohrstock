import DefaultLayout from "@/modules/layouts/default";
import { ReturnRoute } from "@/server/types";

export default {
  build: () => {
    return new Response(
      DefaultLayout({
        linkAttributes: [
          {
            rel: "stylesheet",
            href: "/normalize.css",
          },
          {
            rel: "stylesheet",
            href: "/style.css",
          },
        ],
        pageTitle: "HagenCMS Demo Page",
        page: /*html*/ `
      <div>
          <button
            style="position: fixed; right: 0; top: 0"
            onclick="document.documentElement.classList.toggle('dark')">
              Toggle light / dark mode
          </button>
          <article>
              <h1>headline 1</h1>
              <h2>headline 2</h2>
              <h3>headline 3</h3>
              <h4>headline 4</h4>
              <h5>headline 5</h5>
              <h6>headline 6</h6>
              <p>paragraph</p>
              <p><small>small</small></p>
          </article>
          <h2 class="h4">Colors</h2>
          <h3 class="h5">Primary</h3>
          <div class="grid">
              <div class="color-cell" style="background: var(--clr-primary-100)"></div>
              <div class="color-cell" style="background: var(--clr-primary-200)"></div>
              <div class="color-cell" style="background: var(--clr-primary-300)"></div>
              <div class="color-cell" style="background: var(--clr-primary-400)"></div>
              <div class="color-cell" style="background: var(--clr-primary-500)"></div>
              <div class="color-cell" style="background: var(--clr-primary-600)"></div>
              <div class="color-cell" style="background: var(--clr-primary-700)"></div>
              <div class="color-cell" style="background: var(--clr-primary-800)"></div>
              <div class="color-cell" style="background: var(--clr-primary-900)"></div>
          </div>
          <h3 class="h5">Secondary</h3>
          <div class="grid">
              <div class="color-cell" style="background: var(--clr-secondary-100)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-200)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-300)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-400)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-500)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-600)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-700)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-800)"></div>
              <div class="color-cell" style="background: var(--clr-secondary-900)"></div>
          </div>
          <h2 class="h4">Spacings</h2>
          <h3 class="h5">Space lg</h3>
          <div style="background: var(--clr-primary-200); padding: var(--space-lg);">
              <div class="spacing-cell"></div>
          </div>
          <h3 class="h5">Space md</h3>
          <div style="background: var(--clr-primary-200); padding: var(--space-md);">
              <div class="spacing-cell"></div>
          </div>
          <h3 class="h5">Space sm</h3>
          <div style="background: var(--clr-primary-200); padding: var(--space-sm);">
              <div class="spacing-cell"></div>
          </div>
      </div>
    `,
      }),
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  },
} as ReturnRoute;
