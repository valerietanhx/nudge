/// <reference types="chrome-types/index.d.ts"/>

import "./App.css";
import ItemCard from "./components/ItemCard/ItemCard";
import InputCard from "./components/InputCard/InputCard";
import { useState } from "react";

function App() {
  const [items, setItems] = useState<{ [timestamp: string]: any }>();

  // @ts-ignore
  chrome.storage.local.get(null, (items) => {
    setItems(items);
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
            {value.url && <a href={value.url} className="wrap">{value.url}</a>}
            {value.text && <p className="wrap">{value.text}</p>}
          </ItemCard>
        ))}
    </main>
  );
}

export default App;
