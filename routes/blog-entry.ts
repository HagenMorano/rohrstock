import DefaultLayout from "@/components/layouts/default";
import { TheRoute } from "@/models/route";

type TemplateProps = {
  title: string;
  text: string;
  id: string;
};
type RemoteProps = {
  id: string;
  title: string;
  body: string;
};

export default {
  body: ({ title, text }) =>
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
  single: {
    source: () =>
      fetch("https://jsonplaceholder.typicode.com/posts/1").then(
        async (res) => {
          const json = await res.json();
          return json as unknown as RemoteProps;
        }
      ),
    propsMap: (remoteProps) => ({
      text: remoteProps.body,
      title: remoteProps.title,
      id: remoteProps.id,
    }),
    addCrudEndpoints: true,
  },
} as TheRoute<TemplateProps, RemoteProps>;
