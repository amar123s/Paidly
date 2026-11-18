import "dotenv/config";
import { createAndSendInvoice} from "./services/paypal/invoice.js";

const id = await createAndSendInvoice({
    requestId:crypto.randomUUID(),
    recipientEmail:"sb-1xpcg53706906@personal.example.com",
    recipientName:"Test Client",
    itemName:"Website Design",
    amount:"100.00",
    note:"Thanks fro your buisness!",
});
console.log("Sent invoice",id);