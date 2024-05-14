import { ReturnRoute, Route } from "@/models/route";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const pagesPath = "routes";

export enum HttpMethods {
  "GET" = "GET",
  "POST" = "POST",
  "PATCH" = "PATCH",
  "PUT" = "PUT",
  "DELETE" = "DELETE",
}

interface ServerRoute {
  path: string;
  routeData: RouteData;
}

export class ServerRoutes {
  #routes: { [key in HttpMethods]: ServerRoute[] } = {
    GET: [],
    POST: [],
    PATCH: [],
    PUT: [],
    DELETE: [],
  };

  createRoute(routeData: RouteData, method: HttpMethods, path: string) {
    this.#routes[method].push({
      path,
      routeData,
    });
  }
  readRoute(method: HttpMethods, path: string): RouteData | undefined {
    return this.#routes[method].find((route) => route.path === path)?.routeData;
  }
  async updateRoute(method: HttpMethods, path: string) {
    const route = this.#routes[method].find((route) => route.path === path);
    if (!route) {
      console.error("NOT FOUND");
      return;
    }
    await route.routeData.update();
  }
  deleteRoute(method: HttpMethods, path: string) {
    this.#routes[method] = this.#routes[method].filter(
      (route) => route.path === path
    );
  }
}

export class RouteData {
  #build: Route["build"];
  #prerenderData: any;
  #prerenderDataFn: Route["prerenderDataFn"];

  constructor(
    build: Route["build"],
    prerenderData: any,
    prerenderDataFn: Route["prerenderDataFn"]
  ) {
    this.#build = build;
    if (prerenderData) {
      this.#prerenderData = prerenderData;
    }
    if (prerenderDataFn) {
      this.#prerenderDataFn = prerenderDataFn;
    }
  }

  async getResponse(req: Request, serverRoutes: ServerRoutes) {
    return await this.#build({
      req,
      serverRoutes,
      prerenderData: this.#prerenderData,
    });
  }

  async update() {
    if (!this.#prerenderDataFn) {
      console.error("No prerenderDataFn set");
      return;
    }
    this.#prerenderData = await this.#prerenderDataFn();
  }
}

export const generateServerPath = (
  filePath: string,
  customSlug?: Route["slug"]
): string => {
  // Mind: needs to be more safe
  // Mind: folder names may contain dots
  // Mind: file names may contain multiple dots
  let path = filePath.split(pagesPath)[1].split(".")[0];
  // Index pages should not have and do not need a name.
  // Mind: a folder may have 'index' in its name
  path = path.split("/index")[0];
  if (customSlug) {
    let pathItems = path.split("/");
    pathItems[pathItems.length - 1] = customSlug;
    path = pathItems.join("/");
  }
  return path;
};

/**
 * Needs to be exported in order to be mockable by tests.
 */
export const importRoute = async (importPath: string): Promise<ReturnRoute> => {
  // Mind: check if the import file name includes invalid characters!
  const route = await import(`@/${importPath}`);
  return (await route.default) as ReturnRoute;
};

export const createRouteFromRouteData = async (
  routeData: Route,
  path: string,
  serverRoutes: ServerRoutes
) => {
  let prerenderData;

  console.log("render", path);
  if (routeData.prerenderDataFn) {
    prerenderData = await routeData.prerenderDataFn();
  }

  serverRoutes.createRoute(
    new RouteData(routeData.build, prerenderData, routeData.prerenderDataFn),
    routeData.method || HttpMethods.GET, // default to "GET"
    path || "/" // default to "/" (= index)
  );
};

export const readDirRecursive = async (
  currentPath: string,
  serverRoutes: ServerRoutes = new ServerRoutes()
) => {
  for (const file of readdirSync(currentPath)) {
    const absoluteFilePath = join(currentPath, file);
    if (statSync(absoluteFilePath).isDirectory()) {
      await readDirRecursive(absoluteFilePath, serverRoutes);
    } else {
      // Mind: folder names may contain dots
      // Mind: file names may contain multiple dots
      const routeData = await importRoute(absoluteFilePath.split(".")[0]);

      if (Array.isArray(routeData)) {
        for (const singleRouteData of routeData) {
          await createRouteFromRouteData(
            singleRouteData,
            generateServerPath(absoluteFilePath, singleRouteData.slug),
            serverRoutes
          );
        }
      } else {
        await createRouteFromRouteData(
          routeData,
          generateServerPath(absoluteFilePath, routeData.slug),
          serverRoutes
        );
      }
    }
  }
  return serverRoutes;
};
