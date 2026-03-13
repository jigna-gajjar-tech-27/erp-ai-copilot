// import sql from "mssql";
// import dotenv from "dotenv";
// dotenv.config();

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   port: parseInt(process.env.DB_PORT),
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// };

// export const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then(pool => {
//     console.log("Connected to SQL Server ✅");
//     return pool;
//   })
//   .catch(err => console.log("DB Connection Failed ❌", err));

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;