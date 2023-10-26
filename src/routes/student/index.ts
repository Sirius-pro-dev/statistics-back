import Student from '../../models/student';

const errorByID = require('../../json/students/byID/error.json')
const authMiddleware = require('../../middleware/authMiddleware');

async function routes(fastify) {
    fastify.get('/students', async (request, reply) => {
        const students = await Student.find();
        reply.status(200).send(students);
    });

    fastify.get('/students/:id', async (request, reply) => {
        const {id} = request.params;
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return reply.status(400).send({error: 'Некорректный формат идентификатора', success: false});
        }
        const student = await Student.findById(id);
        if (!student) {
            reply.status(404).send(errorByID);
            return;
        }
        reply.status(200).send(student);
    });

    fastify.get('/students/:id/grades', async (request, reply) => {
        const {id} = request.params;
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return reply.status(400).send({error: 'Некорректный формат идентификатора', success: false});
        }
        const student = await Student.findById(id);
        if (!student) {
            reply.status(404).send(errorByID);
            return;
        }
        reply.status(200).send(student.grades);
    });
    fastify.post('/students/:id/grades', {preHandler: [authMiddleware]}, async (request, reply) => {
        const {id} = request.params;
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return reply.status(400).send({error: 'Некорректный формат идентификатора', success: false});
        }
        const student = await Student.findById(id);
        if (!student) {
            reply.status(404).send(errorByID);
            return;
        }
        const {grade} = request.body;
        if (!grade) {
            return reply.status(400).send({error: 'Некорректный формат тела запроса', success: false});
        }
        student.grades.push(grade);
        await student.save();
        reply.status(201).send({message: 'Оценка успешно добавлена', success: true});
    });
}

module.exports = routes;
