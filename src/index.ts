import { Elysia } from "elysia";
import { auth } from "./routes/auth";
import { cors } from '@elysiajs/cors'

const app = new Elysia()
  .use(auth)
  .use(cors(
    {
      origin: "http://localhost:4200",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  ))
  .get("/", () => "Hello Elysia")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
