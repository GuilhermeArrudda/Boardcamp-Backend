import { Router } from 'express';
import categoriesRouter from "./categoriesRouter.js";
import customersRouter from './customersRoutes.js';
import gamesRouter from './gamesRoutes.js';

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);

export default router;