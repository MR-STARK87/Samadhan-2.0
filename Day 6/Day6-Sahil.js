import React from "react";

function ProfileCard() {
  return (
    <div style={cardStyle}>
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        style={imageStyle}
      />
      <h2 style={nameStyle}>Sahil</h2>
      <p style={roleStyle}>Frontend Learner</p>
      <p style={descStyle}>
        Exploring React and building cool UI components step by step.
      </p>
    </div>
  );
}

// Basic inline styles
const cardStyle = {
  width: "220px",
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};

const imageStyle = {
  borderRadius: "50%",
  marginBottom: "10px",
};

const nameStyle = {
  fontSize: "18px",
  margin: "8px 0",
};

const roleStyle = {
  fontSize: "14px",
  color: "#666",
};

const descStyle = {
  fontSize: "12px",
  color: "#888",
};

export default ProfileCard;
