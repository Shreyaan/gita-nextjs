import React, { use, useEffect } from "react";
import axios from "axios";
import { Shloka } from "../components/Shloka";
import { Data } from "..";
import { fetchData } from "@/utils/fetchData";
import { useEffectOnce } from "usehooks-ts";
import { getCorrectShlokaNumber } from "../utils/getCorrectShlokaNumber";

const IndexPage = () => {
  const [shlokasArr, setShlokasArr] = React.useState([1, 2, 3, 4, 5, 6]);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl mb-16">Gita SuperSite Revamped</h1>
      {shlokasArr.map((item, index: React.Key | null | undefined) => (
        <Shloka
          key={index}
          ShlokaMetadata={{
            chapterNumber: getCorrectShlokaNumber(item)[0],
            shlokaNumber: getCorrectShlokaNumber(item)[1],
          }}
          shlokaArr={shlokasArr}
          setShlokaArr={setShlokasArr}
        />
      ))}
    </div>
  );
};

export default IndexPage;
