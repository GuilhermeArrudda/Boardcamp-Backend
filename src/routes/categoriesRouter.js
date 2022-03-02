import { Router } from 'express';
import { postCategories, getCategories } from '../controllers/categoriesController.js';
import { validateNewCategory } from '../middlewares/categoriesMiddleware.js';

const categoriesRouter = Router();

categoriesRouter.post('/categories', validateNewCategory, postCategories)
categoriesRouter.get('/categories', getCategories)

export default categoriesRouter;