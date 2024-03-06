import DefaultLayout from "@/components/layouts/default";
import { generateResponse } from "@/utils/routeTypes";

type TemplateProps = {
  title: string;
  text: string;
};

type RemoteProps = {
  id: string;
  email: string;
  body: string;
};

export default generateResponse<TemplateProps, RemoteProps>(
  ({ title, text }) =>
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
      <h1>${title}</h1>
      <p>${text}</p>
    </div>
  `,
    }),
  {
    multiple: true,
    source: "https://jsonplaceholder.typicode.com/posts/1/comments",
    path: "id",
    propsMap: [
      ["email", "title"],
      ["body", "text"],
    ],
    revalidate: true,
  }
);
