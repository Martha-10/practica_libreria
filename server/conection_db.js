import dotenv from "dotenv";
import mysql from "mysql2/promise"

dotenv.config();  // Cargar variables de .env

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 10,        // Máximo número de conexiones activas al mismo tiempo
    waitForConnections: true,   // Si se alcanza el límite, las nuevas peticiones esperan su turno
    queueLimit: 0               // Número máximo de peticiones en espera (0 = sin límite)
})


async function tryConnectionWithTheBaseData() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connection With The Base Data Successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Error trying to connect with the data base:', error.message);
    }
}
tryConnectionWithTheBaseData();