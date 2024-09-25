import { useState } from "react";
import { Navbar } from "./components/navbar"
import { Send } from "./pages/send";
import { Rollno } from "./pages/rollno";
import { Result } from "./pages/result";

function App() {

  const [page, setPage] = useState("home");

  const renderContent = () => {
    switch (page) {
      case "list":
        return <Send />;
      case "roll":
        return <Rollno />;
      case "results":
        return <Result />;
      default:
        return <div className=" text-3xl"><div>Welcome to the Home Page</div></div>;
    }
  };

  return (<>
    <div className="m-2 p-2 flex flex-col items-center h-screen">
      <div className="m-2 w-full flex items-center justify-center">
        <Navbar setPage={setPage} />
      </div>
      <div className="w-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  </>)
}

export default App
