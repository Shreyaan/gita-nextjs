import React, { useEffect, useState, useRef } from "react";
import { Data } from "..";
import { useEffectOnce, useIntersectionObserver } from "usehooks-ts";

import { fetchData } from "@/utils/fetchData";

export function Shloka({
  Shlokadata,
  dataArr,
  setData,
}: {
  Shlokadata: Data;
  dataArr: Data[];
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
}) {
  const refreshedShloka = useRef({} as Data)
  const ref = useRef<HTMLDivElement | null>(null);
  const ran = useRef(false);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const [wasVisible, setWasVisible] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    if (!wasVisible && isVisible) {
      setWasVisible(true);
      console.log(
        "visible" +
          "  " +
          Shlokadata.chapterNumber +
          "  " +
          Shlokadata.shlokaNumber
      );
    }
  };

  handleVisibilityChange(isVisible);

  useEffect(() => {
    let retryCount = 0;

    const fetchDataWithRetry = async () => {
      if (retryCount < 5) {
        if (!Shlokadata.englishCommentary && !refreshedShloka.current.englishText) {
          if (retryCount > 1) {
            //sleep for 500ms
            await new Promise((r) => setTimeout(r, 500));
          }
          try {
            const res = await fetchData(
              Shlokadata.chapterNumber,
              Shlokadata.shlokaNumber
            );
            refreshedShloka.current = res;
            console.log(res);
          } catch (e) {
            console.log(e);
          } finally {
            retryCount++;
            setTimeout(fetchDataWithRetry, 500); // Retry after a delay of 500ms
          }
        }
      }
    };

    fetchDataWithRetry();
  }, [
    Shlokadata.chapterNumber,
    Shlokadata.englishCommentary,
    Shlokadata.shlokaNumber,
    refreshedShloka.current.englishText,
  ]);

  useEffect(() => {
    if (wasVisible && !isVisible && !ran.current) {
      let nextChapter = Shlokadata.chapterNumber;
      let nextIndex = Shlokadata.shlokaNumber + 6;

      if (nextIndex > 30) {
        nextChapter = Shlokadata.chapterNumber + 1;
        nextIndex = 0;
      }

      if (nextChapter <= 18) {
        let data: Data = {
          chapterNumber: nextChapter,
          shlokaNumber: nextIndex,
        } as Data;
        setData((prev) => {
          return [...prev, data];
        });
      }

      ran.current = true;
    }
  }, [
    isVisible,
    wasVisible,
    Shlokadata.chapterNumber,
    Shlokadata.shlokaNumber,
    dataArr,
    setData,
  ]);

  if (!Shlokadata.englishCommentary && !refreshedShloka.current.englishText) {
    return (
      <div className="w-11/12 lg:w-3/4 ">
        <div className="border p-4 pt-7 m-4 border-gray-500">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} className="w-11/12 lg:w-3/4 ">
      {Shlokadata && (
        <div className="border p-4 pt-7 m-4 border-gray-500">
          <p>{Shlokadata.englishText || refreshedShloka.current.englishText}</p>

          <br />

          <p>
            {Shlokadata.englishCommentary || refreshedShloka.current.englishCommentary}
          </p>
          <br />
        </div>
      )}
    </div>
  );
}
