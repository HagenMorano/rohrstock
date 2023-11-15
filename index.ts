import van, { Element } from "mini-van-plate/van-plate";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

interface Endpoint {
  path: string;
  template: string;
}

const pagesPath = "pages";
const endpoints: Promise<Endpoint>[] = [];

const generateEndpoint = async (filePath: string): Promise<Endpoint> => {
  // Mind: needs to be more safe
  // Mind: folder names may contain dots
  // Mind: file names may contain multiple dots
  let path = filePath.split(pagesPath)[1].split(".")[0];
  // Index pages should not have a name
  // Mind: a folder may have 'index' in its name
  path = path.split("index")[0];
  // Mind: folder names may contain dots
  // Mind: file names may contain multiple dots
  const importPath = filePath.split(".")[0];

  const Page = (await import(`@/${importPath}`)) as unknown as {
    default: Element;
  };

  return {
    path,
    template: van.html(Page.default),
  };
};

const readDirRecursive = (currentPath: string) =>
  readdirSync(currentPath).forEach((file) => {
    const absolute = join(currentPath, file);
    statSync(absolute).isDirectory()
      ? readDirRecursive(absolute)
      : endpoints.push(generateEndpoint(absolute));
  });

readDirRecursive(pagesPath);

// Generate all pages endpoints in advance for ultimate performance
Promise.all(endpoints).then((pages) =>
  Bun.serve({
    async fetch(req) {
      const url = new URL(req.url);

      // serve static files
      if (
        url.pathname.startsWith("/assets") ||
        url.pathname.startsWith("/static")
      ) {
        const filePath = "." + new URL(req.url).pathname;
        const file = Bun.file(filePath);
        return new Response(file);
      }

      // optimize images via imgproxy container
      if (url.pathname.startsWith("/image")) {
        const res = await fetch(
          "http://hagencms-imgproxy:8080/_/resize:fill:300:400:0/plain/http://hagencms-server:3000/assets/full_placeholder.png@jpg"
        );

        // proxy response from imgproxy
        return new Response(res.body, {
          status: res.status,
          headers: res.headers,
        });
      }

      // serve public pages from /pages
      const pageData = pages.find((page) => page.path === url.pathname);
      if (pageData) {
        return new Response(pageData.template, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      }
      return new Response("Bun!");
    },
  })
);
