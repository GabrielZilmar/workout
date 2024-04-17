import { InputHTMLAttributes } from "react";

export const StyledOutlineInput = (
  props: InputHTMLAttributes<HTMLInputElement>
) => (
  <input
    {...props}
    className="block w-full
    rounded-md border-0 py-1.5 pl-4
    text-gray-900 placeholder:text-gray-400
    focus:outline focus:ring-2 focus:ring-inset focus:ring-indigo-600
    sm:text-sm sm:leading-6"
  />
);

export default StyledOutlineInput;
