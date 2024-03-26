import { ZodSchema } from "zod";

type RemoteSource<TemplateProps = unknown, RemoteProps = unknown> = {
  /**
   * An async function that returns the data for the route.
   * Normally a `fetch` function.
   */
  source: () => Promise<RemoteProps | RemoteProps[]>;
  /**
   * Map remote props to props in the template.
   * @param remoteProps
   * @returns
   */
  propsMap: (remoteProps: RemoteProps) => TemplateProps;
  /**
   * Enable to create additional CRUD endpoints for each generated route.
   * 1. POST endpoint to create a single route
   * Make sure to send a valid body!
   * 2. PATCH endpoint to update a single route
   * Make sure to send a valid body
   * 3. DELETE endpoint to delete a single route
   */
  addCrudEndpoints?: boolean;
};

export type TheRoute<TemplateProps = unknown, RemoteProps = unknown> = {
  /**
   * The body of the route. In most cases a HTML string.
   */
  body: (params: TemplateProps) => BodyInit | null;
  /**
   * Options for the server response, e.g. headers.
   */
  responseInit?: ResponseInit;
  /**
   * Generate route depending on the array returned by `source`.
   */
  single?: RemoteSource<TemplateProps, RemoteProps>;
  /**
   * Generates n routes depending on the array returned by `source`.
   */
  multiple?: RemoteSource<TemplateProps, RemoteProps> & {
    /**
     * Determine the slug of each item of the source.
     */
    slug: keyof RemoteProps;
  };
};