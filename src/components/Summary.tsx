import React, { useState, useEffect } from 'react';
import '../Styles/Summary.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Button, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '../api';

const Summary = () => {
    const { control, handleSubmit } = useForm();
    const { data: expensesData, isLoading, error } = useQuery({
        queryKey: ['expenses'],
        queryFn: getExpenses
    });
    const expenses = expensesData || [];
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        setFilteredExpenses(expenses);
        calculateTotal(expenses);
    }, [expenses]);

    const onSubmit = (data: any) => {
        if (data.month) {
            const selectedMonth = dayjs(data.month).month();
            const selectedYear = dayjs(data.month).year();
            const filtered = expenses.filter((expense: any) => {
                const expenseDate = dayjs(expense.date, 'DD-MM-YYYY');
                return (
                    expenseDate.month() === selectedMonth &&
                    expenseDate.year() === selectedYear
                );
            });
            setFilteredExpenses(filtered);
            calculateTotal(filtered);

        } else {
            setFilteredExpenses(expenses);
            calculateTotal(expenses);

        }
    };

    const calculateTotal = (expenses: any[]) => {
        const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        setTotalExpense(total);
    };

    if (isLoading) return <div className='loaderror'>Loading...</div>

    if (error) return <div className='loaderror'>Error while loading summary</div>

    return (
        <div className="summary-container">
            <form onSubmit={handleSubmit(onSubmit)} className='form'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="month"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                label="Select Month"
                                value={field.value || null}
                                views={['month', 'year']}
                                format="MM/YYYY"
                            />
                        )}
                    />
                </LocalizationProvider>
                <Button type='submit' variant='contained' color='primary' className='filter-button'>
                    Filter
                </Button>
            </form>
            <Grid container spacing={3} className="category-grid">
                {filteredExpenses.length > 0 ? (
                    renderCategoryExpenses()
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">No expenses found.</Typography>
                    </Grid>
                )}
            </Grid>
            <Typography variant="h6" className="total-expense">
                Total Expense: ${totalExpense}
            </Typography>
        </div>
    );

    function renderCategoryExpenses() {
        const categoryExpensesMap = filteredExpenses.reduce((acc: any, expense: any) => {
            if (!acc[expense.category]) {
                acc[expense.category] = [];
            }
            acc[expense.category].push(expense);
            return acc;
        }, {});

        return Object.keys(categoryExpensesMap).map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="category-card">
                    <CardContent>
                        <Typography variant="h6" gutterBottom className='category'>{category}</Typography>
                        <List>
                            {categoryExpensesMap[category].map((expense: any) => (
                                <ListItem key={expense.id}>
                                    <ListItemText
                                        primary={expense.title}
                                        secondary={`$${expense.amount} - ${expense.date}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="subtitle1" className="category-total">
                            Total: ${calculateCategoryTotal(categoryExpensesMap[category])}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ));
    }

    function calculateCategoryTotal(expenses: any[]) {
        return expenses.reduce((total: number, expense: any) => total + parseFloat(expense.amount), 0);
    }
}

export default Summary;
