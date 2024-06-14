import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getExpenses, deleteExpense } from './api';
import useStore from './Store';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditExpenseDialog from './EditExpenseDialog';
import { useForm, Controller } from 'react-hook-form';
import '../Styles/ExpenseList.css';
import { Button, Container, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const ExpenseList = () => {
    const { control, handleSubmit } = useForm();
    const { data: expenseData, isLoading, error } = useQuery({
        queryKey: ['expenses'],
        queryFn: getExpenses
    });

    const expense = expenseData || [];
    const deleteExpenseMutation = useMutation({
        mutationFn: deleteExpense
    });
    const queryClient = useQueryClient();
    const deleteExpenseFromStore = useStore((state) => state.deleteExpense);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filteredExpenses, setFilteredExpenses] = useState(expense);

    useEffect(() => {
        setFilteredExpenses(expense);
    }, [expense]);

    const handleEditClick = (expense: any) => {
        setSelectedExpense(expense);
        setDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        deleteExpenseMutation.mutate(id, {
            onSuccess: () => {
                deleteExpenseFromStore(id);
                queryClient.invalidateQueries({ queryKey: ['expenses'] });
            }
        });
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedExpense(null);
    };

    const onSubmit = (data: any) => {
        if (data.month) {
            const selectedMonth = dayjs(data.month).month();
            const selectedYear = dayjs(data.month).year();
            const filtered = expense.filter((expense: any) => {
                const expenseDate = dayjs(expense.date, 'DD-MM-YYYY');
                return (
                    expenseDate.month() === selectedMonth &&
                    expenseDate.year() === selectedYear
                );
            });
            setFilteredExpenses(filtered);
        } else {
            setFilteredExpenses(expense);
        }
    };

    if (isLoading) return <div className='loaderror'>Loading...</div>;

    if (error) return <div className='loaderror'>Error in Loading Expenses</div>;

    return (
        <Container max-width='sm' className='list-container'>
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
            <List className='list'>
                {filteredExpenses.map((expense: any) => (
                    <ListItem key={expense.id} divider className='list-item'>
                        <ListItemText
                            className='list-item-text'
                            primary={expense.title}
                            secondary={`$${expense.amount} - ${expense.date} - ${expense.category}`}
                        />
                        <IconButton onClick={() => handleEditClick(expense)} color='primary' >
                            <EditIcon className='icon-button' />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(expense.id)} color='primary' >
                            <DeleteIcon className='icon-button-delete' />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            {selectedExpense && (
                <EditExpenseDialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    expense={selectedExpense}
                />
            )}
        </Container>
    );
}

export default ExpenseList;
