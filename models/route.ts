import { ZodSchema } from "zod";

export type TheRoute<TemplateProps = unknown, RemoteProps = unknown> = {
  body: (params?: any) => BodyInit | null;
  responseInit?: ResponseInit;
  /**
   * Generates n routes depending on the array returned by `source`.
   */
  multiple?: {
    source: () => Promise<RemoteProps[]>;
    /**
     * Determine the path of each item of the source.
     */
    path: keyof RemoteProps;
    /**
     * Map remote props to props in the template.
     * @param remoteProps
     * @returns
     */
    propsMap: (remoteProps: RemoteProps) => TemplateProps;
    /**
     * Enable to create an additional PATCH endpoint for each generated route.
     * The endpoint can be called with updated props for the according route.
     */
    addPatchEndpoint?: boolean;
    /**
     * Optionally provide a zod schema that validates both the remote items
     * and the payload of the revalidate PATCH (if set).
     */
    schema?: ZodSchema;
  };
};
