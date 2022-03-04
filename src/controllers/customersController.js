import dayjs from "dayjs";
import connection from "../db.js";

export async function createCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        
        await connection.query(`
            insert into customers 
            (name, phone, cpf, birthday) 
            values ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function getCustomers(req, res) {
    const queryCPF = req.query.cpf ? req.query.cpf + "%" : "%";

    try {
        
        const customers = await connection.query(`
            select customers.* from customers
            where customers.cpf like $1
            order by customers.id asc`, [queryCPF]);

        res.send(customers.rows.map(customer => {
            return {
                ...customer,
                birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
            };
        }));

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function getCustomer(req, res) {
    const { id } = req.params;

    try {
        
        const customer = await connection.query(`select * from customers where id = $1`, [id]);
        if(!customer.rows[0]){
            res.sendStatus(404);
            return;
        };

        res.send(customer.rows.map(customer => {
            return {
                ...customer,
                birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
            };
        }));

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function updateCustomers(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        
        await connection.query(`
        update customers
        set name = $1, phone = $2, cpf = $3, birthday = $4
        where id = $5`, [name, phone, cpf, birthday, id]);

        res.sendStatus(200)

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}