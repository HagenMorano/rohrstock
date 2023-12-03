import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

interface Endpoint {
  path: string;
  template: string;
}

const pagesPath = "pages";
const endpoints: Promise<Endpoint>[] = [];

const fetchHtmlTemplate = async (importPath: string) => {
  const htmlTemplate = (await import(`@/${importPath}`)) as unknown as {
    default: string; // HTMLElement
  };

  return htmlTemplate.default;
};

const generatePageEndpoint = async (filePath: string): Promise<Endpoint> => {
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

  const template = await fetchHtmlTemplate(importPath);

  return {
    path,
    template,
  };
};

const readDirRecursive = (currentPath: string) =>
  readdirSync(currentPath).forEach((file) => {
    const absolute = join(currentPath, file);
    statSync(absolute).isDirectory()
      ? readDirRecursive(absolute)
      : endpoints.push(generatePageEndpoint(absolute));
  });

readDirRecursive(pagesPath);

// Generate all pages endpoints in advance for ultimate performance
Promise.all(endpoints).then((pages) => {
  const server = Bun.serve<{ username: string }>({
    async fetch(req, server) {
      const success = server.upgrade(req);
      if (success) return undefined;

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

      // serve Admin UI
      if (url.pathname === "/admin") {
        const adminPage = await fetchHtmlTemplate("admin/index");
        return new Response(adminPage, {
          headers: {
            "Content-Type": "text/html",
          },
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
    websocket: {
      publishToSelf: true,
      open(ws) {
        const msg = `He has entered the chat`;
        ws.subscribe("admin-ui");
        server.publish("admin-ui", msg);
      },
      message(ws, message) {
        console.log("MESSAGE!", message);
        // the server re-broadcasts incoming messages to everyone
        ws.send("MY MESSAGE");
        server.publish("admin-ui", message);
      },
      close(ws) {
        const msg = "He has left the chat";
        server.publish("admin-ui", msg);
        ws.unsubscribe("admin-ui");
      },
    },
  });
});
