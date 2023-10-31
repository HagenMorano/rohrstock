import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import StartPage from "@/pages/index";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<StartPage messages={messages} />);
});

export default app;
