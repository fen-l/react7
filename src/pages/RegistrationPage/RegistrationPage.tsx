import React, { useReducer } from "react";
import { z } from "zod";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { LayoutCard } from "../../components/ui/LayoutCard";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../contexts/AuthContext";

/* 1. Схема ZOD (источник правды Source of truth) */

const RegistrationSchema = z.object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    username: z.string().min(1, "Имя обязательно"),
    city: z.string().min(1, "Город обязателен"),
    occupation: z.string().min(1, "Выберите профессию"),
    agree: z.boolean().refine((val) => val, {
        message: "Нужно согласиться с правилами",
    }),
});

type FormData = z.infer<typeof RegistrationSchema>;

/* 2. state + actions */

interface IFormState {
    currentStep: 1 | 2 | 3;
    formData: FormData;
    errors: Record<string, string>;
    isSubmitting: boolean;
}

type TFormAction =
    | {
    type: "UPDATE_FIELD";
    field: keyof FormData;
    value: FormData[keyof FormData];
}
    | { type: "SET_ERROR"; field: string; message: string }
    | { type: "SET_ERRORS"; errors: Record<string, string> }
    | { type: "NEXT_STEP" }
    | { type: "PREV_STEP" }
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_SUCCESS" };

/* 3. initial state */

const initialState: IFormState = {
    currentStep: 1,
    isSubmitting: false,
    errors: {},
    formData: {
        email: "",
        password: "",
        username: "",
        city: "",
        occupation: "",
        agree: false,
    },
};

/* 4. reducer */

function registrationReducer(state: IFormState, action: TFormAction): IFormState {
    switch (action.type) {
        case "UPDATE_FIELD":
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.field]: action.value,
                },
                errors: {
                    ...state.errors,
                    [action.field]: "",
                },
            };

        case "SET_ERROR":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.field]: action.message,
                },
            };

        case "SET_ERRORS":
            return {
                ...state,
                errors: action.errors,
            };

        case "NEXT_STEP":
            return {
                ...state,
                currentStep: (state.currentStep + 1) as 1 | 2 | 3,
            };

        case "PREV_STEP":
            return {
                ...state,
                currentStep: (state.currentStep - 1) as 1 | 2 | 3,
            };

        case "SUBMIT_START":
            return {
                ...state,
                isSubmitting: true,
            };

        case "SUBMIT_SUCCESS":
            return {
                ...state,
                isSubmitting: false,
            };

        default:
            return state;
    }
}

/* 5. validation helpers */

const formatZodErrors = (issues: z.ZodIssue[]) => {
    const errors: Record<string, string> = {};

    issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
    });

    return errors;
};

/* 6. component */

export const RegistrationPage: React.FC = () => {
    const [state, dispatch] = useReducer(registrationReducer, initialState);
    const { dispatch: authDispatch } = useAuth();

    const validateStep = (step: number) => {
        let schema;

        switch (step) {
            case 1:
                schema = RegistrationSchema.pick({
                    email: true,
                    password: true,
                });
                break;

            case 2:
                schema = RegistrationSchema.pick({
                    username: true,
                    city: true,
                });
                break;

            case 3:
                schema = RegistrationSchema.pick({
                    occupation: true,
                    agree: true,
                });
                break;

            default:
                return true;
        }

        const result = schema.safeParse(state.formData);

        if (!result.success) {
            dispatch({
                type: "SET_ERRORS",
                errors: formatZodErrors(result.error.issues),
            });
            return false;
        }

        dispatch({ type: "SET_ERRORS", errors: {} });
        return true;
    };

    /* step handlers */

    const handleNext = () => {
        if (validateStep(state.currentStep)) {
            dispatch({ type: "NEXT_STEP" });
        }
    };

    const handlePrev = () => {
        dispatch({ type: "PREV_STEP" });
    };

    const handleSubmit = () => {
        if (!validateStep(3)) return;

        dispatch({ type: "SUBMIT_START" });

        setTimeout(() => {
            const user = {
                username: state.formData.username,
            };

            // 1. сохраняем в localStorage
            localStorage.setItem("user", JSON.stringify(user));

            // 2. обновляем глобальный auth state
            authDispatch({
                type: "LOGIN",
                payload: user,
            });

            dispatch({ type: "SUBMIT_SUCCESS" });

            console.log("REGISTERED USER:", user);
        }, 2000);
    };

    /* step renders */

    const renderStep1 = () => (
        <>
            <Input
                label="Email"
                value={state.formData.email}
                onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "email",
                        value: e.target.value,
                    })
                }
                error={state.errors.email}
            />

            <Input
                label="Password"
                type="password"
                value={state.formData.password}
                onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "password",
                        value: e.target.value,
                    })
                }
                error={state.errors.password}
            />
        </>
    );

    const renderStep2 = () => (
        <>
            <Input
                label="Username"
                value={state.formData.username}
                onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "username",
                        value: e.target.value,
                    })
                }
                error={state.errors.username}
            />

            <Input
                label="City"
                value={state.formData.city}
                onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "city",
                        value: e.target.value,
                    })
                }
                error={state.errors.city}
            />
        </>
    );

    const renderStep3 = () => (
        <>
            <Input
                label="Occupation"
                value={state.formData.occupation}
                onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "occupation",
                        value: e.target.value,
                    })
                }
                error={state.errors.occupation}
            />

            <label style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input
                    type="checkbox"
                    checked={state.formData.agree}
                    onChange={(e) =>
                        dispatch({
                            type: "UPDATE_FIELD",
                            field: "agree",
                            value: e.target.checked,
                        })
                    }
                />
                Я согласен с правилами
            </label>

            {state.errors.agree && (
                <div style={{ color: "red" }}>{state.errors.agree}</div>
            )}
        </>
    );

    /* ui */

    return (
        <LayoutCard
            title={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Регистрация</span>
                    <Badge
                        color="blue"
                        text={`Шаг ${state.currentStep} из 3`}
                    />
                </div>
            }
            footer={
                <div style={{ display: "flex", gap: 8 }}>
                    {state.currentStep > 1 && (
                        <Button variant="secondary" onClick={handlePrev}>
                            Назад
                        </Button>
                    )}

                    {state.currentStep < 3 && (
                        <Button variant="primary" onClick={handleNext}>
                            Далее
                        </Button>
                    )}

                    {state.currentStep === 3 && (
                        <Button
                            variant="primary"
                            isLoading={state.isSubmitting}
                            onClick={handleSubmit}
                        >
                            Зарегистрироваться
                        </Button>
                    )}
                </div>
            }
        >
            {state.currentStep === 1 && renderStep1()}
            {state.currentStep === 2 && renderStep2()}
            {state.currentStep === 3 && renderStep3()}
        </LayoutCard>
    );
};