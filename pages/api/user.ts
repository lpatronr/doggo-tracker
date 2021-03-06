// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { createUser, getUser, updateUser } from '../../prisma/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  try {
    switch (req.method) {
      case 'GET':
        try {
          if (!req.query.id || typeof req.query.id !== 'string' || !req.query.id.match(/^\d+$/))
            return res.status(400).json({ message: 'Query is invalid' });

          const user: User | null = await getUser(req.query.id);
          if (!user) return res.status(400).json({ message: `${req.query.id} does not exist` });

          return res.status(200).json(user);
        } catch (e) {
          return res.status(500).json({ message: 'Internal server error' });
        }
      case 'POST':
        try {
          const { cc, dogs } = req.body;
          if (typeof cc !== 'string' || !cc.match(/^\d+$/))
            return res.status(400).json({ message: 'Invalid cc' });

          if (
            !Array.isArray(dogs) ||
            !dogs.every((dog: any) => typeof dog === 'string') ||
            dogs.length > 3 ||
            dogs.length < 1
          )
            return res.status(400).json({ message: 'Invalid dogs' });

          const findUser = await getUser(cc);
          if (findUser) return res.status(400).json({ message: `${cc} already exists` });

          await createUser(cc, dogs);
          return res.status(200).json({ message: 'User created' });
        } catch (e) {
          return res.status(400).json({ message: e });
        }
      case 'PATCH':
        try {
          const { cc, dogs } = req.body;
          if (typeof cc !== 'string' || !cc.match(/^\d+$/))
            return res.status(400).json({ message: 'Invalid cc' });

          if (
            !Array.isArray(dogs) ||
            !dogs.every((dog: any) => typeof dog === 'string') ||
            dogs.length > 3 ||
            dogs.length < 1
          )
            return res.status(400).json({ message: 'Invalid dogs' });

          const user = await updateUser(cc, dogs);
          return res.status(200).json({ message: 'User updated', user });
        } catch (e) {
          return res.status(500).json({ message: 'Internal server error' });
        }
    }
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
