import express, { json } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/router.js'
dotenv.config();

const server = express();

server.use(json());
server.use(cors());
server.use(router);

server.listen(4000, () => {
    console.log('Running server in http://localhost:4000');
});