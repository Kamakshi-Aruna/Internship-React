import { ConfigProvider } from "antd";
import SearchPage from "./SearchPage";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6C3CE1",
          borderRadius: 6,
        },
      }}
    >
      <SearchPage />
    </ConfigProvider>
  );
}

export default App;
