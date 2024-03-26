import { TheRoute } from "@/models/route";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const pagesPath = "routes";

interface GetEndpointRecords {
  [path: string]: {
    body: BodyInit | null;
    responseInit?: ResponseInit;
  };
}

interface UpdateEndpointRecords {
  [path: string]: {
    body: BodyInit | null;
    responseInit?: ResponseInit;
    // See `propsMap` in TheRoute.multiple
    convertRemotePropsToTemplateProps: (
      remoteProps: unknown
    ) => BodyInit | null;
  };
}

interface DeleteEndpointRecords {
  body: BodyInit | null;
  paths: string[];
}

export interface Endpoint {
  GET: GetEndpointRecords;
  POST: UpdateEndpointRecords;
  PATCH: UpdateEndpointRecords;
  // Contains paths that can be removed by a DELETE request
  DELETE: DeleteEndpointRecords;
}

export const readDirRecursive = async (
  currentPath: string,
  endpoints: Endpoint = {
    GET: {},
    POST: {},
    PATCH: {},
    DELETE: {
      body: "Successfully removed",
      paths: [],
    },
  }
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
      const htmlTemplateWait = (await htmlTemplate.default) as TheRoute;
      const multiple = htmlTemplateWait.multiple;

      if (multiple) {
        const remoteItems = await multiple.source();

        const convertRemotePropsToTemplateProps = (remoteParams: unknown) =>
          htmlTemplateWait.body(multiple.propsMap(remoteParams));

        if (multiple.addCrudEndpoints) {
          endpoints.POST[`${path}/*`] = {
            body: "Successfully created endpoint",
            responseInit: {
              headers: {
                "Content-Type": "text/html",
                ...htmlTemplateWait.responseInit?.headers,
              },
              ...htmlTemplateWait.responseInit,
            },
            convertRemotePropsToTemplateProps,
          };
        }

        remoteItems.forEach((remoteProps: any) => {
          const dynamicPath = path + "/" + remoteProps[multiple.slug];
          endpoints.GET[dynamicPath] = {
            body: htmlTemplateWait.body(multiple.propsMap(remoteProps)),
            responseInit: {
              headers: {
                "Content-Type": "text/html",
                ...htmlTemplateWait.responseInit?.headers,
              },
              ...htmlTemplateWait.responseInit,
            },
          };
          if (multiple.addCrudEndpoints) {
            endpoints.PATCH[dynamicPath] = {
              body: "Successfully updated endpoint",
              convertRemotePropsToTemplateProps,
            };
            endpoints.DELETE.paths.push(dynamicPath);
          }
        });
      } else {
        endpoints.GET[!path ? "/" : path] = {
          body: htmlTemplateWait.body(),
          responseInit: {
            headers: {
              "Content-Type": "text/html",
              ...htmlTemplateWait.responseInit?.headers,
            },
            ...htmlTemplateWait.responseInit,
          },
        };
      }
    }
  }
  return endpoints;
};
