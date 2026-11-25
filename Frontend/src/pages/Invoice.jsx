import { useEffect,useState } from "react";
import { api } from "../api/client.js";


export default function Invoices(){
    const [invoices,setInvoices] = useState([]);
    
    const load =()=> api("/api/invoices").then(setInvoices);
    useEffect(()=>{load();},[]);

    async function approve(id){
        await api(`/api/invoices/${id}/approve`,{method:"POST"});
        load();
    }

      return (
    <>
      <h1>Invoices</h1>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>Client</th><th>Item</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i._id}>
                <td>{i.clientName}</td>
                <td className="muted">{i.itemName}</td>
                <td>${(i.amountCents / 100).toFixed(2)}</td>
                <td><span className={`badge ${i.status}`}>{i.status}</span></td>
                <td>{i.status === "DRAFT" && <button className="btn ghost" onClick={() => approve(i._id)}>Approve</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p className="muted" style={{ padding: 20 }}>No invoices yet.</p>}
      </div>
    </>
  );
}