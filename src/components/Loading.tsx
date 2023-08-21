import React from "react";
import { Data } from "..";
import { fetchData } from "@/utils/fetchData";

export function Loading(props: {
  retryDone: any;
  ShlokaMetadata: {
    chapterNumber: string | number;
    shlokaNumber: string | number;
  };
  setRefreshedShloka: (arg0: Data) => void;
}) {
  return (
    <div className="w-11/12 lg:w-3/4 ">
      <div className="border p-4 pt-7 m-4 border-gray-800 text-white">
        <p>
          Loading...
          {props.retryDone && (
            <button
              className="ml-4 bg-gray-800 text-white px-2 py-1 rounded"
              onClick={() => {
                fetchData(
                  props.ShlokaMetadata.chapterNumber,
                  props.ShlokaMetadata.shlokaNumber
                ).then((res) => {
                  let data: Data = {
                    englishCommentary: res.englishCommentary,
                    englishText: res.englishText,
                    hindiText: res.hindiText,
                  };
                  props.setRefreshedShloka(data);
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
