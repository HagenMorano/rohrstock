export type TheRoute = {
  path?: string;
  // body and options are the two params for a new Response()
  template: {
    body: BodyInit | null;
    options?: ResponseInit;
  };
  // takes update remote props and returns new body for template
  revalidate?: (props: any) => string;
};
type ResponseFormat = "html" | "json";

export const generateResponse = async <TemplateProps, RemoteProps>(
  body: (params: TemplateProps) => string,
  options?: {
    format?: ResponseFormat;
    revalidate?: boolean;
    multiple: boolean;
    source: string;
    path: keyof RemoteProps;
    propsMap: [keyof RemoteProps, keyof TemplateProps][];
  }
): Promise<TheRoute | TheRoute[]> => {
  let contentType: string;
  switch (options?.format) {
    case "json":
      contentType = "application/json";
      break;
    default:
      contentType = "text/html";
  }

  // No options? Regular static HTML Response
  if (!options) {
    return {
      template: {
        // @Todo how to trigger with optional params?
        body: body(),
        options: {
          headers: { "Content-Type": contentType },
        },
      },
    };
  }

  // Fetch from provided resource link
  const response = (await (
    await fetch(options.source)
  ).json()) as RemoteProps[];

  const mapRemotePropsToTemplateProps = (
    apiEntry: RemoteProps
  ): TemplateProps => {
    // @Todo again, we need the params to check if the propsMap is complete
    return options.propsMap.reduce(
      (o, mapItem) => ({ ...o, [mapItem[1]]: apiEntry[mapItem[0]] }),
      {}
    );
  };

  return response.map((apiEntry) => ({
    path: "/" + apiEntry[options.path],
    template: {
      body: body(mapRemotePropsToTemplateProps(apiEntry)),
      options: {
        headers: { "Content-Type": contentType },
      },
    },
    revalidate: (remoteProps: RemoteProps) =>
      body(mapRemotePropsToTemplateProps(remoteProps)),
  }));
};
