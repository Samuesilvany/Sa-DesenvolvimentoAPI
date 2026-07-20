import { Router } from 'express';
import { categoriasService } from '../services/categoriasService.js';

export const categoriasRouter = Router();

categoriasRouter.get('/', async (req, res) => {
  try {
    const categorias = await categoriasService.getAll();
    return res.json(categorias);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar categorias', error: String(err) });
  }
});

categoriasRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriasService.getById(id);

    if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' });

    return res.json(categoria);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar categoria', error: String(err) });
  }
});

categoriasRouter.post('/', async (req, res) => {
  try {
    const created = await categoriasService.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao criar categoria', error: String(err) });
  }
});

categoriasRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await categoriasService.update(id, req.body);

    if (!updated) return res.status(404).json({ message: 'Categoria não encontrada' });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao atualizar categoria', error: String(err) });
  }
});

categoriasRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await categoriasService.remove(id);

    if (!removed) return res.status(404).json({ message: 'Categoria não encontrada' });

    return res.json({ message: 'Categoria removida com sucesso', categoria: removed });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover categoria', error: String(err) });
  }
});

