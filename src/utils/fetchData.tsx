import axios from "axios";
import { Data } from "..";

export async function fetchData(chapterNumber: string|number, index: string|number): Promise<Data> {
  try {
    const response = await axios.get(
      `/api/getData?chapterNumber=${chapterNumber}&index=${index}`
    );
   return response.data as Data
  } catch (error) {
    // console.error("Error:", error);
    return ({} as Data)
  }
}