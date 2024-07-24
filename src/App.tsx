/// <reference types="chrome-types/index.d.ts"/>

import "./App.css";
import ItemCard from "./components/ItemCard/ItemCard";
import InputCard from "./components/InputCard/InputCard";
import { useState } from "react";

function App() {
  const [items, setItems] = useState<{ [timestamp: string]: any }>();

  const limit = 30; // TODO: use context instead
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const limitTimestamp = Date.now() - limit * millisecondsPerDay;

  // @ts-ignore
  chrome.storage.local.get(null, (items) => {
    const filteredItems = Object.fromEntries(
      Object.entries(items).filter(
        ([timestamp, _]) => parseInt(timestamp) > limitTimestamp
      )
    );
    setItems(filteredItems);

    Object.entries(items).forEach(([timestamp, _]) => {
      if (parseInt(timestamp) <= limitTimestamp) {
        chrome.storage.local.remove(timestamp);
      }
    });
  });

  return (
    <main>
      <InputCard />
      {items &&
        Object.entries(items).map(([timestamp, value]) => (
          <ItemCard timestamp={parseInt(timestamp)}>
            {/*
            TODO:
            - handle file, haven't managed to get it working
            */}
            {value.url && (
              <a href={value.url} className="wrap">
                {value.url}
              </a>
            )}
            {value.text && <p className="wrap">{value.text}</p>}
          </ItemCard>
        ))}
    </main>
  );
}

export default App;
