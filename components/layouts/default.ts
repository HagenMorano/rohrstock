import { title } from "node:process";

interface Props {
  // props are incomplete!
  metaAttributes?: {
    charset: string;
    content: string;
    name: string;
  }[];
  // props are incomplete!
  linkAttributes?: {
    rel: string;
    href: string;
  }[];
  // props are incomplete!
  scriptAttributes?: {
    src: string;
    defer?: string;
  }[];
  pageTitle?: string;
  page: string; // HTMLElement
}

export default ({
  metaAttributes,
  linkAttributes,
  scriptAttributes,
  pageTitle,
  page,
}: Props) => /*html*/ `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${
      metaAttributes
        ?.map(
          (attr) =>
            `<meta 
            ${Object.entries(attr)
              .map(([key, value]) => `${key}="${value}" `)
              .join("")}
          />`
        )
        .join("") || ""
    }
    ${
      linkAttributes
        ?.map(
          (attr) =>
            `<link 
            ${Object.entries(attr)
              .map(([key, value]) => `${key}="${value}" `)
              .join("")}
          />`
        )
        .join("") || ""
    }
    ${
      scriptAttributes
        ?.map(
          (attr) =>
            `<script 
            ${Object.entries(attr)
              .map(([key, value]) => `${key}="${value}" `)
              .join("")}
          />`
        )
        .join("") || ""
    }
    <title>${pageTitle || "HagenCMS"}</title>
  </head>
  <body>
    ${page}
  </body>
</html>
`;
