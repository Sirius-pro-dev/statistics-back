import studentControllers from '../controllers/student'
import {authMiddleware} from '../middleware/authMiddleware'

export default async function (fastify) {
    fastify.post('/student/registration', async (request, reply) => {
        await studentControllers.studentRegistration(request.body)
        reply.status(201).send({message: "Пользователь успешно зарегестрирован", success: true});
    })

    fastify.post('/student/login', async (request, reply) => {
        const token = await studentControllers.studentLogin(request.body)
        reply.status(201).send({message: token, success: true});
    })

    fastify.get('/students', async (request, reply) => {
        const students = await studentControllers.studentsAll()
        reply.status(201).send({message: students, success: true})
    })

    fastify.get('/student/:id', async (request, reply) => {
        const student = await studentControllers.studentID(request.body)
        reply.status(201).send({message: student, success: true})
    })

    fastify.get('/student/:id/grades', async (request, reply) => {
        const grades = await studentControllers.studentGrades(request.body)
        reply.status(201).send({message: grades, success: true})
    })

    fastify.post('/student/:id/grades', {preHandler: [authMiddleware]}, async (request, reply) => {
        await studentControllers.studentGradesAdd(request.body)
        reply.status(201).send({message: "Оценка добавлена", success: true});
    })
}
