import DefaultLayout from "@/modules/layouts/default";
import { ReturnRoute } from "@/server/types";

export default {
  build: ({ req }) => {
    return new Response(
      DefaultLayout({
        linkAttributes: [
          {
            rel: "stylesheet",
            href: "/style.css",
          },
        ],
        pageTitle: "HagenCMS Demo Page",
        page: /*html*/ `
          <div class="title-wrapper">
            <h1>HagenCMS</h1>
            <h2>${JSON.stringify(req.headers)}</h2>
          </div>
        `,
      }),
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  },
} as ReturnRoute;
