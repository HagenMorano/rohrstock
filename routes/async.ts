import DefaultLayout from "@/modules/layouts/default";
import { ReturnRoute } from "@/models/route";

export default {
  prerenderDataFn: async () => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: new Date(),
          text: "My text",
        });
      }, 3000);
    });
  },
  build: ({ prerenderData }) => {
    return new Response(
      DefaultLayout({
        linkAttributes: [
          {
            rel: "stylesheet",
            href: "/static/style.css",
          },
        ],
        pageTitle: "HagenCMS Demo Page",
        page: /*html*/ `
          <div class="title-wrapper">
            <h1>HagenCMS</h1>
            <h2>${prerenderData.title}</h2>
          </div>
        `,
      }),
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  },
} as ReturnRoute;
