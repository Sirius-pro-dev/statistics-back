const Student = require('../../models/student');

export default async function (fastify) {
  fastify.get('/students/:id', async (request, reply) => {
    const { id } = request.params;
    const student = await Student.findById(id);
    reply.status(201).send(student);
  });
  fastify.get('/students/:id/grades', async (request, reply) => {
    try {
      const { id } = request.params;
      const student = await Student.findById(id);
      if (!student) {
        reply.status(404).send('Student not found');
        return;
      }
      const averageGrade = student.grades.reduce((a, b) => a + b, 0) / student.grades.length;
      reply.status(200).send({ averageGrade });
    } catch (error) {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    }
  });
  fastify.post('/students/:id/grades', async (request, reply) => {
    try {
      const { id } = request.params;
      const student = await Student.findById(id);
      if (!student) {
        reply.code(404).send('Student not found');
        return;
      }
      const { grade } = request.body;
      student.grades.push(grade);
      await student.save();
      reply.status(201).send({ message: 'Grade added successfully' });
    } catch (error) {
      console.error(error);
      reply.code(500).send('Internal Server Error');
    }
  });
}