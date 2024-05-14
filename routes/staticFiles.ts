import { ReturnRoute, Route } from "@/server/types";
import readDirRecursive from "@/server/utils/readDirRecursive";
import { file } from "bun";
import { brotliCompressSync } from "zlib";

export default new Promise(async (resolve) => {
  const staticResponses: Route[] = [];
  await readDirRecursive("static", async (path) => {
    const staticFile = file(path);
    let response: BodyInit | null = staticFile;
    let contentEncoding = false;
    // This can be extended to other files, e.g. js
    if (staticFile.type.includes("text/css")) {
      const fileBuffer = await staticFile.arrayBuffer();
      response = brotliCompressSync(new Uint8Array(fileBuffer));
      contentEncoding = true;
    }
    staticResponses.push({
      build: () => {
        return new Response(response, {
          headers: {
            ...(contentEncoding && { "Content-Encoding": "br" }),
            "Content-type": staticFile.type,
          },
        });
      },
      slug: path.split("static/")[1],
      path: "/",
    });
  });

  resolve(staticResponses);
}) as ReturnRoute;
