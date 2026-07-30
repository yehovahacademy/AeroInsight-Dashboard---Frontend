const API_URL = import.meta.env.VITE_API_URL;


export async function analyzeRoute(routeData){

    const response = await fetch(
        `${API_URL}/network/analyze_route`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(routeData)
        }
    );


    if(!response.ok){
        throw new Error("Failed to analyze route");
    }


    return await response.json();
}