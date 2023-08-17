import { MongoClient, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = "gitasupersite"; // Replace with your actual database name
const collectionName = "masterData";

let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(url as string);

  await client.connect();
  cachedDb = client.db(dbName);

  return cachedDb;
}

const getDataHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chapterNumber } = req.query;

  if (!chapterNumber) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const aggregationPipeline = [
      {
        $project: {
          _id: 0,
          chapterData: `$masterData.${parseInt(chapterNumber as string)}`,
        },
      },
    ];

    const result = await collection.aggregate(aggregationPipeline).toArray();

    if (result.length > 0) {
      return res.status(200).json(result[0].chapterData);
    } else {
      return res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getDataHandler;
