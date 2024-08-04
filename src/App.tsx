import "./App.css";
import { useState } from "react";
import ItemCard from "./components/ItemCard/ItemCard";
import InputCard from "./components/InputCard/InputCard";
import { SubmittedItemData } from "./globals/types";
import { STORE_NAME, initDB } from "./utils/db";

const limit = 30; // TODO: use context instead?
const millisecondsPerDay = 1000 * 60 * 60 * 24;
const limitTimestamp = Date.now() - limit * millisecondsPerDay;

async function fetchItems() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const items = await store.getAll();

  const itemsToKeep = items.filter((item) => item.timestamp > limitTimestamp);

  const itemsToDelete = items.filter(
    (item) => item.timestamp <= limitTimestamp
  );
  for (const item of itemsToDelete) {
    store.delete(item.timestamp);
  }

  return itemsToKeep;
}

function App() {
  const [items, setItems] = useState<SubmittedItemData[]>([]);

  const getItems = async () => {
    const itemsFromDB = await fetchItems();
    setItems(itemsFromDB);
  };

  getItems();

  return (
    <main>
      <InputCard onDBChange={getItems} />
      {items.map((item, index) => (
        <ItemCard key={index} submittedItemData={item} onDBChange={getItems} />
      ))}
    </main>
  );
}

export default App;
