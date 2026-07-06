import {Router} from "express";
import {motosService} from "../services/motosService.js";

export const motosRouter = Router ()


motosRouter.get('/', async (req, res) => {
    const motos = await motosService.getAll(
        res.send(motos)
    )
})