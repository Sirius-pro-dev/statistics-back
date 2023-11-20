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
// =====================================================================================================================
    // 655b4a341615f9f619cab31b
    fastify.post('/student/course', async (request, reply) => {
        const students = await studentControllers.studentsCourse(request.body)
        reply.status(201).send({message: students, success: true});
    })

    fastify.post('/student/specialty', async (request, reply) => {
        const students = await studentControllers.studentsSpecialty(request.body)
        reply.status(201).send({message: students.length, success: true});
    })

    fastify.post('/student/passList/:id', async (request, reply) => {
        const attendance = await studentControllers.studentsPassList(request.params, request.body)
        reply.status(201).send({message: attendance, success: true});
    })

    fastify.post('/student/passListAdd/:id', async (request, reply) => {
        const attendance = await studentControllers.studentsPassListAdd(request.params, request.body)
        reply.status(201).send({message: attendance, success: true});
    })

    fastify.get('/student/scholarship/:id', async (request, reply) => {
        const attendance = await studentControllers.studentsScholarship(request.params)
        reply.status(201).send({message: attendance, success: true});
    })

    fastify.get('/student/formOfTraining/:id', async (request, reply) => {
        const attendance = await studentControllers.studentsFormOfTraining(request.params)
        reply.status(201).send({message: attendance, success: true});
    })

    fastify.get('/student/studentsGrades/:id', async (request, reply) => {
        const attendance = await studentControllers.studentGrades(request.params)
        reply.status(201).send({message: attendance, success: true});
    })
// =====================================================================================================================
    fastify.get('/students', async (request, reply) => {
        const students = await studentControllers.studentsAll()
        reply.status(201).send({message: students, success: true})
    })

    fastify.get('/student/:id', async (request, reply) => {
        const student = await studentControllers.studentID(request.params)
        reply.status(201).send({message: student, success: true})
    })

    // fastify.get('/student/:id/grades', async (request, reply) => {
    //     const grades = await studentControllers.studentGrades(request.params)
    //     reply.status(201).send({message: grades, success: true})
    // })

    fastify.post('/student/:id/grades', {preHandler: [authMiddleware]}, async (request, reply) => {
        await studentControllers.studentGradesAdd(request.params, request.body)
        reply.status(201).send({message: "Оценка добавлена", success: true});
    })
}
