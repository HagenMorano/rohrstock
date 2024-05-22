import { RouteData } from "../classes/RouteData";
import { ServerRoutes } from "../classes/ServerRoutes";
import { HttpMethods, Route } from "../types";
import generateServerPath from "./generateServerPath";

const createServerRouteFromRouteData = async (
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
    new RouteData(
      routeData.build,
      prerenderData,
      routeData.prerenderDataFn,
      routeData.routeId
    ),
    routeData.method || HttpMethods.GET, // default to "GET"
    path || "/" // default to "/" (= index)
  );
};

export default async (
  routeData: Route | Route[],
  path: string,
  serverRoutes: ServerRoutes
) => {
  if (Array.isArray(routeData)) {
    for (const singleRouteData of routeData) {
      await createServerRouteFromRouteData(
        singleRouteData,
        generateServerPath(path, {
          path: singleRouteData.path,
          slug: singleRouteData.slug,
        }),
        serverRoutes
      );
    }
  } else {
    await createServerRouteFromRouteData(
      routeData,
      generateServerPath(path, {
        path: routeData.path,
        slug: routeData.slug,
      }),
      serverRoutes
    );
  }
};
