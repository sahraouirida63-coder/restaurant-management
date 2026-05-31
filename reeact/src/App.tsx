import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import LoginPage from "./pages/LoginPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import WaiterDashboard from "./pages/WaiterDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import StockDashboard from "./pages/StockDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" as const } },
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="w-full"
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-zinc-500 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  const roleDefaultPath = (role?: string) => {
    switch (role) {
      case "owner": return "/owner";
      case "manager": return "/manager";
      case "waiter": return "/waiter";
      case "chef": return "/chef";
      case "cashier": return "/cashier";
      case "stock": return "/stock";
      case "delivery": return "/delivery";
      default: return "/";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to={roleDefaultPath(user?.role)} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={["owner"]}>
              <Layout>
                <PageWrapper><OwnerDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["manager"]}>
              <Layout>
                <PageWrapper><ManagerDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter"
          element={
            <ProtectedRoute roles={["waiter"]}>
              <Layout>
                <PageWrapper><WaiterDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef"
          element={
            <ProtectedRoute roles={["chef"]}>
              <Layout>
                <PageWrapper><ChefDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier"
          element={
            <ProtectedRoute roles={["cashier"]}>
              <Layout>
                <PageWrapper><CashierDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute roles={["stock"]}>
              <Layout>
                <PageWrapper><StockDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery"
          element={
            <ProtectedRoute roles={["delivery"]}>
              <Layout>
                <PageWrapper><DeliveryDashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
