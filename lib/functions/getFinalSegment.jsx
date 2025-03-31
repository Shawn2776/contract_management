import React from "react";

const getFinalSegment = (str) => {
  const parts = str.split("/"); // Split the string by "/"
  const lastPart = parts.pop(); // Get the last segment
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1); // Capitalize first letter
};

export default getFinalSegment;
