import React, { useEffect, useState } from "react";
import { useProducts } from "../../contexts/ProductContext";
import { getProducts, deleteProduct } from "../../api/products";

import { Button } from "../../components/ui/Button";
import { LayoutCard } from "../../components/ui/LayoutCard";
import { Badge } from "../../components/ui/Badge";

import { ProductForm } from "../../components/forms/ProductForm";
import { Product } from "../../schemas/product.schema";

export const CatalogPage: React.FC = () => {
    const { state, dispatch } = useProducts();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Загружаем только если продукты пустые (первый раз или после очистки)
        if (state.products.length === 0 && !state.loading) {
            const load = async () => {
                dispatch({ type: "SET_LOADING", payload: true });
                
                try {
                    const data = await getProducts();
                    dispatch({
                        type: "SET_PRODUCTS",
                        payload: data.products,
                    });
                } catch (error) {
                    console.error("Failed to load products:", error);
                } finally {
                    dispatch({ type: "SET_LOADING", payload: false });
                }
            };

            load();
        }
    }, [dispatch, state.products.length, state.loading]);

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id);
            dispatch({
                type: "DELETE_PRODUCT",
                payload: id,
            });
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setEditingProduct(null);
        setShowForm(false);
    };

    if (state.loading && state.products.length === 0) {
        return <div>Загрузка товаров...</div>;
    }

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <Button variant="primary" onClick={handleCreate}>
                Добавить товар
            </Button>

            {showForm && (
                <LayoutCard title="Форма товара">
                    <ProductForm
                        editingProduct={editingProduct}
                        onFinish={closeForm}
                    />
                </LayoutCard>
            )}

            {state.products.length === 0 && !state.loading ? (
                <div>Нет товаров. Добавьте первый товар!</div>
            ) : (
                state.products.map((p) => (
                    <LayoutCard
                        key={p.id}
                        title={
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Товар: {p.title}</span>
                                <Badge color="blue" text={`ID: ${p.id}`} />
                            </div>
                        }
                    >
                        <div style={{ marginBottom: 12 }}>
                            <strong>Цена:</strong> ${p.price}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => handleEdit(p)}
                            >
                                Изменить
                            </Button>

                            <Button
                                variant="danger"
                                size="small"
                                onClick={() => handleDelete(p.id)}
                            >
                                Удалить
                            </Button>
                        </div>
                    </LayoutCard>
                ))
            )}
        </div>
    );
};