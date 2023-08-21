interface Data {
  hindiText?: string;
  englishText?: string;
  englishCommentary?: string;

}

interface shlokaMetadata {
  shlokaNumber: number;
  chapterNumber: number;
}

type MasterData = {
  [chapterNumber: number]: Data[];
};

export { Data, MasterData, type shlokaMetadata };