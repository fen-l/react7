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
        dispatch({ type: "LOGOUT" });
    };

    if (!state.isAuthenticated) {
        return <RegistrationPage />;
    }

    return (
        <div
            style={{
                maxWidth: "700px",
                margin: "40px auto",
                padding: "20px",
            }}
        >
            <LayoutCard
                title={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
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
    );
};

function App() {
    return (
        <AuthProvider>
            <ProductProvider>
                <AppContent />
            </ProductProvider>
        </AuthProvider>
    );
}

export default App;