import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonPropsType = {
  children: ReactNode;
  onClick?: () => void;  
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  className?: string
}

const Button = ({
  children,
  onClick,
  type = "submit",
  disabled = false,
  className = "",
}: ButtonPropsType) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
