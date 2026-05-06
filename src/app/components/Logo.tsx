import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Logo({ width = 24, height = 24 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 1024 1024" fill="none">
      <Path
        d="M89.357 209.025H934.643v157.66L511.05 484.455 89.357 366.685V209.025Z"
        stroke="#20e69c"
        strokeWidth={90}
        strokeLinecap="round"
        strokeLinejoin="round"
        fillRule="evenodd"
      />
      <Path
        d="M831.46 934.641H192.54A103.183 103.183 0 0 1 89.357 831.458V102.563a13.208 13.208 0 0 1 13.208-13.208h818.87a13.208 13.208 0 0 1 13.208 13.208v728.9A103.184 103.184 0 0 1 831.46 934.641Z"
        stroke="#20e69c"
        strokeWidth={90}
        fillRule="evenodd"
      />
    </Svg>
  );
}
