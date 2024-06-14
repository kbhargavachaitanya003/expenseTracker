import React, { useState } from 'react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import Summary from '../components/Summary'
import { Container, Tabs, Tab, Box } from '@mui/material'
import '../Styles/ExpenseTracker.css'
const ExpenseTracker = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    }
    return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedTab} onChange={handleChange} aria-label='Expense Tracker Tabs'>
                    <Tab label="Add Expense" />
                    <Tab label="My Expenses" />
                    <Tab label="Summary" />
                </Tabs>
            </Box>
            {selectedTab === 0 && <ExpenseForm />}
            {selectedTab === 1 && <ExpenseList />}
            {selectedTab === 2 && <Summary />}
        </Container>
    )
}

export default ExpenseTracker
