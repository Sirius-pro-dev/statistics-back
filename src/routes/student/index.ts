const Student = require('../../models/student');
const studentByID = require('../../json/students/byID/success.json')
const errorByID = require('../../json/students/byID/error.json')
const grades = require('../../json/students/grades/success.json')
const gradesError = require('../../json/students/grades/error.json')

async function routes(fastify) {
  fastify.get('/students/:id', async (request, reply) => {
    try {
      const id  = request.params.id;
      const student = await studentByID;
      if (student.body.id != id) {
        reply.status(404).send(errorByID);
        return;
      }
      reply.status(201).send(studentByID.body);
    } catch (error) {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    }
  });
  fastify.get('/students/:id/grades', async (request, reply) => {
    try {
      const id = request.params.id;
      const student = await studentByID;
      if (student.body.id != id) {
        reply.status(404).send(gradesError);
        return;
      }
      reply.status(200).send(grades);
    } catch (error) {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    }
  });
  fastify.post('/students/:id/grades', async (request, reply) => {
    try {
      const id = request.params.id;
      const student = await studentByID;
      if (student.body.id != id) {
        reply.code(404).send(errorByID);
        return;
      }
      const grade = request.body.grade;
      student.body.grades.push(grade);
      reply.status(201).send(grades);
    } catch (error) {
      console.error(error);
      reply.code(500).send('Internal Server Error');
    }
  });
}

module.exports = routes;
