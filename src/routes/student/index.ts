import Student from '../../models/student';
const errorByID = require('../../json/students/byID/error.json')

async function routes(fastify) {
  fastify.get('/students/:id', async (request, reply) => {
    try {
      const {id} = request.params;
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return reply.status(400).send({ error: 'Некорректный формат идентификатора', success: false });
      }
      const student = await Student.findById(id);
      if (!student) {
        reply.status(404).send(errorByID);
        return;
      }
      reply.status(200).send(student);
    } catch (error) {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    }
  });
  fastify.get('/students/:id/grades', async (request, reply) => {
    try {
      const {id} = request.params;
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return reply.status(400).send({ error: 'Некорректный формат идентификатора', success: false });
      }
      const student = await Student.findById(id);
      if (!student) {
        reply.status(404).send(errorByID);
        return;
      }
      reply.status(200).send(student.grades);
    } catch (error) {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    }
  });
  fastify.post('/students/:id/grades', async (request, reply) => {
    try {
      const {id} = request.params;
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return reply.status(400).send({ error: 'Некорректный формат идентификатора', success: false });
      }
      const student = await Student.findById(id);
      if (!student) {
        reply.status(404).send(errorByID);
        return;
      }
      const { grade } = request.body;
      if (!grade) {
        return reply.status(400).send({ error: 'Некорректный формат тела запроса', success: false });
      }
      student.grades.push(grade);
      await student.save();
      reply.status(201).send({message: 'Оценка успешно добавлена', success: true});
    } catch (error) {
      console.error(error);
      reply.code(500).send('Internal Server Error');
    }
  });
  fastify.post('/students/', async (request, reply) => {
    try {
      const student = new Student(request.body);
      await student.save();
      reply.status(201).send({message: 'Студент создан', success: true});
    } catch (error) {
      console.error(error);
      reply.code(500).send('Internal Server Error');
    }
  });
}

module.exports = routes;
