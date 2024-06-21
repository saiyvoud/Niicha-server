import mysql from "mysql";

const con = mysql.createConnection({
  host: "mysql-176208-0.cloudclusters.net",
  port: "19894",
  user: "admin",
  password: "aviT3RQD",
  database: "NiichaDB",
});
con.connect((err) => {
  if (err) throw err;
  console.log(`Connected Database!`);
});

export default con;