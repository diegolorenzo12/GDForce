const mysql = require("mysql");

//MySql config
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.BD_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//check conecction
connection.connect((err) => {
  //if error in conection
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});
module.exports = connection;