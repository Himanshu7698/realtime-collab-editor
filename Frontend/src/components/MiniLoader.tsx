import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface PropsType {
    color?:string,
    size?:number,
    style?: React.CSSProperties
}
export default function MiniLoader({color, size, style}:PropsType) {
  return <BeatLoader color={color || "white"} cssOverride={style} loading={true} size={size || 10} />;
}
