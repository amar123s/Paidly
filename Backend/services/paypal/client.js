let cached = {token : null, expiresAt:0};
async function getAccessToken(){
    if(cached.token && Date.now() < cached.expiresAt- 60_000) return cached.token;
    

    const auth =Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`)
        .toString("base64");
    
        const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,{
            method:"POST",
            headers:{
                Authorization:`Basic ${auth}`,
                "Content-Type":"application/x-www-form-urlencoded",
            },
            body:"grant_type=client_credentials",
        });
        const data = await res.json();
        if(!res.ok) throw new Error(`PayPal auth failed: ${JSON.stringify(data)}`);
        console.log("Scopes:", data.scope);
        
        cached= {token:data.access_token, expiresAt:Date.now()+ data.expires_in*1000};
        return cached.token;
}

export async function paypalRequest(path,{method="GET",body,requestId}={}){
    const token = await getAccessToken();
    const res = await fetch(`${process.env.PAYPAL_BASE_URL}${path}`,{
        method, headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json",
            ...(requestId && {"PayPal-Request-Id":requestId}),
        }, body:body ? JSON.stringify(body):undefined,
    });
    const text = await res.text();
    const data = text? JSON.parse(text):{};
//     if (!data.scope?.includes("services/invoicing")) {
//   console.warn("Token has no invoicing scope. Check the app's Invoicing feature and the business account country.");
// }
    if(!res.ok) throw new Error(`PayPal ${method} ${path} failed: ${JSON.stringify(data)}`);
    return data;
    
}