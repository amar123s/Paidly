import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function NewInvoices(){
    const navigate = userNavigate();
    const [notes,setNotes] = useState("");
    const [draft,setDraft] = useState("");
    const [loading,setLoading] = useState("");
    const [error,setError] = useState("");

    async function generate() {
        setLoading(true); setError("");
        try{
            const {draft}= await api("api/agent/draft-invoice",{method:"POST",body:{notes}});
            setDraft({...draft,amount:(draft.amountCents/100).toFixed(2),dueDate:draft.dueDate.slice(0,10)});
        }catch{setError("Cloud not generate a draft.Try again.");}
        setLoading(false);
    }

    const set = (k)=>(e)=>setDraft({...draft,[k]:e.target.value});

    async function save() {
        try{
            await api("/api/invoices",{
                method:"POST",
                body:{
                    clientName:draft.clientName,
                    clientEmail:draft.clientEmail,
                    itemName:draft.itemName,
                    amountCents: Math.round(Number(draft.amount) * 100),
                    note: draft.note,
                    dueDate: draft.dueDate,
                },
            });
            navigate("/");
        }catch{
            setError("Check the fields and try again")}
    }
    return (
    <>
      <h1>New invoice</h1>
      <div className="card stack">
        <label>Describe the job in plain words</label>
        <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Designed a logo for Ravi at Acme, $250, ravi@acme.com, due in 2 weeks" />
        <button className="btn" onClick={generate} disabled={loading || notes.length < 10}>
          {loading ? "Drafting…" : "Draft with AI"}
        </button>
      </div>

      {draft && (
        <div className="card stack" style={{ marginTop: 20 }}>
          <div className="row">
            <div><label>Client</label><input value={draft.clientName} onChange={set("clientName")} /></div>
            <div><label>Email</label><input value={draft.clientEmail || ""} onChange={set("clientEmail")} /></div>
          </div>
          <div><label>Item</label><input value={draft.itemName} onChange={set("itemName")} /></div>
          <div className="row">
            <div><label>Amount (USD)</label><input value={draft.amount} onChange={set("amount")} /></div>
            <div><label>Due date</label><input type="date" value={draft.dueDate} onChange={set("dueDate")} /></div>
          </div>
          <div><label>Message to client</label><textarea rows={3} value={draft.note} onChange={set("note")} /></div>
          <button className="btn" onClick={save}>Save as draft</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </>
  );
}