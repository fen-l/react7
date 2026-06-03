import React, { createContext, useContext, useEffect, useReducer } from "react";

type User = {
    username: string;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
};

type Action =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" };

// Функция для загрузки состояния из localStorage
const loadAuthState = (): AuthState => {
    const saved = localStorage.getItem("user");
    
    if (saved) {
        try {
            const user = JSON.parse(saved);
            return {
                user: user,
                isAuthenticated: true,
            };
        } catch (error) {
            console.error("Failed to parse user:", error);
        }
    }
    
    return {
        user: null,
        isAuthenticated: false,
    };
};

function authReducer(state: AuthState, action: Action): AuthState {
    switch (action.type) {
        case "LOGIN":
            const newState = {
                user: action.payload,
                isAuthenticated: true,
            };
            // Сохраняем в localStorage сразу
            localStorage.setItem("user", JSON.stringify(action.payload));
            return newState;

        case "LOGOUT":
            // Очищаем localStorage при выходе
            localStorage.removeItem("user");
            localStorage.removeItem("products"); // также очищаем продукты
            return {
                user: null,
                isAuthenticated: false,
            };

        default:
            return state;
    }
}

type AuthContextType = {
    state: AuthState;
    dispatch: React.Dispatch<Action>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Инициализируем reducer с загруженными данными
    const [state, dispatch] = useReducer(authReducer, loadAuthState());

    // Этот эффект теперь не нужен, так как мы загружаем при инициализации
    // и сохраняем в reducer при каждом действии
    // useEffect(() => {
    //     const saved = localStorage.getItem("user");
    //     if (saved) {
    //         dispatch({
    //             type: "LOGIN",
    //             payload: JSON.parse(saved),
    //         });
    //     }
    // }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};