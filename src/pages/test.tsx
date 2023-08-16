import { use, useEffect, useState } from "react";
import axios from "axios";
import { Data, MasterData } from "../index";
import { fetchData } from "../utils/fetchData";

const Test = () => {
  const [chapterNumber, setChapterNumber] = useState("");
  const [index, setIndex] = useState("");
  const [data, setData] = useState({} as Data);
  const [isDarkMode, setIsDarkMode] = useState(false);




  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark"); 
  };

  return (
    <div
      className={`h-screen flex justify-center items-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="w-96 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
          Data Query Page
        </h1>
        <div className="mb-4">
          <label
            htmlFor="chapterNumber"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Chapter Number:
          </label>
          <input
            type="number"
            id="chapterNumber"
            className="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="index"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Index:
          </label>
          <input
            type="number"
            id="index"
            className="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
          />
        </div>
        <button
          className={`w-full py-2 rounded-lg bg-blue-500 text-white font-semibold ${
            isDarkMode ? "bg-blue-600" : "hover:bg-blue-600"
          }`}
          onClick={() =>
            fetchData(chapterNumber, (Number(index) - 1).toString())
          }
        >
          Fetch Data
        </button>
        {data && (
          <div className="mt-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">
              Fetched Data:
            </h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        <div className="mt-4 text-right">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-2 text-gray-700 dark:text-white">
              Dark Mode:
            </span>
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Test;
