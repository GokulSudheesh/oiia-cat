import React, { useEffect, useRef, useState } from "react";
import OIIACat from "../OIIACat";
import songsData from "../../data/oiasongs.json";
import NowPalying from "../NowPalying";

type Props = {};

const getRandomIndex = (end: number) => Math.floor(Math.random() * end);

const RAND_INDEX = getRandomIndex(songsData.length);

const CatSection = (props: Props) => {
  const hasPlayedRef = useRef<boolean>(false);
  const [randIndex, setRandIndex] = useState(RAND_INDEX);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTouchStart = () => {
    if (hasPlayedRef.current) return;
    audioRef?.current?.play();
    hasPlayedRef.current = true;
    setHasPlayed(true);
  };

  const handleAudioEnd = () => {
    hasPlayedRef.current = false;
    setHasPlayed(false);
    setRandIndex(getRandomIndex(songsData.length));
  };

  const currentSong = songsData[randIndex];

  return (
    <div className="fixed w-full h-full inset-0 flex flex-col">
      <OIIACat
        className="m-auto"
        showHint={!hasPlayed}
        onHoldStart={handleTouchStart}
      />
      <audio
        ref={audioRef}
        src={currentSong.source}
        onEnded={handleAudioEnd}
        loop={false}
      />
      {hasPlayed && (
        <NowPalying
          name={currentSong.name}
          youtubeLink={currentSong.ytSource}
          className="min-w-80 max-w-[50%] absolute bottom-4 left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  );
};

export default CatSection;
