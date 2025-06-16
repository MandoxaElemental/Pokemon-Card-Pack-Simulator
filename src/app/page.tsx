import About from "@/components/About";
import { CardPackOpener } from "@/components/CardPicker";

export default function Home() {
  return (
    <div className="min-w-screen min-h-screen main-background">
      <div className="flex justify-center items-center">
      <CardPackOpener/>
      </div>
      <About/>
    </div>
  );
}
