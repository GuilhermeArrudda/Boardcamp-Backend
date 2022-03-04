import connection from "../db.js";
import gamesSchema from "../schemas/gamesSchema.js";

export default async function validateNewGameMiddleware(req, res, next) {
    const validation = gamesSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400);
        return;
    };

    try {
        
        const { name } = req.body;
        const checkName = await connection.query(`select * from games where name = $1`, [name]);
        if(checkName.rowCount !== 0) {
            res.sendStatus(409);
            return;
        };

        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};