import { ReturnRoute } from "@/models/route";
import { HttpMethods } from "@/server/utils/generateRoutes";

export default {
  build: async ({ serverRoutes }) => {
    await serverRoutes.updateRoute(HttpMethods.GET, "/async");
    return new Response("success");
  },
} as ReturnRoute;
