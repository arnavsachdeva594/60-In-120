import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

export function Controls({ onSolve, onNext, onPrev, onPlayPause, isPlaying }) {
  return (
    <div className="flex space-x-3 mt-6 bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-lg shadow-xl">
      <Button onClick={onSolve} className="bg-green-600 text-white">Solve</Button>
      <Button onClick={onPrev} className="bg-blue-500 text-white">Prev</Button>
      <Button onClick={onNext} className="bg-blue-500 text-white">Next</Button>
      <Button onClick={onPlayPause} className="bg-purple-600 text-white flex items-center">
        {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
}
