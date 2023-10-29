import {
    teacherRegistration,
    teacherLogin,
    teachersAll,
    teacherID,
    teacherSubject
} from '../controllers/teacher'

async function routes(fastify) {
    fastify.post('/teacher/registration', async (request, reply) => {
        await teacherRegistration(request.body)
        reply.status(201).send({message: "Пользователь успешно зарегестрирован", success: true});
    })

    fastify.post('/teacher/login', async (request, reply) => {
        const token = await teacherLogin(request.body)
        reply.status(201).send({message: token, success: true});
    })

    fastify.get('/teachers', async (request, reply) => {
        const teachers = await teachersAll()
        reply.status(201).send({message: teachers, success: true});
    })

    fastify.get('/teacher/:id', async (request, reply) => {
        const teacher = await teacherID(request.body)
        reply.status(201).send({message: teacher, success: true});
    })

    fastify.get('/teacher/:id/subject', async (request, reply) => {
        const subject = await teacherSubject(request.body)
        reply.status(201).send({message: subject, success: true});
    })
}

module.exports = routes;
