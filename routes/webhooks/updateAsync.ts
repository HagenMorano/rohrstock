import { HttpMethods, ReturnRoute } from "@/server/types";

export default {
  build: async ({ serverRoutes }) => {
    await serverRoutes.updateRoute(HttpMethods.GET, "/async");
    // see routeId in /async
    await serverRoutes.updateRouteByRouteId("MyRouteId");
    return new Response("success");
  },
} as ReturnRoute;
