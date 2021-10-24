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

const connectionString = "postgres://jaklhzcjqgyfui:88a2c4b2cdff1fed8688548830a357f7f063f90036a9514d70e04a5bc6ecf19c@ec2-54-159-176-167.compute-1.amazonaws.com:5432/d6b5uiqnu3rvnh"

const knex = require('knex')({
    client: 'pg',
    connection: connectionString,
    ssl: {
        rejectUnauthorized: false 
    },
    // searchPath: ['knex', 'public'],
  });

module.exports = knex;