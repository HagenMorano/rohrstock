import DefaultLayout from "@/components/layouts/default";
import { TheRoute } from "@/models/route";

export default {
  body: () =>
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
    </div>
  `,
    }),
} as TheRoute;
