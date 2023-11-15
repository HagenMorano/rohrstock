import van from "mini-van-plate/van-plate";

import DefaultLayout from "@/components/layouts/default";

const { div, h1, img } = van.tags;

const start = DefaultLayout({
  linkAttributes: [
    {
      rel: "stylesheet",
      href: "/static/style.css",
    },
  ],
  pageTitle: "HagenCMS Demo Page",
  page: [
    div({ class: "title-wrapper" }, h1("HagenCMS"), img({ src: "/image" })),
  ],
});

export default start;
