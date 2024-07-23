import "./App.css";
import ItemCard from "./components/ItemCard/ItemCard";
import InputCard from "./components/InputCard/InputCard";

function App() {
  return (
    <main>
      <InputCard />
      <ItemCard date={new Date("2024-07-15")}>
        <p>This is an item!</p>
      </ItemCard>
      <ItemCard date={new Date("2024-07-28")}>
        <p>Here's another one!</p>
      </ItemCard>
      <ItemCard date={new Date("2024-07-01")}>
        <p>I love notes!</p>
      </ItemCard>
      <ItemCard date={new Date("2024-06-30")}>
        <p>Yeah, I really do!</p>
      </ItemCard>
    </main>
  );
}

export default App;
