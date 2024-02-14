import * as React from "react";
import type { SVGProps } from "react";
const SvgLinkOut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.167 9.333v3.1c0 .374 0 .56-.073.703a.67.67 0 0 1-.291.291c-.143.073-.33.073-.703.073H3.567c-.374 0-.56 0-.703-.073a.67.67 0 0 1-.291-.291c-.073-.143-.073-.33-.073-.703V4.9c0-.373 0-.56.073-.703a.67.67 0 0 1 .291-.291c.143-.073.33-.073.703-.073h2.6m3-1.333H13.5m0 0v4.333m0-4.333L7.333 8.667"
    />
  </svg>
);
export default SvgLinkOut;
