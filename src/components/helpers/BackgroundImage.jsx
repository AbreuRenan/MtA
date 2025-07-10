import React from "react";

export default function BackgroundImage({ src, children, customStyle }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "0", top: "0",
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        backgroundSize: "cover",
        width: "calc(100% + 20px)",
        height: "calc(100% + 40px)",
        customStyle,
      }}
    >
      {children}
    </div>
  );
}
