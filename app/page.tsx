import './globals.css';
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to My App</h1>
      <div className="justify-center flex items-center"><Button>Click me</Button></div>
    </main>
  );
}
