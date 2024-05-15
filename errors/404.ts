import { HttpMethods, ReturnRoute } from "@/server/types";

export default [
  {
    build: () =>
      new Response("<h1>This is a custom 404 page</h1>", {
        headers: {
          "Content-Type": "text/html",
        },
      }),
  },
  {
    method: HttpMethods.POST,
    build: () => new Response("<h1>This is a custom 404 page for a Post</h1>"),
  },
] as ReturnRoute;
