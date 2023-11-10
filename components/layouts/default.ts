import van, { ChildDom } from "mini-van-plate/van-plate";

const { html, body, head, meta, link, script, title } = van.tags;

interface Props {
  // props may be incomplete!
  metaAttributes?: {
    charset: string;
    content: string;
    name: string;
  }[];
  // props may be incomplete!
  linkAttributes?: {
    rel: string;
    href: string;
  }[];
  // props may be incomplete!
  scriptAttributes?: {
    src: string;
    defer: string;
  }[];
  pageTitle?: string;
  page: ChildDom;
}

export default ({
  metaAttributes,
  linkAttributes,
  scriptAttributes,
  pageTitle,
  page,
}: Props) =>
  html(
    head(
      meta({ charset: "UTF-8" }),
      meta({
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      }),
      metaAttributes?.map((attr) => meta(attr)),
      linkAttributes?.map((attr) => link(attr)),
      scriptAttributes?.map((attr) => script(attr)),
      title(pageTitle || "HagenCMS")
    ),
    body(page)
  );