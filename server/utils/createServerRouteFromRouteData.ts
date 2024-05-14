import { RouteData } from "../classes/RouteData";
import { ServerRoutes } from "../classes/ServerRoutes";
import { HttpMethods, Route } from "../types";

export default async (
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
