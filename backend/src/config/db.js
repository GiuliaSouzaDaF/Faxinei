import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

try {
    const connection = await pool.getConnection();
    console.log('Conexão com o MySQL (Faxinei) estabelecida com sucesso!');
    connection.release(); 
} catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
}

export default pool;