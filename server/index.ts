import cors from 'cors';
import express from 'express';

import scenesRouter from './routers/scenesRouter';
import usersRouter from './routers/usersRouter';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/scenes', scenesRouter);

const PORT = process.env.PORT || 9876;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
