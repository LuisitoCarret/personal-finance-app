export async function SignUp(data) {
const options = {
    method: "POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
}

const request = new Request("http://localhost:5000/api/users/register",options);
    try {
        const response = await fetch(request);
        const result = await response.json();
        if(response.ok){
         return result.message
        }else{
         return result.message
        }
    } catch (error) {
       return console.log("Fetch error:",error);
    }
}

export async function loginUser(data){
    const options = {
    method: "POST",
    headers:{
        "Content-Type":"application/json"
    },
    credentials: "include",
    body:JSON.stringify(data)
   }

   const request = new Request("http://localhost:5000/api/users/login",options);

    try {
        const response = await fetch(request);
        const result = await response.json()
        if(response.ok){
        return {ok:true,data:result.message}
        }else{
            return {ok:false,data:result.message}
        }
    } catch (error) {
        return console.log("Fetch error:", error)
    }
  }