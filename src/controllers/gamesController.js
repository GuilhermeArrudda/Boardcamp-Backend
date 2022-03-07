import connection from "../db.js";

export async function createGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        
        await connection.query(`
        insert into 
        games (name, image, "stockTotal", "categoryId", "pricePerDay")
        values ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function getGames(req, res) {
    const queryName = req.query.name ? req.query.name + "%" : "%";
    const { offset, limit } = req.query;

    try {
        
        const games = await connection.query(`
            select games.*, categories.name as "categoryName" from games
            join categories on games."categoryId" = categories.id
            where games.name like $1
            ${offset ? `offset ${parseInt(offset)}` : ``}
            ${limit ? `limit ${parseInt(limit)}` : ``}`, [queryName]);
        
        res.send(games.rows);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};