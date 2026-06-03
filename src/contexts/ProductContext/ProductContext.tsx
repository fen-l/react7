import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "../../schemas/product.schema";

type State = {
    products: Product[];
    loading: boolean;
};

type Action =
    | { type: "SET_PRODUCTS"; payload: Product[] }
    | { type: "ADD_PRODUCT"; payload: Product }
    | { type: "UPDATE_PRODUCT"; payload: Product }
    | { type: "DELETE_PRODUCT"; payload: number }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "CLEAR_PRODUCTS" };

const initialState: State = {
    products: [],
    loading: false,
};

// Функция для загрузки продуктов из localStorage
const loadProducts = (): State => {
    const saved = localStorage.getItem("products");
    
    if (saved) {
        try {
            const products = JSON.parse(saved);
            return {
                products: products,
                loading: false,
            };
        } catch (error) {
            console.error("Failed to parse products:", error);
        }
    }
    
    return initialState;
};

function productReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PRODUCTS":
            return { ...state, products: action.payload };

        case "ADD_PRODUCT":
            return {
                ...state,
                products: [action.payload, ...state.products],
            };

        case "UPDATE_PRODUCT":
            return {
                ...state,
                products: state.products.map((p) =>
                    p.id === action.payload.id ? action.payload : p
                ),
            };

        case "DELETE_PRODUCT":
            return {
                ...state,
                products: state.products.filter((p) => p.id !== action.payload),
            };
            
        case "SET_LOADING":
            return { ...state, loading: action.payload };
            
        case "CLEAR_PRODUCTS":
            return { ...state, products: [] };

        default:
            return state;
    }
}

type ProductContextType = {
    state: State;
    dispatch: React.Dispatch<Action>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Загружаем сохраненные продукты при инициализации
    const [state, dispatch] = useReducer(productReducer, loadProducts());

    // Сохраняем продукты в localStorage при каждом изменении
    useEffect(() => {
        // Не сохраняем пустой массив, если пользователь не авторизован
        if (state.products.length > 0) {
            localStorage.setItem("products", JSON.stringify(state.products));
        } else {
            // Если продукты пустые, возможно, нужно очистить localStorage
            // Но не удаляем, если пользователь просто вышел (это сделает AuthProvider)
            const isAuthenticated = localStorage.getItem("user");
            if (!isAuthenticated) {
                localStorage.removeItem("products");
            }
        }
    }, [state.products]);

    return (
        <ProductContext.Provider value={{ state, dispatch }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProducts must be used within ProductProvider");
    }

    return context;
};