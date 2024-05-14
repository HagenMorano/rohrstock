import { Route } from "../types";

export default (
  filePath: string,
  options?: {
    path?: Route["path"];
    slug?: Route["slug"];
  }
): string => {
  // Mind: needs to be more safe
  // Mind: folder names may contain dots
  // Mind: file names may contain multiple dots
  let path = filePath.split(".")[0];
  // Index pages should not have and do not need a name.
  // Mind: a folder may have 'index' in its name
  path = path.split("/index")[0];
  if (options?.path) {
    const pathItems = path.split("/");
    path = options.path + pathItems[pathItems.length - 1];
  }
  if (options?.slug) {
    let pathItems = path.split("/");
    pathItems[pathItems.length - 1] = options.slug;
    path = pathItems.join("/");
  }
  return path;
};
