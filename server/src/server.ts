import { randomUUID } from "node:crypto";
import fastifyCors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify, { type RouteShorthandOptions } from "fastify";

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

fastify.get("/users/count", async () => {
	const count = await prisma.user.count();

	return { count };
});

fastify.get("/guesses/count", async () => {
	const count = await prisma.guess.count();

	return { count };
});

const postPoolsOptions: RouteShorthandOptions = {
	schema: {
		body: {
			properties: {
				title: { type: "string", minLength: 1 },
			},
			required: ["title"],
			type: "object",
		},
	},
};

fastify.post<{ Body: { title: string } }>("/pools", postPoolsOptions, async (request, reply) => {
	const { title } = request.body;

	const code = randomUUID().split("-")[0]!.toUpperCase();

	await prisma.pool.create({
		data: {
			title,
			code,
		},
	});

	return reply.status(201).send({ code });
});

await fastify.listen({ port: 3_333, host: "0.0.0.0" });
