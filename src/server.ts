import 'dotenv/config'
import autoload from '@fastify/autoload'
import Fastify from 'fastify'
import path from 'node:path'
import { connect } from './connect';

const teacher = require('./routes/teacher')
const student = require('./routes/student')

export const fastify = Fastify({
  logger: true
})

fastify.register(teacher, student)

fastify.setErrorHandler(function (error, request, reply) {
  reply.status(500).send({ error: 'Internal Server Error' });
})

const start = async () => {
  try {
    if (require.main === module) {
      await fastify.listen({ port: Number(process.env.SIRIUS_X_STATISTICS_PORT) || 3020, host: '0.0.0.0' });
    }
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();

const getDisconnectFromDB = connect();

const graceFulShutDown = async () => {
  await fastify.close();
  const disconnectFromDB = await getDisconnectFromDB;
  await disconnectFromDB();
  process.exit(0);
}

process.on('SIGINT', graceFulShutDown);
process.on('SIGTERM', graceFulShutDown);

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes')
})
