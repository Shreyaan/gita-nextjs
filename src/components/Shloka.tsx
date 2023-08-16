import React, { useEffect, useState } from "react";
import { Data } from "..";
import { fetchData } from "@/utils/fetchData";

export function Shloka({
  Shlokadata,
  dataArr,
}: {
  Shlokadata: Data;
  dataArr: Data[];
}) {
  const [refreshedShloka, setRefreshedShloka] = useState({} as Data);
  console.log(Shlokadata);

  useEffect(() => {
    let retryCount = 0;

    const fetchDataWithRetry = () => {
      if (retryCount < 10) {
        if (!Shlokadata.englishCommentary && !refreshedShloka.englishText) {
          fetchData(Shlokadata.chapterNumber, Shlokadata.shlokaNumber)
            .then((res) => {
              setRefreshedShloka(res);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              retryCount++;
              setTimeout(fetchDataWithRetry, 500); // Retry after a delay of 500ms
            });
        }
      }
    };

    fetchDataWithRetry();
  }, [
    Shlokadata.chapterNumber,
    Shlokadata.englishCommentary,
    Shlokadata.shlokaNumber,
    refreshedShloka.englishText,
  ]);

  if (!Shlokadata.englishCommentary && !refreshedShloka.englishText) {
    return  (<div className="w-11/12 lg:w-3/4 ">
       <div className="border p-4 pt-7 m-4 border-gray-500">
      <p>Loading...</p>
       </div>
    </div>)
  }
  return (
    <div className="w-11/12 lg:w-3/4 ">
      {Shlokadata && (
        <div className="border p-4 pt-7 m-4 border-gray-500">
          <p>{Shlokadata.englishText || refreshedShloka.englishText}</p>

          <br />

          <p>
            {Shlokadata.englishCommentary || refreshedShloka.englishCommentary}
          </p>
          <br />
        </div>
      )}
    </div>
  );
}
