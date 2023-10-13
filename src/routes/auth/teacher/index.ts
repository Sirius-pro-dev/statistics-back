import Teacher from "../../../models/teacher";
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
  // fastify.post('/teachers/registration', async (request, reply) => {
  //   try {
  //     const {email, password, firstname, lastname, subject} = request.body;
  //     const candidate = await Teacher.findOne({email});
  //     if (candidate) {
  //       return reply.status(400).send({message: "Пользователь с такой почтой уже существует", success: false});
  //     }
  //     const hashPassword = bcrypt.hashSync(password, 7);
  //     const teacher = new Teacher({email, password: hashPassword, firstname, lastname, subject});
  //     teacher.save();
  //     reply.status(201).send({message: "Пользователь успешно зарегестрирован", success: true});
  //   } catch (error) {
  //     console.error(error);
  //     reply.status(500).send('Internal Server Error');
  //   }
  // });
  fastify.post('/teachers/login', async (request, reply) => {
    try {
      const {email, password} = request.body;
      const teacher = await Teacher.findOne({email});
      if (!teacher) {
        return reply.status(400).send({message: "Пользователь не найден", success: false});
      }
      const validPassword = bcrypt.compareSync(password, teacher.password);
      if (!validPassword) {
        return reply.status(400).send({message: "Неверный пароль", success: false});
      }
      const token = generateAccessToken(teacher._id, teacher.role);
      return reply.status(200).send({token})
    } catch (error) {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    }
  });
}

module.exports = routes;