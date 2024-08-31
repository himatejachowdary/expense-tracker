document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;

        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, amount })
        });

        if (response.ok) {
            addExpenseToList({ description, amount });
            form.reset();
        }
    });

    const addExpenseToList = ({ description, amount }) => {
        const li = document.createElement('li');
        li.textContent = `${description}: $${amount}`;
        expenseList.appendChild(li);
    };

    const loadExpenses = async () => {
        const response = await fetch('/api/expenses');
        const expenses = await response.json();
        expenses.forEach(addExpenseToList);
    };

    loadExpenses();
});
