import connection from '../db.js';

export async function validateNewCategory (req, res, next) {
    const { name } = req.body

    if(!name) {
        return res.sendStatus(400);
    };

    try {
        
        const nameDuplicated = await connection.query('select * from categories where name = $1', [name])

        if(nameDuplicated.rowCount !== 0) {
            return res.sendStatus(409);
        };

        next();
    } catch (error) {
        res.send(error).status(500);
    };
};