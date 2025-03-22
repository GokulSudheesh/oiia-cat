import React from "react";
import config from "../config";

type Props = {
  name: string;
  youtubeLink?: string;
  className?: string;
};

const NowPalying = ({ name, youtubeLink, className }: Props) => {
  return (
    <div
      className={`flex flex-col mt-6 border border-[#bebebe] p-4 rounded-lg bg-[#0000007d] text-slate-100 ${className}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-2xl ">Now Playing</p>
        {youtubeLink && (
          <div className="flex items-center gap-2">
            <img
              src={`${config.basePath}/icons/ytbe-icn.png`}
              width="24"
              height="auto"
              alt="Youtube Pixel Icon"
            />
            <a
              className="hover:underline"
              href={youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on Youtube
            </a>
          </div>
        )}
      </div>
      <p className="text-xl "> {name}</p>
    </div>
  );
};

export default NowPalying;
