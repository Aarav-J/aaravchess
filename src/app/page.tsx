import Image from "next/image";
import ChessComponent from "./Components/ChessComponent";
import SettingsButton from "./Components/SettingsButton";
import { Toaster } from "react-hot-toast";
export default function Home() {
  return (
    <div className="p-6 h-screen">
      <ChessComponent />
      <Toaster/>
    </div>
  );
}
