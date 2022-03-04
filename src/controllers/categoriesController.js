import connection from "../db.js";

export async function postCategories(req, res) {

    const { name } = req.body;

    try {
        
        await connection.query('insert into categories (name) values ($1)', [name]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function getCategories(req, res) {
    try {
        
        const categories = await connection.query('select * from categories');

        res.send(categories.rows).status(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};