import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { allTransactionsByCategory } from '../../services/transactionService';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpensesCategory(){
    const [searchParams] = useSearchParams();
    const [items,setItems] = useState([]);
    const yearParam = searchParams.get('year');
    
    useEffect(()=>{
       async function fetchListByCategory(){
         const result = await allTransactionsByCategory(yearParam);
         if(result){
            setItems(result);
         }
       }
       fetchListByCategory();
    },[yearParam])

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
    }
    return <Pie data={data} />
}

export default ExpensesCategory