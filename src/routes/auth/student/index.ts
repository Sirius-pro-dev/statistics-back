import Student from "../../../models/student";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
}

async function routes(fastify) {
    fastify.post('/students/registration', async (request, reply) => {
        const {email, password, firstname, lastname} = request.body;
        const candidate = await Student.findOne({email});
        if (candidate) {
            return reply.status(400).send({message: "Пользователь с такой почтой уже существует", success: false});
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const student = new Student({email, password: hashPassword, firstname, lastname});
        student.save();
        reply.status(201).send({message: "Пользователь успешно зарегестрирован", success: true});
    });
    fastify.post('/students/login', async (request, reply) => {
        const {email, password} = request.body;
        const student = await Student.findOne({email});
        if (!student) {
            return reply.status(400).send({message: "Пользователь не найден", success: false});
        }
        const validPassword = bcrypt.compareSync(password, student.password);
        if (!validPassword) {
            return reply.status(400).send({message: "Неверный пароль", success: false});
        }
        const token = generateAccessToken(student._id, student.role);
        return reply.status(200).send({token})
    });
}

module.exports = routes;
