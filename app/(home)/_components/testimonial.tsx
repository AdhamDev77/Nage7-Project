import Image from "next/image";
import React from "react";

type Props = {
  imageUrl: string;
  opinion: string;
  name: string;
};

const Testimonial = ({ imageUrl, opinion, name }: Props) => {
  return (
    <div className="flex flex-1 flex-col items-center bg-white p-6 rounded-lg shadow-lg">
      <img src={imageUrl} alt={name} className="w-28 h-28 rounded-full mb-6 " />

      <p className="text-center text-gray-600 mb-4">"{opinion}"</p>
      <p className="text-center text-emerald-600 mt-auto font-semibold">- {name}</p>
    </div>
  );
};

export default Testimonial;
