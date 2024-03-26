import DefaultLayout from "@/components/layouts/default";
import { TheRoute } from "@/models/route";

type TemplateProps = {
  title: string;
  text: string;
  id: string;
};
type RemoteProps = {
  id: string;
  email: string;
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
  multiple: {
    source: () =>
      fetch("https://jsonplaceholder.typicode.com/posts/1/comments").then(
        async (res) => {
          const json = await res.json();
          return json as unknown as RemoteProps[];
        }
      ),
    slug: "id",
    propsMap: (remoteProps) => ({
      text: remoteProps.body,
      title: remoteProps.email,
      id: remoteProps.id,
    }),
    crudEndpoints: {
      methods: {
        delete: true,
        patch: true,
        post: true,
      },
      revalidateToken: "123",
    },
  },
} as TheRoute<TemplateProps, RemoteProps>;
