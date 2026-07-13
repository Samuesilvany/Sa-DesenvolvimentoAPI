import { Router } from 'express';
import { equipamentosService } from '../services/equipamentosService.js';

export const equipamentosRouter = Router();

equipamentosRouter.get('/', async (req, res) => {
  try {
    const equipamentos = await equipamentosService.getAll();
    return res.json(equipamentos);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar equipamentos', error: String(err) });
  }
});


