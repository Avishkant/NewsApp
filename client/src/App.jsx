import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewArticle from "./pages/admin/NewArticle";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import AdminEntry from "./pages/admin/AdminEntry";
import ReporterPortal from "./pages/ReporterPortal";

function App() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function initials(name) {
    if (!name) return "";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <BrowserRouter>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold text-slate-800">
              NewsApp
            </div>
            <nav className="hidden sm:flex gap-4 text-sm text-slate-600">
              <Link className="hover:text-slate-900" to="/">
                Home
              </Link>
            </nav>
          </div>
          <div className="relative">
            {!user && (
              <Link
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                to="/login"
              >
                Login
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600">{user.name}</div>
                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold"
                >
                  {initials(user.name)}
                </button>
                {open && (
                  <div
                    ref={menuRef}
                    role="menu"
                    aria-label="User menu"
                    className="absolute right-0 mt-12 w-48 bg-white border rounded shadow-md p-2 z-50"
                  >
                    <div className="text-sm text-slate-700 px-2 py-1">
                      Signed in as
                    </div>
                    <div className="font-medium px-2 py-1">{user.name}</div>
                    <div className="mt-2 border-t pt-2">
                      {user.role === "owner" && (
                        <Link
                          to="/admin"
                          className="block px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        to="/reporter"
                        className="block px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        Reporter
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 text-sm text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminEntry />} />
          <Route path="/reporter" element={<ReporterPortal />} />
          <Route
            path="/admin/articles/new"
            element={
              <ProtectedRoute>
                <NewArticle />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
