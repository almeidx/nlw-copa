import fastifyCors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";

const prisma = new PrismaClient({ log: ["query"] });

await prisma.$connect();

const fastify = Fastify({ logger: true });

await fastify.register(fastifyCors, {
	origin: true,
});

fastify.get("/pools/count", async () => {
	const count = await prisma.pool.count();

	return { count };
});

await fastify.listen({ port: 3_333, host: "0.0.0.0" });
