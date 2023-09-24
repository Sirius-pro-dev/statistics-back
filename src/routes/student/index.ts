export default async function (fastify) {
    fastify.get('/', (request, reply) => {
      try {
        reply.status(200).send([{}]);
      } catch (error) {
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
    fastify.post('/', (request, reply) => {
        try {
          const {firstname, secondname, middlename, grades} = request.body
          reply.status(201).send([{}]);
        } catch (error) {
          reply.status(500).send({ error: 'Internal Server Error' });
        }
      });
  }