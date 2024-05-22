import { HttpMethods, Route } from "../types";
import { RouteData } from "./RouteData";

interface ServerRoute {
  path: string;
  method: HttpMethods;
  routeData: RouteData;
}

export class ServerRoutes {
  #routes: ServerRoute[] = [];

  createRoute(routeData: RouteData, method: HttpMethods, path: string) {
    console.log(`Creating "${method} ${path}"`);
    this.#routes.push({
      path,
      method,
      routeData,
    });
  }

  readRoute(method: HttpMethods, path: string): RouteData | undefined {
    return this.#routes.find(
      (route) => route.path === path && route.method === method
    )?.routeData;
  }

  async updateRoute(method: HttpMethods, path: string) {
    console.log(`Updating "${method} ${path}"`);
    const route = this.#routes.find(
      (route) => route.path === path && route.method === method
    );
    if (!route) {
      console.error(`Could not update "${method} ${path}". Route not found.`);
      return;
    }
    await route.routeData.update();
  }

  async updateRouteByRouteId(routeId: Route["routeId"]) {
    console.log(`Updating by routeId "${routeId}"`);
    const route = this.#routes.find(
      (route) => route.routeData.getRouteId() === routeId
    );
    if (!route) {
      console.error(
        `Could not update route with id "${routeId}". Route not found.`
      );
      return;
    }
    await route.routeData.update();
  }

  deleteRoute(method: HttpMethods, path: string) {
    console.log(`Deleting ${method} ${path}`);
    this.#routes = this.#routes.filter(
      (route) => !(route.path === path && route.method === method)
    );
  }

  deleteRouteByRouteId(routeId: Route["routeId"]) {
    console.log(`Deleting by routeId "${routeId}"`);
    this.#routes = this.#routes.filter(
      (route) => route.routeData.getRouteId() !== routeId
    );
  }
}
