import React from 'react';
import cn from 'classnames';
import styles from './Button.module.css';

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  size = 'medium',
                                                  isLoading = false,
                                                  children,
                                                  disabled,
                                                  ...props
                                              }) => {
    return (
        <button
            className={cn(
                styles.button,
                styles[variant],
                styles[size],
                {
                    [styles.loading]: isLoading,
                }
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Загрузка...' : children}
        </button>
    );
};