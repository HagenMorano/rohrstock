import { ReturnRoute } from "@/models/route";

export default new Promise((resolve) => {
  resolve([
    {
      build: () => {
        return new Response("success");
      },
      slug: "my-slug",
    },
    {
      build: () => {
        return new Response("3");
      },
      slug: "my-slug-2/custom-path",
    },
  ]);
}) as ReturnRoute;
