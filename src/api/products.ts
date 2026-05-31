import { Product } from "../schemas/product.schema";

const BASE_URL = "https://dummyjson.com/products";

export const getProducts = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

export const createProduct = async (product: Product) => {
    const res = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    return res.json();
};

export const updateProduct = async (product: Product) => {
    const res = await fetch(`${BASE_URL}/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    return res.json();
};

export const deleteProduct = async (id: number) => {
    await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
};