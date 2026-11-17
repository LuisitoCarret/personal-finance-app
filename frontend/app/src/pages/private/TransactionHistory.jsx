import { useEffect, useState } from "react"
import { allTransactionsByMonthAndYear } from "../../services/transactionService";
import { useNavigate } from "react-router-dom";
import PrivateNavbar from "../../components/PrivateNavbar";
import "./TransactionHistory.style.css"

const TRANSACTIONS_PER_PAGE = 10;

function SelectHistory({ filterChange }){
    const [year,setYear] = useState('');
    const [month,setMonth] = useState('');

    const handleSearch = () =>{
        filterChange(month,year);
    }

    return(
        <section className="history-filter-card">
            <div className="transaction-card__heading">
                <span className="transaction-eyebrow">FIND A PERIOD</span>
                <h2>Filter transactions</h2>
                <p>Choose a month and year to see your activity.</p>
            </div>
            <div className="history-filter">
            <div className="transaction-form__field">
            <label htmlFor="months">Month</label>
            <select id="months" value={month} onChange={e=>setMonth(e.target.value)}>
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
            </div>
            <div className="transaction-form__field">
                <label htmlFor="history-year">Year</label>
                <input id="history-year" type="text" placeholder="e.g. 2025" value={year} onChange={e=>{setYear(e.target.value);filterChange(month,e.target.value)}} />
            </div>
            <button className="transaction-button transaction-button--primary" onClick={handleSearch}>Search</button>
            </div>
        </section>
    )
}

function ListHistory({ month,year,currentPage,setCurrentPage }){
   const [listHistory,setListHistory] = useState([]);
   const [monthyTotal,setMonthyTotal] = useState(0);
   const [totalItems,setTotalItems] = useState(0);
   const [totalPages,setTotalPages] = useState(0);
   const navigate = useNavigate();

    const goToMonthExpenses = () => {
        navigate(`/bymonth?year=${year}`);
    };

    const goToCategoryExpenses = () =>{
        navigate(`/bycategory?year=${year}`)
    }

   useEffect(()=>{
       let isCurrentRequest = true;
       async function fecthListHistory(){
          const items = await allTransactionsByMonthAndYear(month,year,currentPage,TRANSACTIONS_PER_PAGE);
          if(!isCurrentRequest){
            return;
          }

          if(!items || !Array.isArray(items.items)){
            setListHistory([]);
            setMonthyTotal(0);
            setTotalItems(0);
            setTotalPages(0);
            return;
          }

          const lastPage = Math.max(1,items.total_pages || 0);
          if(currentPage > lastPage){
            setCurrentPage(lastPage);
            return;
          }

          setListHistory(items.items);
          setMonthyTotal(items.total_amount);
          setTotalItems(items.total_items);
          setTotalPages(items.total_pages);
       }
        fecthListHistory();
        return () => {
            isCurrentRequest = false;
        };
   },[month,year,currentPage,setCurrentPage])

   return(
     <section className="transaction-card history-results-card">
     <div className="transaction-list-heading">
        <div>
            <span className="transaction-eyebrow">YOUR OVERVIEW</span>
            <h2>Transaction history</h2>
        </div>
        <div className="transaction-total">
            <span>Monthly total</span>
            <strong>${Number(monthyTotal).toFixed(2)}</strong>
        </div>
     </div>
     <div className="history-report-actions">
        <button className="transaction-button transaction-button--secondary" onClick={goToCategoryExpenses}>Expenses by category</button>
        <button className="transaction-button transaction-button--secondary" onClick={goToMonthExpenses}>Monthly expenses</button>
     </div>
     {listHistory.length === 0 ? (
        <p className="transaction-empty">No transactions found for this period.</p>
     ) : <ul className="transaction-list">
        {listHistory.map((itm)=>(
            <li key={itm.id}>
              <span className="transaction-list__icon" aria-hidden="true">$</span>
              <div className="transaction-list__details">
                <strong>{itm.description}</strong>
                <span>{itm.category}</span>
              </div>
              <strong className="transaction-list__amount">-${Number(itm.amount).toFixed(2)}</strong>
            </li>
        ))}
     </ul>}
     {totalPages > 0 && (
        <nav className="transaction-pagination" aria-label="Transaction history pages">
            <span>Showing {((currentPage - 1) * TRANSACTIONS_PER_PAGE) + 1}-{Math.min(currentPage * TRANSACTIONS_PER_PAGE,totalItems)} of {totalItems}</span>
            <div className="transaction-pagination__controls">
                <button className="transaction-button transaction-button--secondary" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="transaction-button transaction-button--secondary" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        </nav>
     )}
     </section>
   )
}

function TransactionHistory(){
   const [selectedMonth,setSelectedMonth] = useState('');
   const [selectedYear,setSelectedYear] = useState('');
   const [currentPage,setCurrentPage] = useState(1);

    const handleFilter = (newMonth,newYear) =>{
       setSelectedMonth(newMonth);
       setSelectedYear(newYear);
       setCurrentPage(1);
    }

    return(
    <div className="transaction-page transaction-page--history">
       <PrivateNavbar />
       <main className="transaction-shell transaction-history-shell">
            <header className="transaction-page-heading">
                <div>
                    <span className="transaction-eyebrow">SPENDING, MADE CLEAR</span>
                    <h1>Transaction history</h1>
                    <p>Review your past activity and explore your spending patterns.</p>
                </div>
            </header>
            <SelectHistory filterChange={handleFilter} />
            <ListHistory month={selectedMonth} year={selectedYear} currentPage={currentPage} setCurrentPage={setCurrentPage} />
       </main>
    </div>
    )
}


export default TransactionHistory