interface Data {
  hindiText: string;
  englishText: string;
  englishCommentary: string;
  shlokaNumber: number;
  chapterNumber: number;
}

type MasterData = {
  [chapterNumber: number]: Data[];
};

export { Data, MasterData}