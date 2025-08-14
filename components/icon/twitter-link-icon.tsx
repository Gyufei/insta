import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <defs>
      <mask
        id="a"
        maskUnits="objectBoundingBox"
        style={{
          maskType: 'alpha',
        }}
      >
        <rect width={20} height={20} fill="#FFF" rx={0} />
      </mask>
    </defs>
    <g mask="url(#a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17.054 3h-2.453l-4.043 4.474L7.063 3H2l6.049 7.657L2.316 17h2.455l4.425-4.894 3.068 3.883q-.287-.717-.287-1.489 0-.505.125-.994l-7.237-9.16h1.459l6.268 8.023q.387-.615.965-1.055L11.694 8.93 17.054 3Z"
      />
      <circle cx={16} cy={14.5} r={3} fill="currentColor" />
    </g>
  </svg>
);
export default SvgComponent;
