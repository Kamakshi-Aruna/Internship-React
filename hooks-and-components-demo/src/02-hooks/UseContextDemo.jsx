// -------------------------------------------------------
// DEMO: useContext
// Context solves "prop drilling" — passing data through
// many layers of components.
// Pattern:
//   1. createContext()     → creates the context object
//   2. <Context.Provider> → wraps components that need access
//   3. useContext()        → any nested component reads the value
// -------------------------------------------------------
import { createContext, useContext, useState } from "react";

// Step 1: Create the context
const ThemeContext = createContext("light");

// Step 3: A deeply nested component reads context WITHOUT props
function ThemedBox() {
  const theme = useContext(ThemeContext);

  const style = {
    background: theme === "dark" ? "#333" : "#eee",
    color: theme === "dark" ? "#fff" : "#000",
    padding: 16,
    marginTop: 8,
  };

  return <div style={style}>I am a ThemedBox. Current theme: {theme}</div>;
}

// Middle component — does NOT need to know about theme at all
function Layout() {
  return (
    <div>
      <p>Layout component (no theme prop needed here)</p>
      <ThemedBox />
    </div>
  );
}

// Step 2: Provider wraps the tree and supplies the value
function UseContextDemo() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <h2>useContext Demo</h2>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme (current: {theme})
      </button>
      <Layout />
    </ThemeContext.Provider>
  );
}

export default UseContextDemo;