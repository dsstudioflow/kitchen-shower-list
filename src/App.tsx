import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import GuestList from "./pages/GuestList";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardGifts from "./pages/dashboard/Gifts";
import DashboardReservations from "./pages/dashboard/Reservations";
import DashboardSettings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/lista/:slug" element={<GuestList />} />
            
            {/* Dashboard routes (protected) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/presentes" element={<DashboardGifts />} />
            <Route path="/dashboard/reservas" element={<DashboardReservations />} />
            <Route path="/dashboard/configuracoes" element={<DashboardSettings />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
