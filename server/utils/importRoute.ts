import { ReturnRoute } from "../types";

/**
 * Needs to be exported in order to be mockable by tests.
 */
export default async (importPath: string): Promise<ReturnRoute> => {
  // Mind: check if the import file name includes invalid characters!
  const route = await import(`@/${importPath}`);
  return (await route.default) as ReturnRoute;
};
