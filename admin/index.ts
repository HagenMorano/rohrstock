import van from "mini-van-plate/van-plate";

import DefaultLayout from "@/components/layouts/default";

const { div, h1 } = van.tags;

const start = DefaultLayout({
  scriptAttributes: [
    {
      src: "/static/websocket.js",
    },
  ],
  linkAttributes: [
    {
      rel: "stylesheet",
      href: "/static/admin.css",
    },
  ],
  pageTitle: "HagenCMS Admin Page",
  page: [div({ class: "title-wrapper" }, h1("BsUT2Z"))],
});

export default start;
