import { Elysia } from 'elysia';
import prisma from '../../database/db';
import { isAuthenticated } from '../../middlewares/isAuthenticated';



export const me  = new Elysia()
    .use(isAuthenticated)
    .decorate('db', prisma)
    .get('/me', async function handler({ user }){
        if(!user){
            throw new Error('Not authenticated')
        }  
        return {
            success: true,
            data: user
        }
      } )