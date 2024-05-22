import { ReturnRoute } from "@/server/types";

export default {
  build: () =>
    new Response("<h1>This is a custom 404 page</h1>", {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "max-age=31536000",
      },
    }),
} as ReturnRoute;
