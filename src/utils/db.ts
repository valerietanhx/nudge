import { openDB } from "idb";

export const DB_NAME = "itemDataDB";
export const STORE_NAME = "items";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, {
        keyPath: "timestamp",
      });
    },
  });
}
