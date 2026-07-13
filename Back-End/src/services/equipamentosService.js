import { pool } from '../config/db.js';

class EquipamentosService {
  async getAll() {
    const res = await pool.query('SELECT * FROM equipamentos ORDER BY id');
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query('SELECT * FROM equipamentos WHERE id = $1', [id]);
    return res.rows[0] ?? null;
  }

  _buildInsertQuery(data) {
    const keys = Object.keys(data);
    const values = keys.map((k) => data[k]);

    const columns = keys.map((k) => k).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    return { columns, placeholders, values };
  }

  _buildUpdateQuery(id, data) {
    const keys = Object.keys(data);
    const values = keys.map((k) => data[k]);

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    // id vai como último parâmetro
    return {
      setClause,
      values: [...values, id],
    };
  }

  async create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Body inválido');
    }

    // Evita tentar sobrescrever a PK
    const payload = { ...data };
    delete payload.id;

    const keys = Object.keys(payload);
    if (keys.length === 0) {
      throw new Error('Body sem campos para criar');
    }

    const { columns, placeholders, values } = this._buildInsertQuery(payload);

    const sql = `INSERT INTO equipamentos (${columns})
                 VALUES (${placeholders})
                 RETURNING *`;

    const res = await pool.query(sql, values);
    return res.rows[0];
  }

  async update(id, data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Body inválido');
    }

    const payload = { ...data };
    delete payload.id;

    const keys = Object.keys(payload);
    if (keys.length === 0) {
      throw new Error('Body sem campos para atualizar');
    }

    const { setClause, values } = this._buildUpdateQuery(id, payload);

    const sql = `UPDATE equipamentos
                 SET ${setClause}
                 WHERE id = $${values.length}
                 RETURNING *`;

    const res = await pool.query(sql, values);
    return res.rows[0] ?? null;
  }

  async remove(id) {
    const res = await pool.query('DELETE FROM equipamentos WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] ?? null;
  }
}

export const equipamentosService = new EquipamentosService();



