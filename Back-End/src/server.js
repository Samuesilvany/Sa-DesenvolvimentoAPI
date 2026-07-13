import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { equipamentosRouter } from './routes/equipamentosRoutes.js';

const app = express();

const port = process.env.API_PORT ?? 3000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.send('API funcionando');
});

app.use('/equipamentos', equipamentosRouter);

app.listen(port, () => {
  console.log(`O API rodando em http://localhost:${port}`);
});



