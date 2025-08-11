import { loadBooksToTheBaseData } from "./load_books.js";
import { loadLoansToTheBaseData } from "./load_loans.js";
import { loadUsersToTheBaseData } from "./load_users.js";

(async () => {
    try {
        console.log('🚀 Starting seeders...');

        // await loadUsersToTheBaseData()
        await loadBooksToTheBaseData()
        await loadLoansToTheBaseData()

        console.log('✅ All seeders run correctly.');
    } catch (error) {
        console.error('❌ Error run some seeders:', error.message);
    } finally {
        process.exit();
    }
})()