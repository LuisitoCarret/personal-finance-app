import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { allTransactionsByMonth } from '../../services/transactionService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);


function ExpensesMonth(){
    const [searchParams] = useSearchParams();
    const [items,setItems] = useState([]);
    const yearParam = searchParams.get('year') || String(new Date().getFullYear());
    
    useEffect(()=>{
       async function fetchListByMonth(){
         const result = await allTransactionsByMonth(yearParam);
         if(result){
            setItems(result);
         }
       }
       fetchListByMonth();
    },[yearParam])

    const hasData = items.length > 0 && items.some((itm) => itm.amount > 0);
    const navigate = useNavigate();

  if (!hasData) {
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
    );
  }
    
     const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Monthly expenses - ${yearParam}`,
        },
      },
    };
    
    const labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const data={
        labels,
        datasets:[{
            label: 'Amounts',
            data: items.map((itm)=> itm.amount),
            borderWidth: 1,
            backgroundColor: 'rgba(0,166,237,0.8)'
        }]
    };
    return (<><button onClick={()=> navigate("/history")}>⬅ Back</button><Bar options={options} data={data} /></>)
}

export default ExpensesMonth