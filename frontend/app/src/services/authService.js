const BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint,body=null,credentials=null){
   const options = {
    method: "POST",
    headers:{
        "Content-Type":"application/json"
    },
  }

  if(body){
    options.body = JSON.stringify(body);
  }

  if(credentials){
    options.credentials = credentials;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`,options);
    const result = await response.json();
    return result.message;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const SignUp = (data)=> {
 return apiRequest("/users/register",data);
}

export const loginUser = (body)=> {
 return apiRequest("/users/login",body,"include");
}

export const logoutUser = ()=> {
 return apiRequest("/users/logout");
}