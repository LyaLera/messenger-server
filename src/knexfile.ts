import { Knex } from 'knex';
import dotenv from 'dotenv'
dotenv.config()


const knexConfig: Knex.Config = {
    client: 'pg',
    connection: process.env.DB_URI,
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
    },
    seeds: {
        directory: './seeds',
    },
};

export default knexConfig;