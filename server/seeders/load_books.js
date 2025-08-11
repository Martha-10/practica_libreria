const API_URL = "http://localhost:3000/loans";
const tableLoans = document.getElementById("tableLoans");
const loanForm = document.getElementById("loanForm");

// Cargar lista
async function loadLoans() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tableLoans.innerHTML = "";
    data.forEach(p => {
        tableLoans.innerHTML += `
            <tr>
                <td>${p.id_loan}</td>
                <td>${p.user}</td>
                <td>${p.book}</td>
                <td>${p.loan_date}</td>
                <td>${p.return_date}</td>
                <td>${p.state}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editLoan(${p.id_loan})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLoan(${p.id_loan})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Guardar / Actualizar
loanForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loan = {
        id_user: document.getElementById("id_user").value,
        isbn: document.getElementById("isbn").value,
        loan_date: document.getElementById("loan_date").value,
        return_date: document.getElementById("return_date").value,
        state: document.getElementById("state").value
    };

    const id_loan = document.getElementById("id_loan").value;

    if (id_loan) {
        // UPDATE
        await fetch(`${API_URL}/${id_loan}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loan)
        });
    } else {
        // CREATE
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loan)
        });
    }

    loanForm.reset();
    loadLoans();
});

// Edit
window.editLoan = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    document.getElementById("id_loan").value = p.id_loan;
    document.getElementById("id_user").value = p.id_user;
    document.getElementById("isbn").value = p.isbn;
    document.getElementById("loan_date").value = p.loan_date.split("T")[0];
    document.getElementById("return_date").value = p.return_date.split("T")[0];
    document.getElementById("state").value = p.state;
};

// Delete
window.deleteLoan = async (id) => {
    if (confirm("¿Are you sure you want to delete this loan?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadLoans();
    }
};

// Inicializar
loadLoans();
