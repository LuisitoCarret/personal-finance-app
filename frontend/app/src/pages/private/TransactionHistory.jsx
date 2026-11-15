import { useEffect, useState } from "react"
import { allTransactionsByMonthAndYear } from "../../services/transactionService";

function SelectHistory({ filterChange }){
    const [year,setYear] = useState('');
    const [month,setMonth] = useState('');

    const handleSearch = () =>{
        filterChange(month,year);
    }

    return(
        <>
         <div>
            <select name="" id="months" value={month} onChange={e=>setMonth(e.target.value)}>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            <input type="text" placeholder="Enter a year" value={year} onChange={e=>setYear(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
         </div>
        </>
    )
}

function ListHistory({ month,year }){
   const [listHistory,setListHistory] = useState([]);
   const [monthyTotal,setMonthyTotal] = useState(0);

   useEffect(()=>{
       async function fecthListHistory(){
          const items = await allTransactionsByMonthAndYear(month,year);
          if(items && items.items){
            setListHistory(items.items);
            setMonthyTotal(items.total_amount);
          }else{
            setListHistory([]);
            setMonthyTotal(0);
          }
       }
        fecthListHistory();
   },[month,year])

   return(
     <>
     <p>Monthly Total: {monthyTotal}</p>
     <ul>
        {listHistory.map((itm)=>(
            <li key={itm.id}>
              {itm.amount}-{itm.description}-{itm.category}
            </li>
        ))}
     </ul>
     </>
   )
}

function TransactionHistory(){
   const [selectedMonth,setSelectedMonth] = useState('');
   const [selectedYear,setSelectedYear] = useState('');

    const handleFilter = (newMonth,newYear) =>{
       setSelectedMonth(newMonth);
       setSelectedYear(newYear);
    }

    return(
    <>
       <SelectHistory filterChange={handleFilter} />
       <ListHistory month={selectedMonth} year={selectedYear} />
    </>
    )
}


export default TransactionHistory