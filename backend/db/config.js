const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port:4306,
    database: "db_shop",
})
db.connect((err) => {
    if (!err){
        console.log("Connected to database");
    }
})

module.exports = db;