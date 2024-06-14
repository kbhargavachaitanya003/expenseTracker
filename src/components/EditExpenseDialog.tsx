import React from 'react'
import { Expense } from './Store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateExpense } from './api'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import useStore from './Store'
import '../Styles/EditExpenseDialog.css'

interface EditExpenseDialogProps {
    open: boolean;
    onClose: () => void;
    expense: Expense | null;
}

const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({ open, onClose, expense }) => {
    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            title: expense?.title,
            amount: expense?.amount,
            date: expense?.date,
            category: expense?.category,
        },
    });
    const { errors } = formState;
    const queryClient = useQueryClient();
    const updateExpenseMutation = useMutation({
        mutationFn: updateExpense
    });
    const updateExpenseInStore = useStore((state) => state.updateExpense)

    const handleCancel = () => {
        onClose();
        reset();
    }

    const onSubmit = (data: any) => {
        if (expense) {
            updateExpenseMutation.mutate({ ...expense, ...data }, {
                onSuccess: () => {
                    updateExpenseInStore(data);
                    queryClient.invalidateQueries({ queryKey: ['expenses'] });
                    onClose();
                },
            });
        }
        reset();
    }

    return (
        <Dialog open={open} onClose={onClose} className='dialog' >
            <DialogTitle className='dialog-title'>Edit Expense</DialogTitle>
            <DialogContent className='dialog-content'>
                <form onSubmit={handleSubmit(onSubmit)} className='dialog-form'>
                    <TextField
                        id='expense-title'
                        label={errors.title?.message || 'Title*'}
                        variant='outlined'
                        defaultValue={expense?.title}
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
                        variant='outlined'
                        defaultValue={expense?.amount}
                        {...register('amount', {
                            required: {
                                value: true,
                                message: 'Amount is Required'
                            },
                            pattern: {
                                value: /^[0-9]+.[0-9]+|^[0-9]+$/,
                                message: 'Invalid Amount'
                            }
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message === 'Invalid Amount' ? 'Amount Should be only in numbers' : ''}
                    />
                    <TextField
                        id='expense-date'
                        label={errors.date?.message || 'Date*'}
                        variant='outlined'
                        defaultValue={expense?.date}
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
                        variant='outlined'
                        defaultValue={expense?.category}
                        {...register('category', {
                            required: {
                                value: true,
                                message: 'Category is Required'
                            }
                        })}
                        error={!!errors.category}
                    />
                    <div className="buttons">
                        <Button variant='contained' color='primary' className='cancel-button' onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type='submit' variant='contained' color='primary' className='save-button'>
                            Save
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditExpenseDialog
