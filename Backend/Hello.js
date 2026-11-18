import "dotenv/config";

const base = process.env.PAYPAL_BASE_URL;

const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
const tokenRes = await fetch(`${base}/v1/oauth2/token`,{
    method:"POST",
    headers:{Authorization:`Basic ${auth}`,"Content-Type":"application/x-www-form-urlencoded",},
    body:"grant_type=client_credentials",
});

const token = await tokenRes.json();
console.log(token.access_token? 'Token Ok': token);

const numRes= await fetch(`${base}/v2/invoicing/generate-next-invoice-number`,{
    method:"POST",
    headers:{Authorization:`Bearer ${token.access_token}`},  
});
console.log(await numRes.json());