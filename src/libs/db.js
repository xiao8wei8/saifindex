import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {

  const dbconnection = await mysql.createPool({
    host: process.env.MYSQL_HOST,
    post: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    // console.log("[DB]",results);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
  }
}