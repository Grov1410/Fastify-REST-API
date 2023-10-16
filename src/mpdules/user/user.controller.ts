import {FastifyReply, FastifyRequest} from "fastify";
import {createUser, findUserByEmail, findUsers} from "./user.service";
import {CreateUserInput, LoginInput} from "./user.schema";
import {verifyPassword} from "../../utils/hash";

export async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply){
    const body = request.body;
    try {
        const user = await createUser(body);
        return reply.code(201).send(user);
    } catch (error) {
        console.log(error);
        return reply.code(500).send(error);
    }
}

export async function loginHandler(request: FastifyRequest<{
    Body:LoginInput;
}>, reply: FastifyReply){
    const body = request.body;
    //поиск юзера по почте
    const user = await findUserByEmail(body.email);
    if (!user){
        return reply.code(401).send({
            message: "Некоректный пароль или почта",
        });
    }
    //Проверка пароля
    const correctPassword = verifyPassword({
        candidatePassword:  body.password,
        salt: user.salt,
        hash: user.password,
    });
    if (correctPassword){
        const {password, salt, ...rest}= user;
        //генерация токена
        return { accessToken: request.jwt.sign(rest)};
    }
    return reply.code(401).send({
        message: "Некоректный пароль или почта",
    });
}

export async function getUsersHandker(){
    const users = await findUsers();
    return users;
}