import pg from 'pg'
import 'dotenv/config'
const {Pool} = pg

export const pool = new Pool({
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST
})


pool.on('error', (err, client) => {
    console.error('Unexpected error on idle cliente ',err)
        process.exit(-1)
    
})