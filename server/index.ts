import readDirRecursive from "./utils/readDirRecursive";
import { ServerRoutes } from "./classes/ServerRoutes";
import importRoute from "./utils/importRoute";
import createServerRoutesFromRouteData from "./utils/createServerRoutesFromRouteData";
import { HttpMethods } from "./types";
import { join } from "path";
import { RouteData } from "./classes/RouteData";

const rootPath = "routes";
const serverRoutes = new ServerRoutes();
const errorRoutes: Record<string, RouteData> = {};

// Populate the serverRoutes
await readDirRecursive(rootPath, async (path) => {
  // Mind: folder names may contain dots
  // Mind: file names may contain multiple dots
  const routeData = await importRoute(path.split(".")[0]);

  await createServerRoutesFromRouteData(
    routeData,
    path.split(rootPath)[1],
    serverRoutes
  );
});

try {
  const routeData = await importRoute(join(rootPath, "404"));
  if (Array.isArray(routeData)) {
    console.error("Please return a single Route for 404.");
    throw Error();
  }
  let prerenderData;
  if (routeData.prerenderDataFn) {
    prerenderData = await routeData.prerenderDataFn();
  }

  errorRoutes["404"] = new RouteData(
    routeData.build,
    prerenderData,
    routeData.prerenderDataFn
  );
} catch (e) {
  console.info("No 404 route defined. Falling back to default.");
  errorRoutes["404"] = new RouteData(
    () =>
      new Response("Page not found", {
        status: 404,
      })
  );
}

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    // Serve routes from /routes
    const httpMethod = req.method.toUpperCase() as HttpMethods;
    const routeData = serverRoutes.readRoute(httpMethod, url.pathname);

    if (routeData) {
      return await routeData.getResponse(req, serverRoutes);
    }

    return errorRoutes["404"].getResponse(req, serverRoutes);
  },
});
