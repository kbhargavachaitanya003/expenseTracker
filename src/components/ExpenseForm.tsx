import React from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import useStore from '../Store/Store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addExpense } from './api'
import '../Styles/ExpenseForm.css'

const ExpenseForm = () => {

    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            title: '',
            amount: '',
            date: '',
            category: ''
        },
    });

    const { errors } = formState;
    const addExpenseMutation = useMutation({
        mutationFn: addExpense
    });
    const queryClient = useQueryClient();
    const addExpenseToStore = useStore((state) => state.addExpense);

    const onSubmit = (data: any) => {
        addExpenseMutation.mutate(data, {
            onSuccess: () => {
                addExpenseToStore(data);
                queryClient.invalidateQueries({ queryKey: ['expenses'] });
            },
        });
        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '20px' }} className='form-box'>
                <TextField
                    id='expense-title'
                    label={errors.title?.message || 'Title*'}
                    className='text-field'
                    variant='outlined'
                    {...register('title', {
                        required: {
                            value: true,
                            message: 'Title is Required'
                        }
                    })}
                    error={!!errors.title}
                />
                <TextField
                    id='expense-amount'
                    label={errors.amount?.message || 'Amount*'}
                    className='text-field'
                    variant='outlined'
                    {...register('amount', {
                        required: {
                            value: true,
                            message: 'Amount is Required'
                        },
                        pattern: {
                            value: /^[0-9]+.[0-9]+||^[0-9]+$/,
                            message: 'Invalid Amount'
                        }
                    })}
                    error={!!errors.amount}
                    helperText={errors.amount?.message === 'Invalid Amount' ? 'Amount Should be only numbers' : ''}
                />
                <TextField
                    id='expense-date'
                    label={errors.date?.message || 'Date*'}
                    className='text-field'
                    placeholder='DD-MM-YYYY'
                    variant='outlined'
                    {...register('date', {
                        required: {
                            value: true,
                            message: 'Date is Required'
                        },
                        pattern: {
                            value: /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/,
                            message: 'Invalid Date'
                        }
                    })}
                    error={!!errors.date}
                    helperText={errors.date?.message === 'Invalid Date' ? 'Date should be in DD-MM-YYYY format' : ''}
                />
                <TextField
                    id='expense-category'
                    label={errors.category?.message || 'Category*'}
                    className='text-field'
                    variant='outlined'
                    {...register('category', {
                        required: {
                            value: true,
                            message: 'Category is Required'
                        }
                    })}
                    error={!!errors.category}
                />
                <Button type='submit' variant='contained' color='primary' className='add-button'>
                    Add Expense
                </Button>
            </Box>
        </form>
    )
}

export default ExpenseForm
