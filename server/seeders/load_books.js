/*se encarga de cargar los books a la base de datos*/
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

export async function loadBooksToTheBaseData() {

    const routerFile = path.resolve('server/data/02_books_coma.csv');
    const books = [];

    return new Promise((resolve, reject) => {
        const separator = detectSeparator(routerFile);

        fs.createReadStream(routerFile)
            .pipe(csv({ separator }))
            .on("data", (row) => {
                books.push([
                    row.isbn,
                    row.title.trim(),
                    row.year_of_publication,
                    row.author
                ]);
            })
            .on('end', async () => {
                try {
                    if (books.length === 0) {
                        console.log('❌ No valid books found in CSV');
                        resolve();
                        return;
                    }

                    const sql = 'INSERT INTO books (isbn,title,year_of_publication,author) VALUES ?';
                    const [result] = await pool.query(sql, [books]);

                    console.log(`✅ It was entered ${result.affectedRows} books.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error trying to enter books:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error trying to read the file CSV from books:', err.message);
                reject(err);
            });
    });
}