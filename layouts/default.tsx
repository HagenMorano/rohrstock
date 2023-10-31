import type { FC } from "hono/jsx";

interface Props {
  metaAttributes?: Hono.MetaHTMLAttributes[];
  linkAttributes?: Hono.LinkHTMLAttributes[];
  scriptAttributes?: Hono.ScriptHTMLAttributes[];
}

const DefaultLayout: FC<Props> = ({
  metaAttributes,
  linkAttributes,
  scriptAttributes,
  children,
}) => {
  return (
    <html>
      <head>
        {metaAttributes?.map((attr) => (
          <meta {...attr}></meta>
        ))}
        {linkAttributes?.map((attr) => (
          <link {...attr}></link>
        ))}
        {scriptAttributes?.map((attr) => (
          <script {...attr}></script>
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
};

export default DefaultLayout;
