import Teacher from '../../models/teacher';

async function routes(fastify) {
    fastify.get('/teachers', async (request, reply) => {
        try {
            const teachers = await Teacher.find();
            reply.status(200).send(teachers);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    });

    fastify.get('/teachers/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                return reply.status(400).send({ error: 'Некорректный формат идентификатора', success: false });
            }
            const teacher = await Teacher.findById(id);
            if (!teacher) {
                return reply.status(404).send({ error: 'Учитель не найден', success: false });
            }
            reply.status(200).send(teacher);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    });
    
    fastify.get('/teachers/:id/subject', async (request, reply) => {
        try {
            const {id} = request.params;
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                return reply.status(400).send({ error: 'Некорректный формат идентификатора', success: false });
            }
            const teachers = await Teacher.findById(id);
            if (!teachers) {
                reply.status(404).send({ error: "Нет такого учителя", success: false });
                return;
            }
            reply.status(200).send(teachers.subject);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    });
}

module.exports = routes;
