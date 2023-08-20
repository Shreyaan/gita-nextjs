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
  dataArr: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;
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
            retryCount.current++;
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
    retryCount,
  ]);

  useEffect(() => {
    if (wasVisible && !isVisible && !ran.current) {
      setData((prev) => [...prev, prev[prev.length - 1] + 1]);
    }
  }, [isVisible, wasVisible, setData]);

  if (data.chapterNumber == 0) {
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
