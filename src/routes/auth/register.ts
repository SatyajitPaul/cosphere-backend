import { Elysia, t } from "elysia";
import prisma from "../../database/db";
import cookie from "@elysiajs/cookie";
import { randomUUID } from "crypto"
import { registerModel, jwtAccessSetup, jwtRefreshSetup } from "./setup";
import { password } from "bun";


export const register = new Elysia()
    .use(registerModel)
    .use(cookie())
    .use(jwtAccessSetup)
    .use(jwtRefreshSetup)
    .decorate('db', prisma)
    .post(
        "/register",
        async ({body, set, jwtAccess, jwtRefresh, db, cookie: { refresh_token }}) => {
            const existingUser = await prisma.user.findFirst({
                where: {
                  OR: [{ email: body.email }, { username: body.username }],
                },
              });
            if (existingUser) {
                set.status = 400;
                return {
                    message: "We aready have this username or email."
                };
            }
            const hashedPassword = await Bun.password.hash(body.password);
            const refreshId = randomUUID();
            const refreshToken = await jwtRefresh.sign({
                id: refreshId
            })
            const hashedToken = new Bun.CryptoHasher("sha256")
                .update(refreshToken)
                .digest("hex");

            const user = await db.user.create({
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    username: body.username,
                    email: body.email,
                    password: hashedPassword,
                    refreshTokens: {
                        create: {
                          hashedToken,
                          id: refreshId,
                        },
                      },
                    refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
            const accessToken = await jwtAccess.sign({
                id: String(user.id)
            });
            refresh_token.value = refreshToken;
            refresh_token.set({
                httpOnly: true,
                maxAge: 7 * 86400
            });
            return {
                message: "Registration successful!",
                accessToken
            };
        },
        {
            body: "registerModel"
        }
    )