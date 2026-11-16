import { Routes,Route, Navigate } from "react-router-dom"
import HomeTransaction from "./HomeTransaction"
import TransactionHistory from "./TransactionHistory"
import ExpensesMonth from "./ExpensesMonth"
import ExpensesCategory from "./ExpensesCategory"

function PrivateRoutes(){
    return (
        <>
        <Routes>
            <Route path="/home-transaction" element={<HomeTransaction />}></Route>
            <Route path="*" element={<Navigate to='/home-transaction' replace />}></Route>
            <Route path="/history" element={<TransactionHistory />}></Route>
            <Route path="/bymonth" element={<ExpensesMonth />}></Route>
            <Route path="/bycategory" element={<ExpensesCategory />}></Route>
        </Routes>
        </>
    )
}

export default PrivateRoutes