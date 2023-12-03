import DefaultLayout from "@/components/layouts/default";

const start = DefaultLayout({
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
      <img src="/image" />
    </div>
  `,
});

export default start;
