const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.chatMessage.findMany().then(res => console.log('Messages in DB:', res.length)).finally(() => prisma.\());
