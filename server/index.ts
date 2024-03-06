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
        if (!req.body) {
          return new Response("BODY IS EMPTY");
        }
        try {
          const body = await Bun.readableStreamToText(req.body);
          pages[path].template.body = pages[path].revalidate(JSON.parse(body));
        } catch (e) {
          return new Response("FAIL");
        }
        return new Response("OK");
      }
      if (req.method === "GET") {
        return new Response(
          routeData.template.body,
          routeData.template.options
        );
      }
    }

    return new Response("Bun!");
  },
});
