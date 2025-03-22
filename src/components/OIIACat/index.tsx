import React, { useState } from "react";
import {
  ACCELERATE_EVENT_NAME,
  DECELERATE_EVENT_NAME,
} from "../../utils/constants";
import config from "../../config";

type Props = {
  isPlaying?: boolean;
  className?: string;
  onClickPlay?: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
};

const OIIACat = ({
  isPlaying,
  className,
  onClickPlay,
  onHoldStart,
  onHoldEnd,
}: Props) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showhint, setshowhint] = useState(true);

  const spinTheOIACat = () => {
    setIsSpinning(true);
    setshowhint(false);
    window.dispatchEvent(new Event(ACCELERATE_EVENT_NAME));
    onHoldStart?.();
  };

  const stopSpinningTheOIACat = () => {
    setIsSpinning(false);
    window.dispatchEvent(new Event(DECELERATE_EVENT_NAME));
    onHoldEnd?.();
  };

  return (
    <div
      className={`flex flex-col w-[25%] min-w-44 max-w-[500px] items-center gap-3 ${className}`}
    >
      <div
        className="flex cursor-pointer relative"
        onTouchStart={spinTheOIACat}
        onTouchEnd={stopSpinningTheOIACat}
        onMouseDown={spinTheOIACat}
        onMouseUp={stopSpinningTheOIACat}
      >
        {!isSpinning ? (
          <img
            className="w-full h-auto pointer-events-none select-none"
            src={`${config.basePath}/oiia-cat.png`}
            alt="OIIACat"
          />
        ) : (
          <img
            className="w-full h-auto pointer-events-none  select-none"
            src={`${config.basePath}/oiia-cat-spin.gif`}
            alt="OIIACat"
          />
        )}
        {showhint && (
          <p className="absolute top-[-24px] text-3xl text-slate-300">
            Hold meee
          </p>
        )}
      </div>
      {!isPlaying && (
        <button
          onClick={onClickPlay}
          className="border border-[#bebebe] border-dotted text-slate-300 text-lg p-2 w-fit rounded-lg cursor-pointer flex items-center justify-center"
        >
          ▶
        </button>
      )}
    </div>
  );
};

export default OIIACat;
