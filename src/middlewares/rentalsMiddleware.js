import rentalsSchema from "../schemas/rentalsSchema.js";
import connection from '../db.js'

export async function validateRentals(req, res, next) {
    const validation = rentalsSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400);
        return;
    };

    try {
        const { customerId, gameId } = req.body;
        
        const checkCustomer = await connection.query(`
            select * from customers
            where id = $1`, [customerId]);
        if(checkCustomer.rowCount === 0){
            res.sendStatus(400);
            return;
        };
        const checkGame = await connection.query(`
            select * from games
            where id = $1`, [gameId]);
            if(checkGame.rowCount === 0){
                res.sendStatus(400);
                return;
            };
        
        const checkRentals = await connection.query(`
            select * from rentals
            where "gameId" = $1 
            and "returnDate" is null`, [gameId]);
        if(checkGame.rows[0].stockTotal <= checkRentals.rowCount){
            res.sendStatus(400);
            return;
        };

        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function validateReturnRental(req, res, next) {
    const { id } = req.params;

    try {
        
        const checkRental = await connection.query(`
            select *from rentals where id = $1`, [id]);
        if(checkRental.rowCount === 0){
            res.sendStatus(404);
            return;
        };

        if(checkRental.rows[0].returnDate){
            res.sendStatus(400);
            return;
        };

        req.locals = checkRental.rows[0];

        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};