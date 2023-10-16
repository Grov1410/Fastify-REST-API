import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import swagger from "fastify-swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./mpdules/user/user.route";
import productRoutes from "./mpdules/product/product.route";
import { userSchemas } from "./mpdules/user/user.schema";
import { productSchemas } from "./mpdules/product/product.schema";
import { version } from "../package.json";

declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT;
    }
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "fastify-jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            email: string;
            name: string;
        };
    }
}

function buildServer() {
    const server = Fastify();

    server.register(fjwt, {
        secret: "ndkandnan78duy9sau87dbndsa89u7dsy789adb",
    });

    server.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch (e) {
                return reply.send(e);
            }
        }
    );

    server.get("/healthcheck", async function () {
        return { status: "OK" };
    });

    server.addHook("preHandler", (req, reply, next) => {
        req.jwt = server.jwt;
        return next();
    });

    for (const schema of [...userSchemas, ...productSchemas]) {
        server.addSchema(schema);
    }

    server.register(
        swagger,
        withRefResolver({
            routePrefix: "/docs",
            exposeRoute: true,
            staticCSP: true,
            openapi: {
                info: {
                    title: "Fastify API",
                    description: "API for some products",
                    version,
                },
            },
        })
    );

    server.register(userRoutes, { prefix: "api/users" });
    server.register(productRoutes, { prefix: "api/products" });

    return server;
}

export default buildServer;