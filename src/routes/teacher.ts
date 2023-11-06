import teacherControllers from '../controllers/teacher'

export default async function (fastify) {
    fastify.post('/teacher/registration', async (request, reply) => {
        await teacherControllers.teacherRegistration(request.body)
        reply.status(201).send({message: "Пользователь успешно зарегестрирован", success: true});
    })

    fastify.post('/teacher/login', async (request, reply) => {
        const token = await teacherControllers.teacherLogin(request.body)
        reply.status(201).send({message: token, success: true});
    })

    fastify.get('/teachers', async (request, reply) => {
        const teachers = await teacherControllers.teachersAll()
        reply.status(201).send({message: teachers, success: true});
    })

    fastify.get('/teacher/:id', async (request, reply) => {
        const teacher = await teacherControllers.teacherID(request.body)
        reply.status(201).send({message: teacher, success: true});
    })

    fastify.get('/teacher/:id/subject', async (request, reply) => {
        const subject = await teacherControllers.teacherSubject(request.body)
        reply.status(201).send({message: subject, success: true});
    })
}
