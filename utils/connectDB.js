const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host : 'localhost',
        port : 8889,
        user : 'root',
        password : 'root',
        database : 'classroom'
    },
    pool: { 
        min: 0, max: 50
    }
});

module.exports = knex;