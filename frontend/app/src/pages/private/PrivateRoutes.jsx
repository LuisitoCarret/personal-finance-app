import { Routes,Route, Navigate } from "react-router-dom"
import HomeTransaction from "./HomeTransaction"
import TransactionHistory from "./TransactionHistory"

function PrivateRoutes(){
    return (
        <>
        <Routes>
            <Route path="/home-transaction" element={<HomeTransaction />}></Route>
            <Route path="*" element={<Navigate to='/home-transaction' replace />}></Route>
            <Route path="/history" element={<TransactionHistory />}></Route>
        </Routes>
        </>
    )
}

export default PrivateRoutes