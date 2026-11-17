const BASE_URL = "http://localhost:5000/api";

function getCookie(name){
   const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function apiRequest(endpoint, method="GET", body=null){
  const options = {
    method,
    headers:{
        "Content-Type":"application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
    },
    credentials:"include",
   }

   if(body){
    options.body = JSON.stringify(body);
   }

   try {
     const response = await fetch(`${BASE_URL}${endpoint}`,options);
     const result = await response.json();
     if(method === "GET" && !response.ok){
       return [];
     }
     return result.message !== undefined ? result.message : result;
   } catch (error) {
     console.log(error);
     return method === "GET" ? [] : null;
   }
}

export const createTransactions = (data)=>{
  return apiRequest("/add/transactions","POST",data);
}

export const allTransactions = (page=1,perPage=10)=>{
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  return apiRequest(`/transactions?${params}`);
}

export const deleteTransaction = (id)=>{
  return apiRequest(`/delete/transactions/${id}`,"DELETE");
}

export const updateTransaction = (id,data)=>{
  return apiRequest(`/update/transactions/${id}`,"PUT",data);
}

export const allTransactionsByMonthAndYear = (month,year,page=1,perPage=10)=>{
  const params = new URLSearchParams({
    month: `${year}-${month}`,
    page: String(page),
    per_page: String(perPage)
  });
  return apiRequest(`/transactions?${params}`);
}

export const allTransactionsByMonth = (year)=>{
  return apiRequest(`/transactions/stats/by-month?year=${year}`);
}


export const allTransactionsByCategory = (year)=>{
  return apiRequest(`/transactions/stats/by-category?year=${year}`);
}