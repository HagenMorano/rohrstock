import { readDirRecursive } from "@/server/utils/generateRoutes";

const routes = await readDirRecursive("routes");

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
    if (req.method === "GET") {
      const routeData = Object.entries(routes.GET).find(
        ([path]) => path === url.pathname
      )?.[1];
      if (routeData) {
        return new Response(routeData.body, routeData.responseInit);
      }
    }

    if (req.method === "PATCH") {
      const routeData = Object.entries(routes.PATCH).find(
        ([path]) => path === url.pathname
      )?.[1];
      const routeToUpdate = Object.entries(routes.GET).find(
        ([path]) => path === url.pathname
      )?.[1];
      if (
        routeData &&
        routeData.convertRemotePropsToTemplateProps &&
        routeToUpdate &&
        req.body
      ) {
        try {
          const body = await Bun.readableStreamToText(req.body);
          const bodyJson = JSON.parse(body);

          routeToUpdate.body =
            routeData.convertRemotePropsToTemplateProps(bodyJson);
          return new Response(routeData.body);
        } catch (e) {
          return new Response("FAIL");
        }
      }
    }

    if (req.method === "POST") {
      const pathWithoutLastSegment = `${url.pathname.slice(
        0,
        url.pathname.lastIndexOf("/")
      )}`;
      const lastSegment = url.pathname.split("/").pop();
      const routeData = Object.entries(routes.POST).find(
        ([path]) => path === `${pathWithoutLastSegment}/*`
      )?.[1];
      if (
        routeData &&
        routeData.convertRemotePropsToTemplateProps &&
        req.body
      ) {
        try {
          const body = await Bun.readableStreamToText(req.body);
          const bodyJson = JSON.parse(body);
          routes.DELETE.paths.push(url.pathname);
          routes.GET[url.pathname] = {
            body: routeData.convertRemotePropsToTemplateProps(bodyJson),
            responseInit: routeData.responseInit,
          };
          routes.PATCH[url.pathname] = {
            body: "Successfully updated endpoint",
            convertRemotePropsToTemplateProps:
              routeData.convertRemotePropsToTemplateProps,
          };
          return new Response(routeData.body);
        } catch (e) {
          return new Response("FAILED TO CREATE");
        }
      }
    }

    if (req.method === "DELETE") {
      const pathToDelete = routes.DELETE.paths.find(
        (path) => path === url.pathname
      );
      if (pathToDelete) {
        delete routes.GET[pathToDelete];
        delete routes.PATCH[pathToDelete];
        routes.DELETE.paths = routes.DELETE.paths.filter(
          (path) => path !== pathToDelete
        );
        return new Response(routes.DELETE.body);
      }
    }

    return new Response("THIS PAGE DOES NOT EXIST");
  },
});
