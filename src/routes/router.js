import { Router } from 'express';
import categoriesRouter from "./categoriesRouter.js";
import customersRouter from './customersRoutes.js';
import gamesRouter from './gamesRoutes.js';
import rentalsRouter from './rentalsRouter.js';

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export default router;