import { HttpMethods, ServerRoutes } from "@/server/utils/generateRoutes";

export type Route<T = any> = {
  build: (buildData: {
    req: Request;
    serverRoutes: ServerRoutes;
    prerenderData?: T;
  }) => Promise<Response> | Response;
  prerenderDataFn?: () => Promise<T> | T;
  // This is especially handy if you return multiple routes
  slug?: string;
  method?: HttpMethods;
};

export type ReturnRoute = Route | Route[] | Promise<Route | Route[]>;
