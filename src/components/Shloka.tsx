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
