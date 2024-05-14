import { Route } from "../types";
import { ServerRoutes } from "./ServerRoutes";

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
