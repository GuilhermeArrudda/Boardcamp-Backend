import { Router } from "express";
import { createCustomers, getCustomer, getCustomers, updateCustomers } from "../controllers/customersController.js";
import { validateNewCustomer, validateUpdateCustomers } from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.post('/customers', validateNewCustomer, createCustomers);
customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.put('/customers/:id',validateUpdateCustomers ,updateCustomers);

export default customersRouter;