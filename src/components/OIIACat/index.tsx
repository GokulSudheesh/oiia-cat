import React, { useState } from "react";
import {
  ACCELERATE_EVENT_NAME,
  DECELERATE_EVENT_NAME,
} from "../../utils/constants";
import config from "../../config";
import styles from "./style.module.css";

type Props = {
  showHint?: boolean;
  className?: string;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
};

const OIIACat = ({ showHint, className, onHoldStart, onHoldEnd }: Props) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const spinTheOIACat = () => {
    setIsSpinning(true);
    window.dispatchEvent(new Event(ACCELERATE_EVENT_NAME));
    onHoldStart?.();
  };

  const stopSpinningTheOIACat = () => {
    setIsSpinning(false);
    window.dispatchEvent(new Event(DECELERATE_EVENT_NAME));
    onHoldEnd?.();
  };

  return (
    <div className={`flex w-[25%] min-w-44 max-w-[500px] ${className}`}>
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
        {showHint && (
          <p className="absolute text-3xl text-slate-300">Hold meee</p>
        )}
      </div>
    </div>
  );
};

export default OIIACat;
