import express from  'express'
import cors from 'cors'
import 'dotenv/config'

const app = express();

const port = process.env.API_PORT

app.use(cors());

app.get('/', (req, res) => {
    return res.send('API funcionando')
})

app.use('/frutas', frutasRouter)

app.listen(port, () => {
    console.log(`O API rodando em http://localhost:${port}`)
});


