import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { useAuthStore } from "./stores/authStore";
import { getMe, getAccessToken, clearTokens } from "./api/axios";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

function App() {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const restoreUser = async () => {
      if (getAccessToken() && !user) {
        try {
          const me = await getMe();
          setUser(me);
        } catch {
          clearTokens();
        }
      }
      setLoading(false);
    };
    restoreUser();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "280px",
            "--sidebar-collapsed-width": "80px",
          } as React.CSSProperties
        }
      >
        <div className="flex-1 flex min-h-screen bg-gray-900 text-white">
          {/* Sidebar */}
          {user && <AppSidebar />}

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center p-4 bg-gray-800 relative">
              <h1 className="text-xl font-bold">Finlay</h1>
              <SidebarTrigger className="absolute right-4 top-1/2 -translate-y-1/2 z-50" />
            </div>

            {/* Routes */}
            <main className="p-4 md:p-6 overflow-auto">
              <Routes>
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
