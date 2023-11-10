import van from "mini-van-plate/van-plate";

import DefaultLayout from "@/components/layouts/default";

const { h1 } = van.tags;

const start = DefaultLayout({
  linkAttributes: [
    {
      rel: "stylesheet",
      href: "/static/style.css",
    },
  ],
  pageTitle: "HagenCMS Demo Page",
  page: [h1("HagenCMS")],
});

export default start;