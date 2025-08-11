/*se encarga de cargar los users a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conection_db.js"


export async function loadUsersToTheBaseData() {

    const routerFile = path.resolve('server/data/01_users.csv');
    const users = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(routerFile)
            .pipe(csv())
            .on("data", (fila) => {
                users.push([
                    fila.id_user,
                    fila.full_name.trim(),
                    fila.identification_number,
                    fila.email,
                    fila.phone_number
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO users (id_user,full_name,identification_number,email,phone_number) VALUES ?';
                    const [result] = await pool.query(sql, [users]);

                    console.log(`✅ It was entered ${result.affectedRows} authores.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error trying to enter users:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error trying to read the file CSV from users:', err.message);
                reject(err);
            });
    });
}