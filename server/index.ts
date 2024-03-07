import { readDirRecursive } from "@/server/utils/generateRoutes";

const pages = await readDirRecursive("routes");

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    // serve static files
    if (url.pathname.startsWith("/static") && req.method === "GET") {
      const filePath = "." + new URL(req.url).pathname;
      const file = Bun.file(filePath);
      return new Response(file);
    }

    // serve public pages from /pages
    // TODO Object.entries(pages)
    const endpoint = Object.entries(pages).find(
      ([path]) => path === url.pathname
    );

    if (endpoint) {
      const [path, routeData] = endpoint;
      if (req.method === "PATCH") {
        const revalidate = pages[path].revalidate;
        if (!req.body) {
          return new Response("BODY IS EMPTY");
        }
        if (!revalidate) {
          return new Response("REVALIDATION IS DISABLED");
        }
        try {
          const body = await Bun.readableStreamToText(req.body);
          const bodyJson = JSON.parse(body);

          pages[path].body = revalidate(bodyJson);
        } catch (e) {
          return new Response("FAIL");
        }
        return new Response("OK");
      }
      if (req.method === "GET") {
        return new Response(routeData.body, routeData.responseInit);
      }
    }

    return new Response("Bun!");
  },
});
