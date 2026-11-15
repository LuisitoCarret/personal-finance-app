import { useEffect, useState } from "react"
import PrivateNavbar from "../../components/PrivateNavbar"
import { allTransactions, createTransactions, deleteTransaction, updateTransaction } from "../../services/transactionService";

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
        <>
         <div>
            <div>
                <p>Add Transaction</p>
            </div>
            <div>
                <input placeholder="Enter amount" value={amount} onChange={e=>setAmount(e.target.value)} />
                <select name="" id="options-transac" value={category} onChange={e=>setCategory(e.target.value)}>
                    <option value="Food">Food</option>
                    <option value="Personal">Personal</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Others">Others</option>
                </select>
                <input type="text" placeholder="Enter a description" value={description} onChange={e=>setDescription(e.target.value)} />
                <button onClick={handleSubmit}>{editingTransaction ? "Edit" : "Add"}</button>
                {editingTransaction && (<button onClick={()=> setEditingTransaction(null)}>Cancel</button>)}
            </div>
         </div>
        </>
    )
}

export function ListTransactions({refresh,onTransactionDelete, onEditClick}){
    const [transaction,setTransactions] = useState([]);
    const [result,setResult] = useState(0);
    
    useEffect(()=>{
        async function fetchTransaction(){
           const itemsList = await allTransactions();
           if(itemsList && itemsList.items){
              setTransactions(itemsList.items);
              setResult(itemsList.total_amount);
           }
       }
       fetchTransaction();
    },[refresh]);

    const handleDelete = async (id) =>{
        const res = await deleteTransaction(id)

        if(res){
          onTransactionDelete();
        }
    }
    
    return(
        <>
        <p>Monthly Total: {result}</p>
        <ul>
         {transaction.map((itm)=>(
            <li key={itm.id}>
                ${itm.amount} - {itm.description} - {itm.category}
                <button onClick={()=> onEditClick(itm)}>Edit</button>
                <button onClick={()=> handleDelete(itm.id)}>Delete</button> 
            </li>
         ))}
        </ul>
        </>
    );
}

function HomeTransaction(){
    const [refresh,setRefresh] = useState(0);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const triggerRefresh = () => setRefresh(prev => prev + 1);

    return(
       <>
        <PrivateNavbar />
        <AddTransaction key={editingTransaction ? editingTransaction.id : "new"} onTransactionAdded={triggerRefresh} editingTransaction={editingTransaction} setEditingTransaction={setEditingTransaction} />
        <ListTransactions refresh={refresh} onTransactionDelete={triggerRefresh} onTransactionUpdate={triggerRefresh} onEditClick={(itm)=> setEditingTransaction(itm)} />
       </>
    )
}

export default HomeTransaction