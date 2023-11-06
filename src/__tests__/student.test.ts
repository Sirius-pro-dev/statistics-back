import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { v4 as uuidv4 } from 'uuid';
import StudentController from '../controllers/student';

process.env.SECRET_KEY = 'secret_key';

describe('Student Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('studentLogin', () => {
    it('should login a student and return an access token', async () => {
      const userData = {
        email: 'test@mail.ru',
        password: 'testpassword',
      };

      await StudentController.studentRegistration({
        email: userData.email,
        password: userData.password,
        firstname: 'John',
        lastname: 'Doe',
      });

      const token = await StudentController.studentLogin(userData);

      expect(token).toBeTruthy();
    });

    it('should throw an error for incorrect email or password', async () => {
      const userData = {
        email: 'nonexistentuser@example.com',
        password: 'incorrectpassword',
      };

      await expect(StudentController.studentLogin(userData)).rejects.toThrow('Неправильная почта или пароль');
    });

    it('should throw an error user already exist', async () => {
      const userData = {
        email: 'test@mail.ru',
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe'
      };

      await expect(StudentController.studentRegistration(userData)).rejects.toThrow(`Пользователь c почтой ${userData.email} уже существует`);
    });
  });

  describe('studentsAll', () => {
    it('should return an array of all students', async () => {
      await StudentController.studentRegistration({
        email: 'student1@example.com',
        password: 'password1',
        firstname: 'Alice',
        lastname: 'Smith',
      });

      await StudentController.studentRegistration({
        email: 'student2@example.com',
        password: 'password2',
        firstname: 'Bob',
        lastname: 'Johnson',
      });

      const allStudents = await StudentController.studentsAll();

      expect(allStudents).toHaveLength(3);
    });
  });

  describe('studentID', () => {
    it('should return a student by ID', async () => {
      const newUser = await StudentController.studentRegistration({
        email: uuidv4(),
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe',
      });

      const student = await StudentController.studentID({ id: newUser._id });

      expect(student).toMatchObject({
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
      });
    });

    it('should throw an error for incorrect student ID format', async () => {
      const invalidId = 'invalidId';

      await expect(StudentController.studentID({ id: invalidId })).rejects.toThrow('Некорректный формат идентификатора');
    });

    it('should throw an error if student with given ID does not exist', async () => {
      const nonExistentId = '604f8b2073e2230017f1050f';

      await expect(StudentController.studentID({ id: nonExistentId })).rejects.toThrow('Нет такого студента');
    });
  });

  describe('studentGrades', () => {
    it('should return grades of a student by ID', async () => {
      const newUser = await StudentController.studentRegistration({
        email: uuidv4(),
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe',
      });

      const grades = await StudentController.studentGrades({ id: newUser._id });

      expect(grades).toBeInstanceOf(Array);
    });

    it('should throw an error for incorrect student ID format', async () => {
      const invalidId = 'invalidId';

      await expect(StudentController.studentGrades({ id: invalidId })).rejects.toThrow('Некорректный формат идентификатора');
    });

    it('should throw an error if student with given ID does not exist', async () => {
      const nonExistentId = '604f8b2073e2230017f1050f';

      await expect(StudentController.studentGrades({ id: nonExistentId })).rejects.toThrow('Нет такого студента');
    });
  });

  describe('studentGradesAdd', () => {
    it('should add a grade to the student by ID', async () => {
      const newUser = await StudentController.studentRegistration({
        email: uuidv4(),
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe',
      });

      const newGrade = 4;

      const updatedStudent = await StudentController.studentGradesAdd({ id: newUser._id, grade: newGrade });

      expect(updatedStudent.grades).toHaveLength(1);
      expect(updatedStudent.grades[0]).toEqual(newGrade);
    });

    it('should throw an error for incorrect student ID format', async () => {
      const invalidId = 'invalidId';
      const newGrade = 4;

      await expect(StudentController.studentGradesAdd({ id: invalidId, grade: newGrade })).rejects.toThrow('Некорректный формат идентификатора');
    });

    it('should throw an error if student with given ID does not exist', async () => {
      const nonExistentId = '604f8b2073e2230017f1050f';
      const newGrade = 4;

      await expect(StudentController.studentGradesAdd({ id: nonExistentId, grade: newGrade })).rejects.toThrow('Нет такого студента');
    });

    it('should throw an error for incorrect grade format', async () => {
      const newUser = await StudentController.studentRegistration({
        email: uuidv4(),
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe',
      });

      const invalidGrade = null;

      await expect(StudentController.studentGradesAdd({ id: newUser._id, grade: invalidGrade })).rejects.toThrow('Некорректный формат тела запроса');
    });
  });
});

