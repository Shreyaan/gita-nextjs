import React, { useEffect, useState, useRef } from "react";
import { Data, shlokaMetadata } from "..";
import { useIntersectionObserver } from "usehooks-ts";

export function ShlokaText(props: {
  ShlokaMetadata: shlokaMetadata;
  refreshedShloka: Data;
  setShlokaArr: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const ran = useRef(false);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const [wasVisible, setWasVisible] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    if (!wasVisible && isVisible) {
      setWasVisible(true);
    }
  };
  handleVisibilityChange(isVisible);

  useEffect(() => {
    if (wasVisible && !isVisible && !ran.current) {
      props.setShlokaArr((prev) => [...prev, prev[prev.length - 1] + 1]);
      ran.current = true;
    }
  }, [isVisible, wasVisible, props.setShlokaArr, props]);
  return (
    <div ref={ref} className="w-11/12 lg:w-3/4 ">
      {props.ShlokaMetadata && (
        <div className="border p-4 pt-7 m-4 border-gray-500 text-white">
          <p>{props.refreshedShloka.englishText}</p>

          <br />

          <p>{props.refreshedShloka.englishCommentary}</p>
          <br />
        </div>
      )}
    </div>
  );
}
