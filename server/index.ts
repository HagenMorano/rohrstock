import readDirRecursive from "./utils/readDirRecursive";
import { ServerRoutes } from "./classes/ServerRoutes";
import importRoute from "./utils/importRoute";
import createServerRoutesFromRouteData from "./utils/createServerRoutesFromRouteData";
import { HttpMethods } from "./types";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const rootPath = "routes";
const serverRoutes = new ServerRoutes();

const errorRootPath = "errors";
const errorServerRoutes = new ServerRoutes();

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

// Populate the errorServerRoutes
for (const file of readdirSync(errorRootPath)) {
  const path = join(errorRootPath, file);
  // Omit folders in errors folder
  if (!statSync(path).isDirectory()) {
    // Mind: folder names may contain dots
    // Mind: file names may contain multiple dots
    const routeData = await importRoute(path.split(".")[0]);

    await createServerRoutesFromRouteData(
      routeData,
      path.split(errorRootPath)[1],
      errorServerRoutes
    );
  }
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

    const errorRouteData = errorServerRoutes.readRoute(httpMethod, "/404");

    return errorRouteData
      ? await errorRouteData.getResponse(req, serverRoutes)
      : new Response("Page not found", {
          status: 404,
        });
  },
});
