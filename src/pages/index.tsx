import { useState } from 'react';
import axios from 'axios';

const IndexPage = () => {
  const [chapterNumber, setChapterNumber] = useState('');
  const [index, setIndex] = useState('');
  const [data, setData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/getData?chapterNumber=${chapterNumber}&index=${index}`);
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
      setData(null);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`h-screen flex justify-center items-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="w-96 p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Data Query Page</h1>
        <div className="mb-4">
          <label htmlFor="chapterNumber" className="block mb-2">Chapter Number:</label>
          <input
            type="number"
            id="chapterNumber"
            className="w-full border rounded px-2 py-1"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="index" className="block mb-2">Index:</label>
          <input
            type="number"
            id="index"
            className="w-full border rounded px-2 py-1"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
          />
        </div>
        <button
          className={`w-full py-2 rounded-lg bg-blue-500 text-white font-semibold ${isDarkMode ? 'bg-blue-600' : 'hover:bg-blue-600'}`}
          onClick={fetchData}
        >
          Fetch Data
        </button>
        {data && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Fetched Data:</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        <div className="mt-4 text-right">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-2">Dark Mode:</span>
            <input type="checkbox" className="form-checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
