import cors from "cors"
import express from "express"
import { pool } from "./conection_db.js"

const app = express()
app.use(cors()) // esto permite que la aplicacion backend pueda ser consumida por una aplicacion frontend
app.use(express.json()) // permite que Express interprete automáticamente el body en JSON cuando recibes una petición POST o PUT.


app.get('/loans', async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT 
            p.id_loan,
            p.loan_date,
            p.return_date,
            p.state,
            u.full_name AS user,
            l.isbn, 
            l.title AS book
        FROM loans p
        LEFT JOIN users u ON p.id_user = u.id_user
        LEFT JOIN books l ON p.isbn = l.isbn
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.get('/loans/:id_loan', async (req, res) => {
    try {
        const { id_loan } = req.params

        const [rows] = await pool.query(`
        SELECT 
            p.id_loan,
            p.loan_date,
            p.return_date,
            p.state,
            u.full_name AS user,
            l.isbn, 
            l.title AS book
        FROM loans p
        LEFT JOIN users u ON p.id_user = u.id_user
        LEFT JOIN books l ON p.isbn = l.isbn WHERE p.id_loan = ?
        `, [id_loan]);

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.post('/loans', async (req, res) => {
    try {
        const {
            id_user,
            isbn,
            loan_date,
            return_date,
            state
        } = req.body

        const query = `
        INSERT INTO loans 
        (id_user, isbn, loan_date, return_date, state)
        VALUES (?, ?, ?, ?, ?)
        `
        const values = [
            id_user,
            isbn,
            loan_date,
            return_date,
            state
        ]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            mensaje: "loan creado exitosamente"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.put('/loans/:id_loan', async (req, res) => {
    try {
        const { id_loan } = req.params

        const {
            id_user,
            isbn,
            loan_date,
            return_date,
            state
        } = req.body

        const query = `
        UPDATE loans SET 
            id_user = ?,
            isbn = ?,
            loan_date = ?,
            return_date = ?,
            state = ?
        WHERE id_loan = ?
        `
        const values = [
            id_user,
            isbn,
            loan_date,
            return_date,
            state,
            id_loan
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "loan actualizado" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.delete('/loans/:id_loan', async (req, res) => {
    try {
        const { id_loan } = req.params

        const query = `
        DELETE FROM loans WHERE id_loan = ?
        `
        const values = [
            id_loan
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "loan eliminado" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }




})

// 1. Ver todos los préstamos de un user
app.get('/loans/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.id_loan,
                p.loan_loan,
                p.return_date,
                p.state,
                l.isbn,
                l.title AS book
            FROM loans p
            LEFT JOIN books l ON p.isbn = l.isbn
            WHERE p.id_user = ?
        `, [id]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 2. Listar los 5 books más prstates
app.get('/books/mas-prstates', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.isbn,
                l.title,
                COUNT(p.id_loan) AS total_loans
            FROM loans p
            LEFT JOIN books l ON p.isbn = l.isbn
            GROUP BY l.isbn, l.title
            ORDER BY total_loans DESC
            LIMIT 5
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 3. Listar users con préstamos en state "retrasado"
app.get('/users/con-retrasos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                u.id_user,
                u.full_name
            FROM loans p
            LEFT JOIN users u ON p.id_user = u.id_user
            WHERE p.state = 'retrasado'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 4. Listar préstamos activos
app.get('/loans/activos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id_loan,
                p.loan_loan,
                p.return_date,
                p.state,
                u.full_name AS user,
                l.title AS book
            FROM loans p
            LEFT JOIN users u ON p.id_user = u.id_user
            LEFT JOIN books l ON p.isbn = l.isbn
            WHERE p.state = 'activo'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 5. Historial de un book por su ISBN
app.get('/loans/historial/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.id_loan,
                p.loan_loan,
                p.return_date,
                p.state,
                u.full_name AS user
            FROM loans p
            LEFT JOIN users u ON p.id_user = u.id_user
            WHERE p.isbn = ?
            ORDER BY p.loan_date DESC
        `, [isbn]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

//Inicio del servidor cuando este todo listo
app.listen(3000, () => {
    console.log("servidor prepado correctamente en http://localhost:3000");
})