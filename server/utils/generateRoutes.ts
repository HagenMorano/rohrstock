import { TheRoute } from "@/utils/routeTypes";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export interface Endpoint {
  [path: string]: TheRoute;
}
const pagesPath = "routes";

export const readDirRecursive = async (
  currentPath: string,
  endpoints: Endpoint = {}
) => {
  for (const file of readdirSync(currentPath)) {
    const absolute = join(currentPath, file);
    if (statSync(absolute).isDirectory()) {
      await readDirRecursive(absolute, endpoints);
    } else {
      // Mind: needs to be more safe
      // Mind: folder names may contain dots
      // Mind: file names may contain multiple dots
      let path = absolute.split(pagesPath)[1].split(".")[0];
      // Index pages should not have a name
      // Mind: a folder may have 'index' in its name
      path = path.split("/index")[0];
      // Mind: folder names may contain dots
      // Mind: file names may contain multiple dots
      const importPath = absolute.split(".")[0];

      // Mind: check if the import file name includes invalid characters!
      const htmlTemplate = await import(`@/${importPath}`);
      const htmlTemplateWait = (await htmlTemplate.default) as
        | TheRoute
        | TheRoute[];

      if (htmlTemplateWait instanceof Array) {
        htmlTemplateWait.forEach((template) => {
          endpoints[path + template.path ?? ""] = template;
        });
      } else {
        endpoints[!path ? "/" : path] = htmlTemplateWait;
      }
    }
  }
  return endpoints;
};
