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

equipamentosRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const equipamento = await equipamentosService.getById(id);

    if (!equipamento) return res.status(404).json({ message: 'Equipamento não encontrado' });

    return res.json(equipamento);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar equipamento', error: String(err) });
  }
});

equipamentosRouter.post('/', async (req, res) => {
  try {
    const created = await equipamentosService.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao criar equipamento', error: String(err) });
  }
});

equipamentosRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await equipamentosService.update(id, req.body);

    if (!updated) return res.status(404).json({ message: 'Equipamento não encontrado' });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao atualizar equipamento', error: String(err) });
  }
});

equipamentosRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await equipamentosService.remove(id);

    if (!removed) return res.status(404).json({ message: 'Equipamento não encontrado' });

    return res.json({ message: 'Equipamento removido com sucesso', equipamento: removed });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover equipamento', error: String(err) });
  }
});



