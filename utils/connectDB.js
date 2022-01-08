// const knex = require('knex')({
//     client: 'mysql2',
//     connection: {
//         host : 'localhost',
//         port : 8889,
//         user : 'root',
//         password : 'root',
//         database : 'classroom'
//     },
//     pool: { 
//         min: 0, max: 50
//     }
// });

const knex_local= require('knex')({
    client: 'pg',
    connection: {
        host : 'localhost',
        port : 5432,
        user : 'postgres',
        password : 'postgres',
        database : 'classroom'
    }
});

const connectionString = "postgres://yfsblyxkctafsc:dcf4a32101548a0c632a02f25df01f77d2232e99d9252a835959007683b36cfa@ec2-3-223-39-179.compute-1.amazonaws.com:5432/d7vm8gielk4s08"

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString,
        ssl: {
            rejectUnauthorized: false 
        },
    },
    searchPath: ['knex', 'public'],
  });

// module.exports = knex_local;
module.exports = knex;
