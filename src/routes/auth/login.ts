import { Elysia } from 'elysia';
import { basicAuthModel, jwtAccessSetup, jwtRefreshSetup } from './setup';
import prisma from '../../database/db';
import { randomUUID } from 'crypto';

export const login = new Elysia()
    .use(basicAuthModel)
    .use(jwtAccessSetup)
    .use(jwtRefreshSetup)
    .decorate('db', prisma)
    .post(
        '/login',
        async ({ body, set, jwtAccess,jwtRefresh, db }) => {
            const user = await db.user.findUnique({
                where: {
                    email: body.email,
                }
            });
            if (!user ||!(await Bun.password.verify(body.password, user.password))) {
                set.status = 401;
                return {
                    message: 'Invalid email or password.'
                };
            }
            const refreshId = randomUUID();
            const refreshToken = await jwtRefresh.sign({
                id: refreshId,
            });
            const hashedToken = new Bun.CryptoHasher("sha256")
                .update(refreshToken)
                .digest("hex");
            
                await db.refreshToken.create({
                    data: {
                        userId: user.id,
                        hashedToken,
                        id: refreshId,
                    },
                });
                const accessToken = await jwtAccess.sign({
                    id: String(user.id),
                });
                return {
                    message: "You are loged In",
                    accessToken
                }

        },{
            body: 'basicAuthModel'
        }
    );