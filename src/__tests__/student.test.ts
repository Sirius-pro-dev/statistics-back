import { describe, it, jest, expect, beforeAll } from '@jest/globals'
import { fastify } from '../server'
import Student from '../models/student'
import { request } from 'http'

describe('student test', () => {
  beforeAll(async () => {
        await fastify.ready()
  })

  afterAll(async () => {
    await Student.findOneAndDelete({ email: 'test@example.com'})
    await fastify.close()
  })

  describe('student routes', () => {
  })

  describe('student controllers', () => {
  })

  describe('student auth', () => {
  })
})
