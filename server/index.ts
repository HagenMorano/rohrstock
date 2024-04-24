import { HttpMethods, readDirRecursive } from "@/server/utils/generateRoutes";

const routes = await readDirRecursive("routes");

const revalidateTokenGetParamKey = "revalidate";

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    // serve static files
    if (url.pathname.startsWith("/static") && req.method === "GET") {
      const filePath = "." + new URL(req.url).pathname;
      const file = Bun.file(filePath);
      return new Response(file);
    }

    // Serve routes from /routes
    const httpMethod = req.method.toUpperCase() as HttpMethods;
    const routeData = routes.readRoute(httpMethod, url.pathname);

    if (routeData) {
      return await routeData.getResponse(req, routes);
    }

    return new Response("THIS PAGE DOES NOT EXIST");
  },
});
