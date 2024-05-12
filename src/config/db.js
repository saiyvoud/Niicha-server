import mysql from "mysql";

const con = mysql.createConnection({
  host: "mysql-171876-0.cloudclusters.net",
  port: "19020",
  user: "admin",
  password: "Fzqy0WBa",
  database: "NiichaDB",
});
con.connect((err) => {
  if (err) throw err;
  console.log(`Connected Database!`);
});

export default con;