import DefaultLayout from "@/components/layouts/default";
import { generateResponse } from "@/utils/routeTypes";

export default generateResponse(() =>
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
  })
);
