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

const connectionString = "postgres://qqxcjgirfwuzsq:3b431b2fcf04b6bf1b1c3fdb1a185e7a79c445e5c33529b9fd9a2863d230e4cb@ec2-35-153-4-187.compute-1.amazonaws.com:5432/d49k2i7orpvlep"

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
