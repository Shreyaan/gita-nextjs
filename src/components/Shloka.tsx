import React, { useEffect, useState, useRef } from "react";
import { Data, shlokaMetadata } from "..";
import { useEffectOnce } from "usehooks-ts";

import { fetchData } from "@/utils/fetchData";
import { Loading } from "./Loading";
import { ShlokaText } from "./ShlokaText";

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

  const [retryDone, setRetryDone] = useState(false);
  const retryCount = useRef(0);

  let data = refreshedShloka;

  useEffectOnce(() => {
    const fetchDataWithRetry = async () => {
      if (retryCount.current < 10) {
        if (retryCount.current > 1) {
          await new Promise((r) => setTimeout(r, 500));
        }
        if (!data.englishText && !data.englishCommentary) {
          try {
            const res: Data | {} = await fetchData(
              ShlokaMetadata.chapterNumber,
              ShlokaMetadata.shlokaNumber
            );

            if ("englishCommentary" in res) {
              let data: Data = {
                englishCommentary: res.englishCommentary,
                englishText: res.englishText,
                hindiText: res.hindiText,
              };
              setRefreshedShloka(data);
            } else {
              throw new Error("Error in fetching data");
            }
          } catch (e) {
            retryCount.current++;
            setTimeout(fetchDataWithRetry, 1000); // Retry after a delay of 1s
          } finally {
            setRetryDone(true);
          }
        }
      } else {
        setRetryDone(true);
      }
    };

    fetchDataWithRetry();
  });

  if (ShlokaMetadata.chapterNumber == 0) {
    return;
  }

  if (!refreshedShloka.englishText) {
    return (
      <Loading
        ShlokaMetadata={ShlokaMetadata}
        setRefreshedShloka={setRefreshedShloka}
        retryDone={retryDone}
      ></Loading>
    );
  }
  return (
    <ShlokaText
      ShlokaMetadata={ShlokaMetadata}
      refreshedShloka={refreshedShloka}
      setShlokaArr={setShlokaArr}
    ></ShlokaText>
  );
}
