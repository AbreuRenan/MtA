import React from "react";

export default function BackgroundImage({ src, children, customStyle }) {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        width: "100%",
        height: '100%',
        customStyle,
      }}
    >
      {children}
    </div>
  );
}
