import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";


export const basicAuthModel = new Elysia().model({
    basicAuthModel: t.Object({
        email: t.String({
            format: 'email'
        }),
        password: t.String()
    })
});

export const registerModel = new Elysia().model({
    registerModel: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        username: t.String(),
        email: t.String({
            format: 'email'
        }),
        password: t.String({
            minLength: 8,
        })
    })
});

export const jwtAccessSetup = new Elysia({
    name: "jwtAccess"
}).use(
    jwt({
        name: "jwtAccess",
        schema: t.Object({
            id: t.String()
        }),
        secret: process.env.JWT_ACCESS_SECRET!,
        exp: "5m"
    })
);

export const jwtRefreshSetup = new Elysia({
    name: "jwtRefresh"
}).use(
    jwt({
        name: "jwtRefresh",
        schema: t.Object({
            id: t.String()
        }),
        secret: process.env.JWT_ACCESS_SECRET!,
        exp: "7d"
    })
);