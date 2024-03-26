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
    revalidateToken: string;
  };
}

interface DeleteEndpointRecords {
  [path: string]: {
    body: BodyInit | null;
    revalidateToken: string;
  };
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
    DELETE: {},
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
      const single = htmlTemplateWait.single;
      const multiple = htmlTemplateWait.multiple;

      if (single) {
        const remoteItem = await single.source();

        const convertRemotePropsToTemplateProps = (remoteParams: unknown) =>
          htmlTemplateWait.body(single.propsMap(remoteParams));

        endpoints.GET[path] = {
          body: htmlTemplateWait.body(single.propsMap(remoteItem)),
          responseInit: {
            headers: {
              "Content-Type": "text/html",
              ...htmlTemplateWait.responseInit?.headers,
            },
            ...htmlTemplateWait.responseInit,
          },
        };
        if (single.crudEndpoints?.methods.patch) {
          endpoints.PATCH[path] = {
            body: "Successfully updated endpoint",
            convertRemotePropsToTemplateProps,
            revalidateToken: single.crudEndpoints.revalidateToken,
          };
        }
      } else if (multiple) {
        const remoteItems = (await multiple.source()) as any[];

        const convertRemotePropsToTemplateProps = (remoteParams: unknown) =>
          htmlTemplateWait.body(multiple.propsMap(remoteParams));

        if (multiple.crudEndpoints?.methods.post) {
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
            revalidateToken: multiple.crudEndpoints.revalidateToken,
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
          if (multiple.crudEndpoints?.methods.patch) {
            endpoints.PATCH[dynamicPath] = {
              body: "Successfully updated endpoint",
              convertRemotePropsToTemplateProps,
              revalidateToken: multiple.crudEndpoints.revalidateToken,
            };
          }
          if (multiple.crudEndpoints?.methods.delete) {
            endpoints.DELETE[dynamicPath] = {
              body: null,
              revalidateToken: multiple.crudEndpoints.revalidateToken,
            };
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
