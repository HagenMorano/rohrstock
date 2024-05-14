import { ReturnRoute } from "@/server/types";

export default [
  {
    build: () => {
      return new Response("success 1");
    },
    slug: "sync-1",
  },
  {
    build: () => {
      return new Response("231");
    },
    slug: "sync-2",
  },
] as ReturnRoute;
