import Image from "next/image";
import SideBar from "./components/sideBar";

export default function Home() {
  return (
    <div className=" h-screen w-screen flex">
      <div className="w-1/4 bg-slate-800">
        <SideBar/>
      </div>
      <div className="w-3/4 bg-slate-700">

      </div>
    </div>
  );
}
