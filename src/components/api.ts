import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

export const getExpenses = async () => {
    try {
        const response = await api.get('/expenses');
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
};

export const addExpense = async (expense: any) => {
    try {
        const response = await api.post('/expenses', expense);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export const updateExpense = async (expense: any) => {
    try {
        const response = await api.put(`/expenses/${expense.id}`, expense);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export const deleteExpense = async (id: number) => {
    try {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}