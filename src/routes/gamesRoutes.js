import { Router } from "express";
import { createGames, getGames } from "../controllers/gamesController.js";
import validateNewGameMiddleware from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router();

gamesRouter.post('/games', validateNewGameMiddleware, createGames);
gamesRouter.get('/games', getGames);

export default gamesRouter;