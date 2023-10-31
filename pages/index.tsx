import type { FC } from "hono/jsx";
import DefaultLayout from "@/layouts/default";

const StartPage: FC<{ messages: string[] }> = (props: {
  messages: string[];
}) => {
  return (
    <DefaultLayout
      linkAttributes={[
        {
          rel: "stylesheet",
          href: "/static/style.css",
        },
      ]}
    >
      <h1>Hello Hono!</h1>
      {props.messages.map((message) => {
        return <p>{message}!!</p>;
      })}
    </DefaultLayout>
  );
};

export default StartPage;
