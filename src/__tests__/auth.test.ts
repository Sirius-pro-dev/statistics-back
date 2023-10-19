import { describe, it, jest, expect, beforeAll } from '@jest/globals';
import { fastify } from '../server';
import Student from '../models/student'

describe('auth', () => {
  beforeAll(async () => {
        await fastify.ready()
  })

  describe('student-auth', () => {
    describe('POST /students/registration', () => {
      it('should return 201 status code: registration is successful', async () => {
        const response = await fastify.inject({
          method: 'POST',
          url: `/students/registration`,
          body: {
            email: 'test@example.com',
            password: 'testpassword',
            firstname: 'Jane',
            lastname: 'Doe'
          }
        });
  
        expect(response.statusCode).toBe(201);
      });
  
      it('should return 400 status code: user already exists', async () => {
        const response = await fastify.inject({
          method: 'POST',
          url: `/students/registration`,
          body: {
            email: 'test@example.com',
            password: 'testpassword',
            firstname: 'Jane',
            lastname: 'Doe'
          }
        });
  
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe('POST /students/login', () => {
      it('should return 200 status code: login is successful', async () => {
        const response = await fastify.inject({
          method: 'POST',
          url: `/students/login`,
          body: {
            email: 'test@example.com',
            password: 'testpassword'
          }
        });
  
        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty('token');
      });
  
      it('should return 400 status code and success: false if user does not exist', async () => {
        const response = await fastify.inject({
          method: 'POST',
          url: `/students/login`,
          payload: {
            email: 'nonexistent@example.com',
            password: 'testpassword'
          }
        });
  
        expect(response.statusCode).toBe(400);
      });
  
      it('should return 400 status code and success: false if password is incorrect', async () => {
          const response = await fastify.inject({
          method: 'POST',
          url: `/students/login`,
          body: {
              email: 'test@example.com',
              password: 'incorrectpassword'
              }
          });
      
          expect(response.statusCode).toBe(400);
          });
      });  
  })

  describe('teacher-auth', () => {
    describe('POST /teachers/login', () => {
      it('should return 200 status code: login is successful', async () => {
        const response = await fastify.inject({
          method: 'POST',
          url: `/teachers/login`,
          body: {
            email: process.env.TEACHER_EMAIL,
            password: process.env.TEACHER_PASSWORD
          }
        });
  
        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty('token');
      });
  
      it('should return 400 status code and success: false if user does not exist', async () => {
        const response = await fastify.inject({
          method: 'POST',
          url: `/teachers/login`,
          payload: {
            email: 'test@mail.ru',
            password: 'testpassword'
          }
        });
  
        expect(response.statusCode).toBe(400);
      });
  
      it('should return 400 status code and success: false if password is incorrect', async () => {
          const response = await fastify.inject({
          method: 'POST',
          url: `/teachers/login`,
          body: {
              email: process.env.TEACHER_EMAIL,
              password: 'incorrectpassword'
              }
          });
      
          expect(response.statusCode).toBe(400);
          });
      });  
  })
  afterAll(async () => {
    await Student.findOneAndDelete({ email: 'test@example.com'})
    await fastify.close()
  });
});
