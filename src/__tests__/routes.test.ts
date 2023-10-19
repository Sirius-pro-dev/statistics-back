import { describe, it, jest, expect, beforeAll } from '@jest/globals';
import { fastify } from '../server';

describe('Student routes', () => {
  beforeAll(async () => {
      await fastify.ready()
  })

  describe('get-students', () => {
    it('get-students', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: `/students`
      });

      expect(response.statusCode).toBe(200);
    })
  })

  describe('get-student', () => {
    it('get-student', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: `/students/65295f1195be303756f8760d`
      });

      expect(response.statusCode).toBe(200);
    })

    it('400', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/students/1'
      });

      expect(response.statusCode).toBe(400);
    })
    
    it('404', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/students/65295f1195be303756f8760e'
      });

      expect(response.statusCode).toBe(404);
    })
  })

  describe('get-student-grades', () => {
    it('get-student-grades', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: `/students/65295f1195be303756f8760d/grades`
      });

      expect(response.statusCode).toBe(200);
    })

    it('400', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/students/1/grades'
      });

      expect(response.statusCode).toBe(400);
    })
    
    it('404', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/students/65295f1195be303756f8760e/grades'
      });

      expect(response.statusCode).toBe(404);
    })
  })

  describe('post-grade', () => {
    it('no JWT error', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/65295f1195be303756f8760d/grades',
        body: {
          grade: 4
        }
      });

      expect(response.statusCode).toBe(403);
    })

    it('empty token error', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/65295f1195be303756f8760d/grades',
        headers: {
          Authorization: ''
        },
        body: {
          grade: 4
        }
      });

      expect(response.statusCode).toBe(403);
    })

    it('no access error', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/65295f1195be303756f8760d/grades',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Mjk1ZjExOTViZTMwMzc1NmY4NzYwZCIsInJvbGUiOiLQodGC0YPQtNC10L3RgiIsImlhdCI6MTY5NzQ4ODE0OCwiZXhwIjoxNjk3NTc0NTQ4fQ.S2dv7mm0m4choB_U5DzvZFgQCOVtVZ50KYk6LP6NPUc'
        },
        body: {
          grade: 4
        }
      });

      expect(response.statusCode).toBe(403);
    })

    it('post success', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/65295f1195be303756f8760d/grades',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Mjk1ZjU3OTViZTMwMzc1NmY4NzYxMiIsInJvbGUiOiLQn9GA0LXQv9C-0LTQsNCy0LDRgtC10LvRjCIsImlhdCI6MTY5Nzc0NjM1MSwiZXhwIjoxNjk3ODMyNzUxfQ._pmUTYatPcyQ_lyUcJWQ8lIlfzSUt8xgbrSUWVS1jRc'
        },
        body: {
          grade: 4
        }
      });

      expect(response.statusCode).toBe(201);
    })

    it('id error', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/65295f1195be303756f8760e/grades',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Mjk1ZjU3OTViZTMwMzc1NmY4NzYxMiIsInJvbGUiOiLQn9GA0LXQv9C-0LTQsNCy0LDRgtC10LvRjCIsImlhdCI6MTY5Nzc0NjM1MSwiZXhwIjoxNjk3ODMyNzUxfQ._pmUTYatPcyQ_lyUcJWQ8lIlfzSUt8xgbrSUWVS1jRc'
        },
        body: {
          grade: 4
        }
      });

      expect(response.statusCode).toBe(404);
    })

    it('id error', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/1/grades',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Mjk1ZjU3OTViZTMwMzc1NmY4NzYxMiIsInJvbGUiOiLQn9GA0LXQv9C-0LTQsNCy0LDRgtC10LvRjCIsImlhdCI6MTY5Nzc0NjM1MSwiZXhwIjoxNjk3ODMyNzUxfQ._pmUTYatPcyQ_lyUcJWQ8lIlfzSUt8xgbrSUWVS1jRc'
        },
        body: {
          grade: 4
        }
      });

      expect(response.statusCode).toBe(400);
    })

    it('body error', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/students/65295f1195be303756f8760d/grades',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Mjk1ZjU3OTViZTMwMzc1NmY4NzYxMiIsInJvbGUiOiLQn9GA0LXQv9C-0LTQsNCy0LDRgtC10LvRjCIsImlhdCI6MTY5Nzc0NjM1MSwiZXhwIjoxNjk3ODMyNzUxfQ._pmUTYatPcyQ_lyUcJWQ8lIlfzSUt8xgbrSUWVS1jRc'
        },
        body: {
          grade: ''
        }
      });

      expect(response.statusCode).toBe(400);
    })
  })
});

describe('Teacher routes', () => {
  beforeAll(async () => {
    await fastify.ready()
})

  describe('get-teachers', () => {
    it('get-teachers', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: `/teachers`
      });

      expect(response.statusCode).toBe(200);
    })
  })

  describe('get-teacher', () => {
    it('get-teacher', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: `/teachers/65295f5795be303756f87612`
      });

      expect(response.statusCode).toBe(200);
    })

    it('400', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/teachers/1'
      });

      expect(response.statusCode).toBe(400);
    })
    
    it('404', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/teachers/65295f1195be303756f8760e'
      });

      expect(response.statusCode).toBe(404);
    })
  })

  describe('get-teacher-subject', () => {
    it('get-teacher-subject', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: `/teachers/65295f5795be303756f87612/subject`
      });

      expect(response.statusCode).toBe(200);
    })

    it('400', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/teachers/1/subject'
      });

      expect(response.statusCode).toBe(400);
    })
    
    it('404', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/teachers/65295f5795be303756f87622/subject'
      });

      expect(response.statusCode).toBe(404);
    })
  })

  afterAll(async () => {
    await fastify.close()
  })
})