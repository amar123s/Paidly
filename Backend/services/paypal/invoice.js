import { paypalRequest } from "./client.js";

export async function createAndSendInvoice({requestId,
    recipientEmail,recipientName,dueDate,
    itemName,amount,note}){
    const created = await paypalRequest("/v2/invoicing/invoices",{
        method:"POST",
        requestId,
        body:{
            detail:{currency_code:"USD",note,payment_term:
                {term_type:"DUE_ON_DATE_SPECIFIED",
                    due_date:dueDate.toISOString().slice(0,10),
                },
            },
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

export async function sendReminder(paypalInvoiceId, subject, note) {
  await paypalRequest(`/v2/invoicing/invoices/${paypalInvoiceId}/remind`, {
    method: "POST",
    body: { subject, note, send_to_invoicer: false },
  });
}