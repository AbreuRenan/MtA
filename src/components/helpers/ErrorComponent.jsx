import React from "react";

function ErrorComponent({msg = 'Error Generico'}) {
  return (
    <div
      style={{
        padding: "10px",
        position: "absolute",
        backgroundColor: "rgba(255,0,0,0.5)",
        color: "white",
        margin: "0 auto",
        width: "100%",
        textAlign: "center",
        top: "100px",
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.4)'
      }}
    >
      {msg}
    </div>
  );
}

export default ErrorComponent;
