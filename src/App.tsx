import React from "react";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";

import { RegistrationPage } from "./pages/RegistrationPage";
import { CatalogPage } from "./pages/CatalogPage";

import { Button } from "./components/ui/Button";
import { LayoutCard } from "./components/ui/LayoutCard";

const AppContent: React.FC = () => {
    const { state, dispatch } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
    };

    if (!state.isAuthenticated) {
        return <RegistrationPage />;
    }

    return (
        <ProductProvider>
            <div style={{ maxWidth: 900, margin: "40px auto" }}>
                <LayoutCard
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2 style={{ margin: 0 }}>Catalog</h2>

                            <Button
                                variant="secondary"
                                size="small"
                                onClick={handleLogout}
                            >
                                Выйти
                            </Button>
                        </div>
                    }
                >
                    <CatalogPage />
                </LayoutCard>
            </div>
        </ProductProvider>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;