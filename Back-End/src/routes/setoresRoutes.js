import { Router } from 'express';
import { setoresService } from '../services/setoresService.js';

export const setoresRouter = Router();

setoresRouter.get('/', async (req, res) => {
  try {
    const setores = await setoresService.getAll();
    return res.json(setores);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar setores', error: String(err) });
  }
});

setoresRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const setor = await setoresService.getById(id);

    if (!setor) return res.status(404).json({ message: 'Setor não encontrado' });

    return res.json(setor);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar setor', error: String(err) });
  }
});

setoresRouter.post('/', async (req, res) => {
  try {
    const created = await setoresService.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao criar setor', error: String(err) });
  }
});

setoresRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await setoresService.update(id, req.body);

    if (!updated) return res.status(404).json({ message: 'Setor não encontrado' });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao atualizar setor', error: String(err) });
  }
});

setoresRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await setoresService.remove(id);

    if (!removed) return res.status(404).json({ message: 'Setor não encontrado' });

    return res.json({ message: 'Setor removido com sucesso', setor: removed });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover setor', error: String(err) });
  }
});

