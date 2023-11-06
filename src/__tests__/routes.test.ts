import supertest from 'supertest';
import { fastify } from '../server';
import studentControllers from '../controllers/student';
import teacherControllers from '../controllers/teacher';
import { mocked } from 'jest-mock';
import * as authMiddlewareModule from '../middleware/authMiddleware';
jest.mock('../controllers/student');
jest.mock('../controllers/teacher');
jest.mock('../middleware/authMiddleware', () => ({
  ...jest.requireActual('../middleware/authMiddleware'),
  authMiddleware: jest.fn(),
}));

const mockStudent = {
  email: 'test@example.com',
  password: 'testpassword',
  firstname: 'John',
  lastname: 'Doe',
};

const mockTeacher = {
  email: 'test@example.com',
  password: 'testpassword',
  firstname: 'John',
  lastname: 'Doe',
};

describe('Student Routes', () => {
  beforeAll(async () => {
    await fastify.ready();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /student/registration should return 201', async () => {
    const mockRegistration = mocked(studentControllers.studentRegistration).mockResolvedValueOnce({} as any);

    const response = await supertest(fastify.server)
      .post('/student/registration')
      .send(mockStudent);

    expect(response.status).toBe(201);
    expect(mockRegistration).toHaveBeenCalledWith(mockStudent);
  });

  test('POST /student/login should return 201', async () => {
    const mockLogin = mocked(studentControllers.studentLogin).mockResolvedValueOnce('mocked-token');

    const response = await supertest(fastify.server)
      .post('/student/login')
      .send(mockStudent);

    expect(response.status).toBe(201);
    expect(mockLogin).toHaveBeenCalledWith(mockStudent);
  });

  test('GET /students should return 201', async () => {
    const mockStudentsAll = mocked(studentControllers.studentsAll).mockResolvedValueOnce([{ student: 'data' }] as any);

    const response = await supertest(fastify.server)
      .get('/students');

    expect(response.status).toBe(201);
    expect(mockStudentsAll).toHaveBeenCalled();
  });

  test('GET /student/:id should return 201', async () => {
    const mockStudentID = mocked(studentControllers.studentID).mockResolvedValueOnce({ _id: '123' } as any);
  
    const response = await supertest(fastify.server)
      .get('/student/123');
  
    expect(response.status).toBe(201);
  });

  test('GET /student/:id/grades should return 201', async () => {
    const mockStudentGrades = mocked(studentControllers.studentGrades).mockResolvedValueOnce([{ grade: 100 }] as any);

    const response = await supertest(fastify.server)
      .get('/student/123/grades');

    expect(response.status).toBe(201);
  });

  test('POST /student/:id/grades should return 201', async () => {
    const mockAuthMiddleware = (authMiddlewareModule.authMiddleware as any).mockImplementationOnce((req, res, next) => {
      // Мокируем поведение middleware для преподавателя
      req.headers.authorization = 'Bearer valid_teacher_token'; // Предположим, что это токен преподавателя
      next();
    });
  
    const mockStudentGradesAdd = jest.spyOn(studentControllers, 'studentGradesAdd').mockResolvedValueOnce({ message: 'Grade added' } as any);
  
    const response = await supertest(fastify.server)
      .post('/student/123/grades')
      .set('Authorization', 'Bearer valid_student_token')
      .send({ grade: 90 });
  
    expect(response.status).toBe(201);
    expect(mockAuthMiddleware).toHaveBeenCalled();
  });
});

describe('Teacher Routes', () => {
  beforeAll(async () => {
    await fastify.ready();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /teacher/registration should return 201', async () => {
    const mockRegistration = mocked(teacherControllers.teacherRegistration).mockResolvedValueOnce({} as any);

    const response = await supertest(fastify.server)
      .post('/teacher/registration')
      .send(mockTeacher);

    expect(response.status).toBe(201);
    expect(mockRegistration).toHaveBeenCalledWith(mockTeacher);
  });

  test('POST /teacher/login should return 201', async () => {
    const mockLogin = mocked(teacherControllers.teacherLogin).mockResolvedValueOnce('mocked-token');

    const response = await supertest(fastify.server)
      .post('/teacher/login')
      .send(mockTeacher);

    expect(response.status).toBe(201);
    expect(mockLogin).toHaveBeenCalledWith(mockTeacher);
  });

  test('GET /teacher should return 201', async () => {
    const mockTeachersAll = mocked(teacherControllers.teachersAll).mockResolvedValueOnce([{ teacher: 'data' }] as any);

    const response = await supertest(fastify.server)
      .get('/teachers');

    expect(response.status).toBe(201);
    expect(mockTeachersAll).toHaveBeenCalled();
  });

  test('GET /teacher/:id should return 201', async () => {
    const mockTeacherID = mocked(teacherControllers.teacherID).mockResolvedValueOnce({ _id: '123' } as any);
  
    const response = await supertest(fastify.server)
      .get('/teacher/123');
  
    expect(response.status).toBe(201);
  });

  test('GET /teacher/:id/subject should return 201', async () => {
    const mockTeacherSubject = mocked(teacherControllers.teacherSubject).mockResolvedValueOnce([{ _id: '123' }] as any);

    const response = await supertest(fastify.server)
      .get('/teacher/123/subject');

    expect(response.status).toBe(201);
  });

});
