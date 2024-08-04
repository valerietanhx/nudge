export interface ItemData {
  file?: File;
  url: string;
  text: string;
  isCompleted: boolean;
}

export interface SubmittedItemData {
  timestamp: number;
  itemData: ItemData;
}
