import * as dotenv from 'dotenv'
import express from 'express';
import AppDataSource from './ormconfig';
import { Request, Response } from 'express';
import userRoutes from './routes/user.route'
import { accessMiddleware } from './middlewares/access.middleware';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())

console.log(process.env.DB_USER)

app.get('/info/:userId', accessMiddleware, (req: Request, res: Response) => {
  res.json({ 
    message: 'Node.js + TypeScript + TypeORM API',
    env: {
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

app.use('/api/users', userRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log(`Database connected!`);

    app.listen(PORT, () => {
      console.log(`Server running!`)
    })
  })

export default app;
