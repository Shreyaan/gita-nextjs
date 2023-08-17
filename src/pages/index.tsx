import React, { use, useEffect } from "react";
import axios from "axios";
import { Shloka } from "../components/Shloka";
import { Data } from "..";
import { fetchData } from "@/utils/fetchData";
import { useEffectOnce } from 'usehooks-ts'


const IndexPage = () => {
  const [data, setData] = React.useState<Data[]>([]);

  useEffectOnce(() => {
    let firstfive = [] as Data[];
    firstFiveLoop().then(() => {
      setData(firstfive);
    });
    console.log(firstfive);

    async function firstFiveLoop() {
      for (let i = 1; i <= 1; i++) {
        for (let j = 0; j <= 5; j++) {
          await fetchData(i, j).then((res) => {
            const data: Data = {
              chapterNumber: i,
              shlokaNumber: j,
              englishText: res.englishText,
              englishCommentary: res.englishCommentary,
              hindiText: res.hindiText,
            };
            firstfive.push(data);
          });
        }
      }
    }
  });


  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl mb-16">Gita SuperSite Revamped</h1>
      {data.map((item, index) => (
        <Shloka key={ index} Shlokadata={item} dataArr={data} setData={setData} />
      ))}
    </div>
  );
};

export default IndexPage;
