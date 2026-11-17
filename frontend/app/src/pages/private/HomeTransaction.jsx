import { useEffect, useState } from "react"
import PrivateNavbar from "../../components/PrivateNavbar"
import { allTransactions, createTransactions, deleteTransaction, updateTransaction } from "../../services/transactionService";
import "./HomeTransaction.style.css"

const TRANSACTIONS_PER_PAGE = 10;

export function AddTransaction({ onTransactionAdded, editingTransaction, setEditingTransaction }){
    const [amount,setAmount] = useState(editingTransaction ? editingTransaction.amount : '');
    const [category,setCategory] = useState(editingTransaction ? editingTransaction.category : '');
    const [description,setDescription] = useState(editingTransaction ? editingTransaction.description : '');

    const handleSubmit = async () => {
        const data = {
            amount: parseFloat(amount),
            description: description,
            category: category
        };

        let res;
        if (editingTransaction) {
            res = await updateTransaction(editingTransaction.id, data);
        } else {
            res = await createTransactions(data);
        }

        if (res) {
            setEditingTransaction(null);
            onTransactionAdded();
        }
    };

    return(
        <section className="transaction-card transaction-form-card">
            <div className="transaction-card__heading">
                <span className="transaction-eyebrow">{editingTransaction ? "UPDATE DETAILS" : "RECORD ACTIVITY"}</span>
                <h2>{editingTransaction ? "Edit transaction" : "Add a transaction"}</h2>
                <p>Keep your spending up to date.</p>
            </div>
            <div className="transaction-form">
                <label htmlFor="transaction-amount">Amount</label>
                <input id="transaction-amount" type="number" step="any" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} />
                <label htmlFor="options-transac">Category</label>
                <select id="options-transac" value={category} onChange={e=>setCategory(e.target.value)}>
                    <option value="Food">Food</option>
                    <option value="Personal">Personal</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Others">Others</option>
                </select>
                <label htmlFor="transaction-description">Description</label>
                <input id="transaction-description" type="text" placeholder="What was it for?" value={description} onChange={e=>setDescription(e.target.value)} />
                <div className="transaction-form__actions">
                    <button className="transaction-button transaction-button--primary" onClick={handleSubmit}>{editingTransaction ? "Save changes" : "Add transaction"}</button>
                    {editingTransaction && (<button className="transaction-button transaction-button--secondary" onClick={()=> setEditingTransaction(null)}>Cancel</button>)}
                </div>
            </div>
        </section>
    )
}

export function ListTransactions({refresh,currentPage,setCurrentPage,onTransactionDelete,onEditClick}){
    const [transaction,setTransactions] = useState([]);
    const [result,setResult] = useState(0);
    const [totalItems,setTotalItems] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    
    useEffect(()=>{
        let isCurrentRequest = true;
        async function fetchTransaction(){
           const itemsList = await allTransactions(currentPage,TRANSACTIONS_PER_PAGE);
           if(!isCurrentRequest || !itemsList || !Array.isArray(itemsList.items)){
              return;
           }

           const lastPage = Math.max(1,itemsList.total_pages || 0);
           if(currentPage > lastPage){
              setCurrentPage(lastPage);
              return;
           }

           if(itemsList && itemsList.items){
              setTransactions(itemsList.items);
              setResult(itemsList.total_amount);
              setTotalItems(itemsList.total_items);
              setTotalPages(itemsList.total_pages);
           }
       }
       fetchTransaction();
        return () => {
            isCurrentRequest = false;
        };
    },[refresh,currentPage,setCurrentPage]);

    const handleDelete = async (id) =>{
        const res = await deleteTransaction(id)

        if(res){
          onTransactionDelete();
        }
    }
    
    return(
        <section className="transaction-card transaction-list-card">
        <div className="transaction-list-heading">
            <div>
                <span className="transaction-eyebrow">THIS MONTH</span>
                <h2>Recent transactions</h2>
            </div>
            <div className="transaction-total">
                <span>Monthly total</span>
                <strong>${Number(result).toFixed(2)}</strong>
            </div>
        </div>
        {transaction.length === 0 ? (
            <p className="transaction-empty">No transactions yet. Add one to get started.</p>
        ) : <ul className="transaction-list">
         {transaction.map((itm)=>(
            <li key={itm.id}>
                <span className="transaction-list__icon" aria-hidden="true">$</span>
                <div className="transaction-list__details">
                    <strong>{itm.description}</strong>
                    <span>{itm.category}</span>
                </div>
                <strong className="transaction-list__amount">-${Number(itm.amount).toFixed(2)}</strong>
                <div className="transaction-list__actions">
                    <button className="transaction-button transaction-button--secondary" onClick={()=> onEditClick(itm)}>Edit</button>
                    <button className="transaction-button transaction-button--danger" onClick={()=> handleDelete(itm.id)}>Delete</button>
                </div>
            </li>
         ))}
        </ul>}
        {totalPages > 0 && (
            <nav className="transaction-pagination" aria-label="Transaction pages">
                <span>Showing {((currentPage - 1) * TRANSACTIONS_PER_PAGE) + 1}-{Math.min(currentPage * TRANSACTIONS_PER_PAGE,totalItems)} of {totalItems}</span>
                <div className="transaction-pagination__controls">
                    <button className="transaction-button transaction-button--secondary" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button className="transaction-button transaction-button--secondary" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </div>
            </nav>
        )}
        </section>
    );
}

function HomeTransaction(){
    const [refresh,setRefresh] = useState(0);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const triggerRefresh = (resetPage = false) => {
        if(resetPage){
            setCurrentPage(1);
        }
        setRefresh(prev => prev + 1);
    };

    return(
       <div className="transaction-page transaction-page--home">
        <PrivateNavbar />
        <main className="transaction-shell">
            <header className="transaction-page-heading">
                <div>
                    <span className="transaction-eyebrow">YOUR FINANCES AT A GLANCE</span>
                    <h1>Transactions</h1>
                    <p>Track your spending and keep your monthly budget in view.</p>
                </div>
            </header>
            <div className="transaction-dashboard">
                <AddTransaction key={editingTransaction ? editingTransaction.id : "new"} onTransactionAdded={() => triggerRefresh(true)} editingTransaction={editingTransaction} setEditingTransaction={setEditingTransaction} />
                <ListTransactions refresh={refresh} currentPage={currentPage} setCurrentPage={setCurrentPage} onTransactionDelete={triggerRefresh} onTransactionUpdate={triggerRefresh} onEditClick={(itm)=> setEditingTransaction(itm)} />
            </div>
        </main>
       </div>
    )
}

export default HomeTransaction