import DefaultLayout from "@/components/layouts/default";
import { TheRoute } from "@/models/route";
import { z } from "zod";

type TemplateProps = {
  title: string;
  text: string;
  id: string;
};

const RemoteSchema = z.object({
  id: z.string(),
  email: z.string(),
  body: z.string(),
});
type RemoteProps = z.infer<typeof RemoteSchema>;

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
    addCrudEndpoints: true,
    schema: RemoteSchema,
  },
} as TheRoute<TemplateProps, RemoteProps>;
