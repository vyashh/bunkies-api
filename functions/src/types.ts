export type EntryType = {
  title: string;
  text: string;
};

export type HouseEntryType = {
  title: string;
  text: string;
};

export type Request = {
  body: EntryType;
  params: { entryId: string };
};
