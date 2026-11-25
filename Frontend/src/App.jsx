import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/login.jsx";
import Invoices from "./pages/invoice.jsx";
import NewInvoices from "./pages/NewInvoice.jsx";

export default function App(){
  const {user,logout} = useAuth();

  return (
    <>
      <nav className="nav">
        <span className="brand">Paidly</span>
        {user && (
          <>
            <Link to="/">Invoices</Link>
            <Link to="/new">New</Link>
            <a href="#" onClick={logout}>Log out</a>
          </>
        )}
      </nav>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><NewInvoices /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}