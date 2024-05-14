import readDirRecursive from "./utils/readDirRecursive";
import { ServerRoutes } from "./classes/ServerRoutes";
import importRoute from "./utils/importRoute";
import createServerRouteFromRouteData from "./utils/createServerRouteFromRouteData";
import generateServerPath from "./utils/generateServerPath";
import { HttpMethods } from "./types";

const rootPath = "routes";

const serverRoutes = new ServerRoutes();

await readDirRecursive(rootPath, async (path) => {
  // Mind: folder names may contain dots
  // Mind: file names may contain multiple dots
  const routeData = await importRoute(path.split(".")[0]);

  const pathWithoutRootPath = path.split(rootPath)[1];

  if (Array.isArray(routeData)) {
    for (const singleRouteData of routeData) {
      await createServerRouteFromRouteData(
        singleRouteData,
        generateServerPath(pathWithoutRootPath, {
          path: singleRouteData.path,
          slug: singleRouteData.slug,
        }),
        serverRoutes
      );
    }
  } else {
    await createServerRouteFromRouteData(
      routeData,
      generateServerPath(pathWithoutRootPath, {
        path: routeData.path,
        slug: routeData.slug,
      }),
      serverRoutes
    );
  }
});

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    // Serve routes from /routes
    const httpMethod = req.method.toUpperCase() as HttpMethods;
    const routeData = serverRoutes.readRoute(httpMethod, url.pathname);

    if (routeData) {
      return await routeData.getResponse(req, serverRoutes);
    }

    return new Response("Page not found", {
      status: 404,
    });
  },
});
