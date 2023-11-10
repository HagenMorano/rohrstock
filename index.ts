import van from "mini-van-plate/van-plate";
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

  const Page = (await import(`@/${importPath}`)) as unknown as any;

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

Promise.all(endpoints).then((pages) =>
  Bun.serve({
    fetch(req) {
      const url = new URL(req.url);

      // serve static files from /static
      if (url.pathname.startsWith("/static")) {
        const filePath = "." + new URL(req.url).pathname;
        const file = Bun.file(filePath);
        return new Response(file);
      }

      // serve /pages
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
