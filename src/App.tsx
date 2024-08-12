import "./App.css";
import { useState, useEffect } from "react";
import ItemCard from "./components/ItemCard/ItemCard";
import InputCard from "./components/InputCard/InputCard";
import { SubmittedItemData } from "./globals/types";
import { STORE_NAME, initDB } from "./utils/db";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { LIMIT, MILLISECONDS_PER_DAY } from "./globals/constants";

const limitTimestamp = Date.now() - LIMIT * MILLISECONDS_PER_DAY;

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

  useEffect(() => {
    getItems();
  }, []);

  return (
    <main>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 0: 1, 675: 2, 850: 3, 1200: 4 }}
      >
        <Masonry gutter="32px">
          <InputCard onDBChange={getItems} />
          {items.map((item, index) => (
            <ItemCard
              key={index}
              submittedItemData={item}
              onDBChange={getItems}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </main>
  );
}

export default App;
