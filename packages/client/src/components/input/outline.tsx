import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  FieldPath,
  FieldError,
} from "react-hook-form";
import { InputHTMLAttributes } from "react";

type StyledOutlineInputProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    register?: UseFormRegister<T>;
    registerOptions?: RegisterOptions<T, FieldPath<T>>;
    errors?: FieldError;
    name: Path<T>;
  };

export const StyledOutlineInput = <T extends FieldValues>({
  register,
  registerOptions,
  errors,
  name,
  className,
  ...props
}: StyledOutlineInputProps<T>) => (
  <>
    <input
      {...props}
      {...(name && register && register(name, registerOptions))}
      className={`w-full
    rounded-md border-0 py-1.5 pl-4
    text-gray-900 placeholder:text-gray-400
    focus:outline focus:ring-2 focus:ring-inset focus:ring-indigo-600
    sm:text-sm sm:leading-6 ${className}`}
    />
    {errors && (
      <span className="text-red-500" role="alert">
        {errors.message}
      </span>
    )}
  </>
);

export default StyledOutlineInput;
