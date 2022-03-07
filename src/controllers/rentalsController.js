import dayjs from "dayjs";
import connection from "../db.js";

export async function createRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format("YYYY-MM-DD");

    try {
        
        const pricePerDay = await connection.query(`
            select games."pricePerDay"
            from games where id = $1`, [gameId]);
        
        const originalPrice = daysRented * pricePerDay.rows[0].pricePerDay;

        await connection.query(`
            insert into rentals (
            "customerId",
            "gameId",
            "rentDate",
            "daysRented",
            "returnDate",
            "originalPrice",
            "delayFee")
            values ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function getRentals(req, res) {
    const queryCustomer = req.query.customerId;
    const queryGame = req.query.gameId;
    const { offset, limit } = req.query;
    const queryArray = [];
    if(queryCustomer){
        queryArray.push(queryCustomer);
    };
    if(queryGame){
        queryArray.push(queryGame);
    };

    const query = `
    select rentals.*,
    customers.id as cuid,
    customers.name as cuname,
    games.id as gid,
    games.name as gname,
    games."categoryId" as gcatid,
    categories.name as gcatname
    from rentals
    join customers on rentals."customerId" = customers.id
    join games on rentals."gameId" = games.id
    join categories on games."categoryId" = categories.id
    ${queryCustomer || queryGame? "WHERE " : ""}
    ${queryCustomer ? "customers.id = $1" : ""}
    ${queryGame && !queryCustomer ? "games.id = $1" : ""}
    ${queryCustomer && queryGame ? "and games.id = $2" : ""}
    order by rentals.id desc
    ${offset ? `offset ${parseInt(offset)}` : ``}
    ${limit ? `limit ${parseInt(limit)}` : ``}`;

    try {
        
        const rentals = await connection.query(query, queryArray)

        res.send(rentals.rows.map(({
            id,
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate,
            originalPrice,
            delayFee,
            cuid,
            cuname,
            gid,
            gname,
            gcatid,
            gcatname}) => {
                return {
                    id,
                    customerId,
                    gameId,
                    rentDate: dayjs(rentDate).format('YYYY-MM-DD'),
                    daysRented,
                    returnDate: returnDate ? dayjs(returnDate).format('YYYY-MM-DD') : null,
                    originalPrice,
                    delayFee,
                    customer: {
                        id: cuid,
                        name: cuname
                    },
                    game: {
                        id: gid,
                        name: gname,
                        categoryId: gcatid,
                        categoryName: gcatname
                    }
                };
            }));

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function returnRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY-MM-DD');
    let delayFee = 0;
    const diffDates = dayjs(res.locals.rentDate).add(res.locals.daysRented, 'day').diff(returnDate, 'day');
    if(diffDates < 0){
        delayFee = diffDates * -1 * (res.locals.originalPrice / res.locals.daysRented);
    };

    try {
        
        await connection.query(`
            update rentals 
            set "returnDate" = $2, "delayFee" = $3 
            where id = $1`, [id, returnDate, delayFee]);

        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function deleteRentals(req, res) {
    const { id } = req.params;

    try {
        
        await connection.query(`
            delete from rentals where id = $1`, [id]);
        
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}