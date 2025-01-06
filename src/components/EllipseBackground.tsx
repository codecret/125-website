import React from "react";

const Ellipse = ({
  stroke = "rgba(0, 89, 223, 0.1)",
  strokeWidth = "7",
  className = "",
  width = "100",
  height = "100",
  rx = 50,
  ry = 50,
}) => {
  return (
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        cx={width}
        cy={height}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={className}
      />
    </svg>
  );
};

export default Ellipse;
