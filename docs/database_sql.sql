-- Drop the database if it already exists (this removes all tables)
DROP DATABASE IF EXISTS library_practice;

-- Create a new database and use it
CREATE DATABASE library_practice;
USE library_practice;

-- Create 'users' table
CREATE TABLE users (
    id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    identification_number VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) DEFAULT NULL,
    phone_number VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create 'books' table
CREATE TABLE books (
    isbn VARCHAR(100) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year_of_publication YEAR DEFAULT NULL,
    author VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create 'loans' table
CREATE TABLE loans (
    id_loan INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    isbn VARCHAR(100),
    loan_date DATE NOT NULL,
    return_date DATE DEFAULT NULL,
    state ENUM('entregado', 'retrasado', 'activo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    FOREIGN KEY (isbn) REFERENCES books(isbn)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
