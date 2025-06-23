import React from "react";

function AlertMsg({ message, type }) {
  const alertStyles = {
    success: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      position: "absolute",
      width: "70%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      height: "100px",
    },
    error: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      position: "absolute",
      width: "70%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      height: "100px",
    },
    warning: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff3cd",
      color: "#856404",
      border: "1px solid #ffeeba",
      position: "absolute",
      width: "70%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      height: "100px",
    },
  };

  return (
    <div style={{ ...alertStyles[type], padding: "10px", borderRadius: "5px" }}>
      {message}
    </div>
  );
}

export default AlertMsg;
