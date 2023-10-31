import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const username = req.query.username as string | undefined;

  if (!username) {
    return res.status(400).json({
      message: 'Missing username or date.',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: 'User not found.',
    });
  }

  const createSchedulingBody = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    observations: z.string().optional(),
    date: z.string().datetime(),
  });

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body
  );

  const schedulingDate = dayjs(date).startOf('hour');

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'Invalid date.',
    });
  }

  const conflitingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  });

  if (conflitingScheduling) {
    return res.status(400).json({
      message: 'There is another scheduling at the same time.',
    });
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  });

  return res.status(201).end();
}
