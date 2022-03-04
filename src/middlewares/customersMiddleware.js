import connection from "../db.js";
import customersSchema from "../schemas/customersSchema.js";

export async function validateNewCustomer(req, res, next) {
    const validation = customersSchema.validate(req.body)
        if(validation.error){
            res.sendStatus(400)
            return;
        };

        try {
            
            const { cpf } = req.body;
            const checkCPF = await connection.query(`select * from customers where cpf = $1`, [cpf]);
            if(checkCPF.rowCount !== 0){
                res.sendStatus(409);
                return;
            };

            next();

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        };
};

export async function validateUpdateCustomers(req, res, next) {
    const validation = customersSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400)
        return;
    };

    try {
        
        const { id } = req.params;
        const { cpf } = req.body;

        const checkCPF = await connection.query(`select * from customers where id != $1 and cpf = $2`, [id, cpf]);
        if(checkCPF.rowCount !== 0){
            res.sendStatus(409);
            return;
        }

        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}