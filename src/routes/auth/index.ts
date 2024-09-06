import { Elysia } from "elysia";
import { register } from "./register";
import { login } from "./login";
import { me } from "./me";

export const auth = new Elysia({
    prefix: "/auth",
  })
  .use(register)
  .use(login)
  .use(me);