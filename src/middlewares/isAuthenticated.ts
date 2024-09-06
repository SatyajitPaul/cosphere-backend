import type { Elysia } from "elysia";
import { jwtAccessSetup } from "../routes/auth/setup";
import prisma from "../database/db";

export const isAuthenticated = (app: Elysia) => 
    app
        .use(jwtAccessSetup)
        .decorate('db', prisma)
        .derive(async ({ db, jwtAccess, set, request: { headers }}) => {
            const authorization = headers.get('Authorization');
            if(!authorization){
                set.status = 401;
                return {
                    message: 'Invalid Authorization',
                    success: false,
                    data: null
                }
            }
            const token = authorization.split(' ')[1];
            if(!token){
                set.status = 401;
                return {
                    message: 'Invalid Authorization',
                    success: false,
                    data: null
                }
            }
            const payload = await jwtAccess.verify(token);
            if(!payload){
                set.status = 401;
                return {
                    message: 'Invalid Authorization',
                    success: false,
                    data: null
                }
            }
            const { id } = payload;
            const user = await db.user.findUnique({
                where: {
                    id: String(id),
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    type: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            if(!user){
                set.status = 401;
                return {
                    message: 'Invalid Authorization',
                    success: false,
                    data: null
                }
            }
            return {
                user,
            }
        })