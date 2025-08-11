/*se encarga de cargar los loans a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conection_db.js"


export async function loadLoansToTheBaseData() {

    const routerFile = path.resolve('server/data/03_loans.csv');
    const loans = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(routerFile)
            .pipe(csv())
            .on("data", (row) => {
                loans.push([
                    row.id_loan,
                    row.id_user,
                    row.isbn, 
                    row.loan_date,
                    row.return_date,
                    row.state
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO loans (id_loan,id_user,isbn,loan_date,return_date,state) VALUES ?';
                    const [result] = await pool.query(sql, [loans]);

                    console.log(`✅ You entered ${result.affectedRows} loans.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error trying to enter loans:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error trying to read file CSV from loans:', err.message);
                reject(err);
            });
    });
}