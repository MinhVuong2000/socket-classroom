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

const connectionString = 'postgres://qaikjuzosgngng:b6f082bf72bd9b027e804a583ad5700fe6bed5d055b120410eba16298e040b52@ec2-3-232-22-121.compute-1.amazonaws.com:5432/dcr2rbcrk9vd8l';

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
