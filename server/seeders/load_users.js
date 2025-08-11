/*se encarga de cargar los users a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conection_db.js"

// Función para detectar el separador
function detectSeparator(filePath) {
    try {
        const sample = fs.readFileSync(filePath, 'utf-8').split('\n')[0];
        return sample.includes(';') ? ';' : ',';
    } catch (error) {
        return ',';
    }
}

export async function loadUsersToTheBaseData() {

    const routerFile = path.resolve('server/data/01_users_coma.csv');
    const users = [];

    return new Promise((resolve, reject) => {
        const separator = detectSeparator(routerFile);
        
        fs.createReadStream(routerFile)
            .pipe(csv({ separator }))
            .on("data", (row) => {
                if (row.full_name && row.full_name.trim()) {
                    users.push([
                        row.id_user,
                        row.full_name.trim(),
                        row.identification_number,
                        row.email,
                        row.phone_number
                    ]);
                }
            })
            .on('end', async () => {
                try {
                    if (users.length === 0) {
                        console.log('❌ No valid users found in CSV');
                        resolve();
                        return;
                    }
                    
                    const sql = 'INSERT INTO users (id_user,full_name,identification_number,email,phone_number) VALUES ?';
                    const [result] = await pool.query(sql, [users]);

                    console.log(`✅ It was entered ${result.affectedRows} users.`);
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