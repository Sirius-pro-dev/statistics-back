import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { v4 as uuidv4 } from 'uuid';
import TeacherController from '../controllers/teacher';

process.env.SECRET_KEY = 'secret_key';

describe('Teacher Controller', () => {
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

  describe('teacherLogin', () => {
    it('should login a teacher and return an access token', async () => {
      const userData = {
        email: 'test@mail.ru',
        password: 'testpassword',
      };

      await TeacherController.teacherRegistration({
        email: userData.email,
        password: userData.password,
        firstname: 'John',
        lastname: 'Doe',
      });

      const token = await TeacherController.teacherLogin(userData);

      expect(token).toBeTruthy();
    });

    it('should throw an error for incorrect email or password', async () => {
      const userData = {
        email: 'nonexistentuser@example.com',
        password: 'incorrectpassword',
      };

      await expect(TeacherController.teacherLogin(userData)).rejects.toThrow('Неправильная почта или пароль');
    });

    it('should throw an error user already exist', async () => {
      const userData = {
        email: 'test@mail.ru',
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe'
      };

      await expect(TeacherController.teacherRegistration(userData)).rejects.toThrow(`Пользователь c почтой ${userData.email} уже существует`);
    });
  });

  describe('teachersAll', () => {
    it('should return an array of all teachers', async () => {
      await TeacherController.teacherRegistration({
        email: 'teacher1@example.com',
        password: 'password1',
        firstname: 'Alice',
        lastname: 'Smith',
      });

      await TeacherController.teacherRegistration({
        email: 'teacher2@example.com',
        password: 'password2',
        firstname: 'Bob',
        lastname: 'Johnson',
      });

      const allTeachers = await TeacherController.teachersAll();

      expect(allTeachers).toHaveLength(3);
    });
  });

  describe('teacherID', () => {
    it('should return a teacher by ID', async () => {
      const newUser = await TeacherController.teacherRegistration({
        email: uuidv4(),
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe',
      });

      const teacher = await TeacherController.teacherID({ id: newUser._id });

      expect(teacher).toMatchObject({
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
      });
    });

    it('should throw an error for incorrect teacher ID format', async () => {
      const invalidId = 'invalidId';

      await expect(TeacherController.teacherID({ id: invalidId })).rejects.toThrow('Некорректный формат идентификатора');
    });

    it('should throw an error if teacher with given ID does not exist', async () => {
      const nonExistentId = '604f8b2073e2230017f1050f';

      await expect(TeacherController.teacherID({ id: nonExistentId })).rejects.toThrow('Нет такого учителя');
    });
  });

  describe('teacherSubject', () => {
    it('should return subject of a teacher by ID', async () => {
      const newUser = await TeacherController.teacherRegistration({
        email: uuidv4(),
        password: 'testpassword',
        firstname: 'John',
        lastname: 'Doe',
      });

      const subject = await TeacherController.teacherSubject({ id: newUser._id });

      expect(subject).toBe(undefined)
    });

    it('should throw an error for incorrect teacher ID format', async () => {
      const invalidId = 'invalidId';

      await expect(TeacherController.teacherSubject({ id: invalidId })).rejects.toThrow('Некорректный формат идентификатора');
    });

    it('should throw an error if student with given ID does not exist', async () => {
      const nonExistentId = '604f8b2073e2230017f1050f';

      await expect(TeacherController.teacherSubject({ id: nonExistentId })).rejects.toThrow('Нет такого учителя');
    });
  });
});

