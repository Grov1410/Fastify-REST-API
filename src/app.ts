import Fastify from 'fastify';
import userRoutes from "./mpdules/user/user.route";
import { userSchema } from "./mpdules/user/user.schema";
const server = Fastify();
server.get("/healhcheck", async function () {
    return { status: "200"};
})
async function main() {
    server.register(userRoutes, {prefix: "api/users"})
    for (const schema of userSchema){
        server.addSchema(schema);
    }
    try {
        await server.listen(3000, "0.0.0.0");
        console.log("Server ready http://localhost:3000");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
main();