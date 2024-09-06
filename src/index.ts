import { Elysia } from "elysia";
import { auth } from "./routes/auth";

const app = new Elysia()
  .use(auth)
  .get("/", () => "Hello Elysia")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
