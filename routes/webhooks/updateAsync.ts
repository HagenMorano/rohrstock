import { HttpMethods, ReturnRoute } from "@/server/types";

export default {
  build: async ({ serverRoutes }) => {
    await serverRoutes.updateRoute(HttpMethods.GET, "/async");
    return new Response("success");
  },
} as ReturnRoute;
