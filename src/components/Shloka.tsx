import React, { useEffect, useState, useRef } from "react";
import { Data, shlokaMetadata } from "..";
import { useEffectOnce, useIntersectionObserver } from "usehooks-ts";

import { fetchData } from "@/utils/fetchData";

export function Shloka({
  ShlokaMetadata,
  shlokaArr,
  setShlokaArr,
}: {
  ShlokaMetadata: shlokaMetadata;
  shlokaArr: number[];
  setShlokaArr: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [refreshedShloka, setRefreshedShloka] = useState<Data>({} as Data);
  const ref = useRef<HTMLDivElement | null>(null);
  const ran = useRef(false);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const [retryDone, setRetryDone] = useState(false);
  const retryCount = useRef(0);
  const [wasVisible, setWasVisible] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    if (!wasVisible && isVisible) {
      setWasVisible(true);
    }
  };
  let data = refreshedShloka;
  handleVisibilityChange(isVisible);

  useEffect(() => {
    const fetchDataWithRetry = async () => {
      if (retryCount.current < 2) {
        if (!data.englishText && !data.englishCommentary) {
          if (retryCount.current > 1) {
            //sleep for 500ms
            await new Promise((r) => setTimeout(r, 1000));
          }

          try {
            const res = await fetchData(
              ShlokaMetadata.chapterNumber,
              ShlokaMetadata.shlokaNumber
            );
            let data: Data = {
              englishCommentary: res.englishCommentary,
              englishText: res.englishText,
              hindiText: res.hindiText,
            };
            setRefreshedShloka(data);
          } catch (e) {
            console.log(e);
          } finally {
            retryCount.current++;
            setTimeout(fetchDataWithRetry, 1000); // Retry after a delay of 500ms
          }
        }
      } else {
        setRetryDone(true);
      }
    };

    fetchDataWithRetry();
  }, [
    ShlokaMetadata.chapterNumber,
    ShlokaMetadata.shlokaNumber,
    data.englishCommentary,
    data.englishText,
    refreshedShloka,
    retryCount,
  ]);

  useEffect(() => {
    if (wasVisible && !isVisible && !ran.current) {
      setShlokaArr((prev) => [...prev, prev[prev.length - 1] + 1]);
      ran.current = true;
    }
  }, [isVisible, wasVisible, setShlokaArr]);

  if (ShlokaMetadata.chapterNumber == 0) {
    return;
  }

  if (!refreshedShloka.englishText) {
    return (
      <div className="w-11/12 lg:w-3/4 ">
        <div className="border p-4 pt-7 m-4 border-gray-800 text-white">
          <p>
            Loading...
            {retryDone && (
              <button
                className="ml-4 bg-gray-800 text-white px-2 py-1 rounded"
                onClick={() => {
                  fetchData(
                    ShlokaMetadata.chapterNumber,
                    ShlokaMetadata.shlokaNumber
                  ).then((res) => {
                    let data: Data = {
                      englishCommentary: res.englishCommentary,
                      englishText: res.englishText,
                      hindiText: res.hindiText,
                    };
                    setRefreshedShloka(data);
                  });
                }}
              >
                Reload
              </button>
            )}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} className="w-11/12 lg:w-3/4 ">
      {ShlokaMetadata && (
        <div className="border p-4 pt-7 m-4 border-gray-500 text-white">
          <p>{refreshedShloka.englishText}</p>

          <br />

          <p>{refreshedShloka.englishCommentary}</p>
          <br />
        </div>
      )}
    </div>
  );
}
