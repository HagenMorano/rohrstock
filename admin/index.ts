import DefaultLayout from "@/components/layouts/default";

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
  page: /*html*/ `<div>ADMIN</div>`,
});

export default start;
