import React from "react";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";

import { RegistrationPage } from "./pages/RegistrationPage";
import { CatalogPage } from "./pages/CatalogPage";

import { Button } from "./components/ui/Button";
import { LayoutCard } from "./components/ui/LayoutCard";

const AppContent: React.FC = () => {
    const { state, dispatch } = useAuth();

    return (
        <div
            style={{
                maxWidth: "700px",
                margin: "40px auto",
                padding: "20px",
            }}
        >
            {!state.isAuthenticated ? (
                <RegistrationPage />
            ) : (
                <ProductProvider>
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
                                    onClick={() => {
                                        localStorage.removeItem("user");
                                        dispatch({ type: "LOGOUT" });
                                    }}
                                >
                                    Выйти
                                </Button>
                            </div>
                        }
                    >
                        <CatalogPage />
                    </LayoutCard>
                </ProductProvider>
            )}
        </div>
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