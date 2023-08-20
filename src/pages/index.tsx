import React, { use, useEffect } from "react";
import axios from "axios";
import { Shloka } from "../components/Shloka";
import { Data } from "..";
import { fetchData } from "@/utils/fetchData";
import { useEffectOnce } from "usehooks-ts";

function getCorrectShlokaNumber(currentShlokaNum: number): [number, number] {
  const ranges = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
  ];
  let offset = 0;

  for (let i = 0; i < ranges.length; i++) {
    if (currentShlokaNum <= offset + ranges[i]) {
      return [i + 1, currentShlokaNum - offset - 1];
    }
    offset += ranges[i];
  }

  return [0, 0];
}

const IndexPage = () => {
  const [data, setData] = React.useState([1, 2, 3, 4, 5, 6]);
  const [globalShlokaNumber, setGlobalShlokaNumber] = React.useState(0);

  // useEffectOnce(() => {

  //     setGlobalShlokaNumber(5);

  // });

  // console.log(globalShlokaNumber + " globalShlokaNumber");
  // let array: Data[] = [];

  // for (let i = 0; i <= globalShlokaNumber; i++) {
  //   const data: Data = {
  //     chapterNumber: getCorrectShlokaNumber(i)[0],
  //     shlokaNumber: getCorrectShlokaNumber(i)[1],
  //   };
  //   array.push(data);
  // }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl mb-16">Gita SuperSite Revamped</h1>
      {data.map((item, index: React.Key | null | undefined) => (
        <Shloka
          key={index}
          Shlokadata={{
            chapterNumber: getCorrectShlokaNumber(item)[0],
            shlokaNumber: getCorrectShlokaNumber(item)[1],
          }}
          dataArr={data}
          setData={setData}
        />
      ))}
    </div>
  );
};

export default IndexPage;
