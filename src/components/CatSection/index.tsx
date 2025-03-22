import React, { useRef, useState } from "react";
import OIIACat from "../OIIACat";
import songsData from "../../data/oiasongs.json";
import NowPalying from "../NowPalying";
import config from "../../config";

type Props = {};

const getRandomIndex = (end: number) => Math.floor(Math.random() * end);

const RAND_INDEX = getRandomIndex(songsData.length);

const CatSection = (props: Props) => {
  const isPlayingRef = useRef<boolean>(false);
  const [randIndex, setRandIndex] = useState(RAND_INDEX);
  const [isPlaying, setIsPaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlaySong = () => {
    if (isPlayingRef.current) return;
    audioRef?.current?.play();
    isPlayingRef.current = true;
    setIsPaying(true);
  };

  const handleAudioEnd = () => {
    isPlayingRef.current = false;
    setIsPaying(false);
    setRandIndex(getRandomIndex(songsData.length));
  };

  const currentSong = songsData[randIndex];

  return (
    <div className="fixed w-full h-full inset-0 flex flex-col">
      <OIIACat
        className="m-auto"
        isPlaying={isPlaying}
        onClickPlay={handlePlaySong}
      />
      <audio
        ref={audioRef}
        src={`${config.basePath}${currentSong.source}`}
        onEnded={handleAudioEnd}
        loop={false}
      />
      {isPlaying && (
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
