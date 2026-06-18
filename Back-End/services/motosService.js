const pool = require('../config/database');

class MotosService{
    async create(modelo, cilindrada, marcas_id) {
        const query = `
        INSERT INTO motos (modelo, cilindradas, marcas_id)
        VALUES($1, $2, $3)
        RETURNING *;
        ` ;
    }
}