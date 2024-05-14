import { HttpMethods } from "../types";
import { RouteData } from "./RouteData";

interface ServerRoute {
  path: string;
  method: HttpMethods;
  routeData: RouteData;
}

export class ServerRoutes {
  #routes: ServerRoute[] = [];

  createRoute(routeData: RouteData, method: HttpMethods, path: string) {
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
    const route = this.#routes.find(
      (route) => route.path === path && route.method === method
    );
    if (!route) {
      console.error("NOT FOUND");
      return;
    }
    await route.routeData.update();
  }
  deleteRoute(method: HttpMethods, path: string) {
    this.#routes = this.#routes.filter(
      (route) => route.path === path && route.method === method
    );
  }
}
