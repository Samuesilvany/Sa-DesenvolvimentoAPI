import { pool } from '../config/db.js';

class EquipamentosService {
  async getAll() {
    const res = await pool.query('SELECT * FROM equipamentos');
    return res.rows;
  }
}

export const equipamentosService = new EquipamentosService();


