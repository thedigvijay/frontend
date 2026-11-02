import React from "react";

const Heading = ({highlight, heading}) => {
  return (
    <div className="py-10">
      <div className="w-fit mx-auto  ">
        <h2 className="md:text-5xl text-[2.5rem] font-bold  ">
          <span className="text-orange-500">{highlight}</span> {heading}
        </h2>
        <div className="w-34 h-1 bg-orange-300 md:mt-4 mt-1 ml-auto"></div>
      </div>
    </div>
  );
};

export default Heading;
