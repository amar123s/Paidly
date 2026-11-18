import { paypalRequest } from "./client.js";

export async function createAndSendInvoice({requestId,
    recipientEmail,recipientName,
    itemName,amount,note}){
    const created = await paypalRequest("/v2/invoicing/invoices",{
        method:"POST",
        requestId,
        body:{
            detail:{currency_code:"USD",note},
            primary_recipients:[
                {billing_info:{name:{given_name:recipientName},email_address:recipientEmail}},
            ], items:[{name:itemName,quantity:"1",unit_amount:
                {currency_code:"USD",value:amount}}
            ],
        },
    });

    const invoiceId= created.href.split("/").pop();
    await paypalRequest(`/v2/invoicing/invoices/${invoiceId}/send`,{
        method:"POST",
        body:{send_to_recipient:true},
    });
    return invoiceId
}