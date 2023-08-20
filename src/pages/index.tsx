import React, { use, useEffect } from "react";
import axios from "axios";
import { Shloka } from "../components/Shloka";
import { Data } from "..";
import { fetchData } from "@/utils/fetchData";
import { useEffectOnce } from "usehooks-ts";

function getCorrectShlokaNumber(currentShlokaNum: number): [number, number] {
  const ranges = [
    46, 71, 42, 41, 28, 46, 29, 27, 33, 41, 54, 19, 34, 26, 19, 23, 27, 77,
  ];
  let offset = 0;

  for (let i = 0; i < ranges.length; i++) {
    if (currentShlokaNum <= offset + ranges[i]) {
      return [i + 1, currentShlokaNum - offset];
    }
    offset += ranges[i];
  }

  return [1, 1];
}

const IndexPage = () => {
  const [data, setData] = React.useState<any>([]);
  const [globalShlokaNumber, setGlobalShlokaNumber] = React.useState(0);

  useEffectOnce(() => {
    let firstfive = [] as Data[];
    firstFiveLoop().then(() => {
      setData(firstfive);
    });

    async function firstFiveLoop() {
      for (let i = 1; i <= 1; i++) {
        for (let j = 0; j <= 5; j++) {
          const data: Data = {
            chapterNumber: getCorrectShlokaNumber(j)[0],
            shlokaNumber: getCorrectShlokaNumber(j)[1],
          };
          firstfive.push(data);
          await setGlobalShlokaNumber(globalShlokaNumber + 1);
          console.log(globalShlokaNumber);
        }
      }
    }
  });

  // useEffect(() => {
  //   const dataobj: Data = {
  //     chapterNumber: getCorrectShlokaNumber(globalShlokaNumber)[0],
  //     shlokaNumber: getCorrectShlokaNumber(globalShlokaNumber)[1],
  //   };
  //   setData([...data, data]);
  // }, [data, globalShlokaNumber]);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl mb-16">Gita SuperSite Revamped</h1>
      {data.map((item: Data, index: React.Key | null | undefined) => (
        <Shloka
          key={index}
          Shlokadata={item}
          dataArr={data}
          setData={setData}
        />
      ))}
    </div>
  );
};

export default IndexPage;
