import * as React from "react";
import type { SVGProps } from "react";
const SvgGrid = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M1 16a1 1 0 0 1-1-1V9.889a1 1 0 0 1 1-1h5.111a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H1Zm.778-1.778h3.555v-3.555H1.778v3.555ZM8.888 1a1 1 0 0 1 1-1H15a1 1 0 0 1 1 1v5.111a1 1 0 0 1-1 1H9.889a1 1 0 0 1-1-1V1Zm1.779.778v3.555h3.555V1.778h-3.555ZM0 1a1 1 0 0 1 1-1h5.111a1 1 0 0 1 1 1v5.111a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1Zm1.778.778v3.555h3.555V1.778H1.778ZM9.889 16a1 1 0 0 1-1-1V9.889a1 1 0 0 1 1-1H15a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9.889Zm.778-1.778h3.555v-3.555h-3.555v3.555Z"
    />
  </svg>
);
export default SvgGrid;