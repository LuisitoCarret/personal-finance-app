function getCookie(name){
   const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function createTransactions(data){
    const options = {
    method: "POST",
    headers:{
        "Content-Type":"application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
    },
    credentials:"include",
    body:JSON.stringify(data)
   }

   const request = new Request("http://localhost:5000/api/add/transactions",options);

   try {
      const response = await fetch(request);
      const result = await response.json()
      if(response.ok){
        return result.message
      }else{
        return result.message
      }
   } catch (error) {
      console.log("Fetch Error",error)
   }
}

export async function allTransactions(){
  const options = {
    method: "GET",
    headers:{
        "Content-Type":"application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
    },
    credentials:"include",
   }

   const request = new Request("http://localhost:5000/api/transactions",options)

   try {
      const response = await fetch(request);
      const result = await response.json();
      if(response.ok){
        return result;
      }else{
        return [];
      }
   } catch (error) {
     console.log(error);
   }
}

export async function deleteTransaction(id){
  const options = {
    method: "DELETE",
    headers:{
        "Content-Type":"application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
    },
    credentials:"include",
   }

   const request = new Request(`http://localhost:5000/api/delete/transactions/${id}`,options);

   try {
    const response = await fetch(request);
    const result = await response.json();
    if(response.ok){
       return result.message;
    }else{
      return result.message;
    }
   } catch (error) {
    console.log(error);
   }
}

export async function updateTransaction(id,data){
  const options = {
    method: "PUT",
    headers:{
        "Content-Type":"application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
    },
    credentials:"include",
    body: JSON.stringify(data)
   }

   const request = new Request(`http://localhost:5000/api/update/transactions/${id}`,options);

   try {
    const response = await fetch(request);
    const result = await response.json();
    if(response.ok){
       return result.message;
    }else{
      return result.message;
    }
   } catch (error) {
    console.log(error);
   }
}

export async function allTransactionsByMonthAndYear(month,year){
  const options = {
    method: "GET",
    headers:{
        "Content-Type":"application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
    },
    credentials:"include",
   }

   const request = new Request(`http://localhost:5000/api/transactions?month=${year}-${month}`,options)
   try {
      const response = await fetch(request);
      const result = await response.json();
      if(response.ok){
        return result;
      }else{
        return [];
      }
   } catch (error) {
     console.log(error);
   }
}