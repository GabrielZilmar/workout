import { SVGProps } from "react";

type LoadingSvgProps = SVGProps<SVGSVGElement>;

const LoadingSvgComponent = (props: LoadingSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <style>
      {
        "@keyframes loader2{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}"
      }
    </style>
    <path
      fill="#265BFF"
      d="M17.179 13.605a.431.431 0 0 0 .279.514l.775.245a.393.393 0 0 0 .499-.268 7.318 7.318 0 0 0-4.5-8.658.39.39 0 0 0-.507.255l-.245.775a.43.43 0 0 0 .261.523 5.69 5.69 0 0 1 3.438 6.614z"
      style={{
        animation: "loader2 1s cubic-bezier(.63,-.71,.32,1.28) infinite both",
        transformOrigin: "center center",
      }}
    />
  </svg>
);
export default LoadingSvgComponent;
