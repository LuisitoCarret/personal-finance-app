import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { allTransactionsByCategory } from '../../services/transactionService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function ExpensesCategory(){
    const [searchParams] = useSearchParams();
    const [items,setItems] = useState([]);
    const yearParam = searchParams.get('year') || String(new Date().getFullYear());
    
    useEffect(()=>{
       async function fetchListByCategory(){
         const result = await allTransactionsByCategory(yearParam);
         if(result){
            setItems(result);
         }
       }
       fetchListByCategory();
    },[yearParam])

    const hasData = items.length > 0 && items.some((itm) => itm.amount > 0);
    const navigate = useNavigate();

    if(!hasData){
      return (
        <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            margin: '30px auto',
            maxWidth: '450px',
            border: '1px dashed #ccc',
            borderRadius: '12px',
            backgroundColor: '#f9fafb'
          }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
        <h3>No expenses found for {yearParam}</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          You haven't recorded any transactions for this year yet.Add a new expense or try searching another year.
        </p>
        <button onClick={() => navigate('/Home')}>
          Add Transaction
        </button>
        </div>
      )
    }

    const data={
        labels: items.map((itm)=>itm.category),
        datasets:[{
            label: 'Amounts',
            data: items.map((itm)=> itm.amount),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const options ={
        responsive:true,
        plugins:{
            legend:{
                position:'top',
            },
            title:{
                display:true,
                text:`Expenses by Category - ${yearParam}`,
            }
        }
    };
    return (
    <>
    <button onClick={()=> navigate("/history")}>⬅ Back</button> 
    <Pie data={data} options={options} />
    </>
   )
}

export default ExpensesCategory