import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Run every day at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  

  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  try {
    const result = await prisma.task.deleteMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          lt: tenDaysAgo
        }
      }
    });

    console.log(`Deleted ${result.count} completed tasks older than 10 days`);
  } catch (error) {
    console.error(' Error in cron job:', error);
  }
});
