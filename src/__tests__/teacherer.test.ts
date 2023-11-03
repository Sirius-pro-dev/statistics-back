import { describe, it, jest, expect, beforeAll } from '@jest/globals'
import { fastify } from '../server'
import Teacher from '../models/teacher'
import request from 'supertest'

jest.mock('../connect.ts',  () => {
    return {
        connect: async () => {
            console.log('Test Mock')
        }
    }
})

describe('teacher test', () => {
  beforeAll(async () => {
    await fastify.ready()
    await require('../setupTest')();
  })

  afterAll(async () => {
    setTimeout(() => {
      Teacher.findOneAndDelete({ email: 'test@example.com' })
      fastify.close()
    }, 5000)
  })

  describe('teacher routes', () => {
    describe('POST /teacher/registration', () => {
      it('201 check in successfully', () => {
        request(fastify.server)
            .post('/teacher/registration')
            .send({
                email: 'test@example.com',
                password: 'testpassword',
                firstname: 'Jane',
                lastname: 'Doe'
            })
            .expect(201)
      })

      it('500 incorrect data', () => {
        request(fastify.server)
            .post('/teacher/registration')
            .send({
                email: 'testexample.com',
                password: 'testpassword',
                firstname: 'Jane',
                lastname: 'Doe'
            })
            .expect(500)
      })

      it('500 failure mandatory fields', () => {
        request(fastify.server)
            .post('/teacher/registration')
            .send({
                password: 'testpassword',
                firstname: 'Jane',
                lastname: 'Doe'
            })
            .expect(500)
      })
    })

    describe('POST /teacher/login', () => {
      it('201 check in successfully', () => {
        request(fastify.server)
            .post('/teacher/login')
            .send({
                email: 'test@example.com',
                password: 'testpassword'
            })
            .expect(201)
      })

      it('500  incorrect data', () => {
        request(fastify.server)
        .post('/teacher/login')
        .send({
            email: 'testexample.com',
            password: 'testpassword'
        })
        .expect(500)
      })

      it('500 failure mandatory fields', () => {
        request(fastify.server)
        .post('/teacher/login')
        .send({
            password: 'testpassword'
        })
        .expect(500)
      })
    })
  })

//   describe('teacher controllers', () => {})
//   describe('teacher auth', () => {})
})
