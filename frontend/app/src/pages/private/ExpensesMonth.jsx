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
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);


function ExpensesMonth(){
    const [searchParams] = useSearchParams();
    const [items,setItems] = useState([]);
    const yearParam = searchParams.get('year');
    
    useEffect(()=>{
       async function fetchListByMonth(){
         const result = await allTransactionsByMonth(yearParam);
         if(result){
            setItems(result);
         }
       }
       fetchListByMonth();
    },[yearParam])
    
     const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly expenses',
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
    }
    return <Bar options={options} data={data} />
}

export default ExpensesMonth