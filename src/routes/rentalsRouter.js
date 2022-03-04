import { Router } from "express";
import { createRentals, deleteRentals, getRentals, returnRental } from "../controllers/rentalsController.js";
import { validateRentals, validateReturnRental } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.post('/rentals', validateRentals, createRentals);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals/:id/return', validateReturnRental, returnRental);
rentalsRouter.delete('/rentals/:id', validateReturnRental, deleteRentals);

export default rentalsRouter;