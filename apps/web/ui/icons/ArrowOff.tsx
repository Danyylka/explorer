import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowOff = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#888A90"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 3.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM7.5 12.5l5-5m0 0h-4m4 0v4M7.5 12.5l5-5m0 0h-4m4 0v4"
    />
  </svg>
);
export default SvgArrowOff;
