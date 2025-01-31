import { ServerRoutes } from "./classes/ServerRoutes";

export const enum HttpMethods {
  "GET" = "GET",
  "POST" = "POST",
  "PATCH" = "PATCH",
  "PUT" = "PUT",
  "DELETE" = "DELETE",
}

export type Route<T = any> = {
  build: (buildData: {
    req: Request;
    serverRoutes: ServerRoutes;
    prerenderData?: T;
  }) => Promise<Response> | Response;

  prerenderDataFn?: () => Promise<T> | T;

  method?: HttpMethods;

  /**
   * This is especially handy if you return multiple routes
   * and want to dynamically create slugs e.g. by title.
   * Typically used for blog entries.
   */
  slug?: string;

  /**
   * Overrides the path generated by the folder structure
   * without the filename (use `slug` to override this value).
   * Handy if you want to group e.g. static files that should
   * be served on root `/` in a `static` folder.
   */
  path?: string;

  /**
   * When set, enables accessing a routes update and delete function.
   *
   * Scenario: Your CMS sends you a DELETE request with a blog item id
   * within e.g. a webhook.
   * As the `ServerRoutes` are read by the http method and path, you
   * won't be able to delete (or update) the according route.
   *
   * Example:
   * `serverRoutes.updateRouteByRouteId(\`blog-item-${blogItemId}\`)`
   */
  routeId?: string;
};

export type ReturnRoute<T = unknown> =
  | Route<T>
  | Route<T>[]
  | Promise<Route<T> | Route<T>[]>;
