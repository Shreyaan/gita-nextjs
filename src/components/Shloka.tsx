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
  const [refreshedShloka, setRefreshedShloka] = useState<Data>({} as Data);
  const ref = useRef<HTMLDivElement | null>(null);
  const ran = useRef(false);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const [retryDone, setRetryDone] = useState(false);

  const [wasVisible, setWasVisible] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    if (!wasVisible && isVisible) {
      setWasVisible(true);
    }
  };
  let data = refreshedShloka;
  handleVisibilityChange(isVisible);

  useEffect(() => {
    let retryCount = 0;

    const fetchDataWithRetry = async () => {
      if (retryCount < 2) {
        if (!data.englishText && !data.englishCommentary) {
          if (retryCount > 1) {
            //sleep for 500ms
            await new Promise((r) => setTimeout(r, 1000));
          }

          try {
            console.log(
              "Fetching data" +
                Shlokadata.chapterNumber +
                " " +
                Shlokadata.shlokaNumber +
                " " +
                retryCount +
                " " +
                refreshedShloka.englishText +
                " " +
                refreshedShloka.englishCommentary
            );

            const res = await fetchData(
              Shlokadata.chapterNumber,
              Shlokadata.shlokaNumber
            );
            let data: Data = {
              chapterNumber: Shlokadata.chapterNumber,
              shlokaNumber: Shlokadata.shlokaNumber,
              englishCommentary: res.englishCommentary,
              englishText: res.englishText,
              hindiText: res.hindiText,
            };
            setRefreshedShloka(data);
          } catch (e) {
            console.log(e);
          } finally {
            retryCount++;
            setTimeout(fetchDataWithRetry, 1000); // Retry after a delay of 500ms
          }
        }
      } else {
        console.log("Failed to fetch data");
        setRetryDone(true);
      }
    };

    fetchDataWithRetry();
  }, [
    Shlokadata.chapterNumber,
    Shlokadata.englishCommentary,
    Shlokadata.shlokaNumber,
    data.englishCommentary,
    data.englishText,
    refreshedShloka,
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
        setData((prev: any) => {
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
                    Shlokadata.chapterNumber,
                    Shlokadata.shlokaNumber
                  ).then((res) => {
                    let data: Data = {
                      chapterNumber: Shlokadata.chapterNumber,
                      shlokaNumber: Shlokadata.shlokaNumber,
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
      {Shlokadata && (
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
