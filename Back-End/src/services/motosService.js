import {pool} from "../config/db.js";


class motosService {
    async getAll() {
        try {
            const res = await pool.query('SELECT * FROM Motos')
            return res.rows
        } catch (error) {
            console.error(error);
        }
        }
}


export const motosService = new motosService()