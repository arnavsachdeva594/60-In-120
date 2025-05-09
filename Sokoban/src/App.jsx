import { useState, useEffect } from "react";
import { LevelSelector } from "./components/LevelSelector";
import { Board } from "./components/Board";
import { Controls } from "./components/Controls";
import levels from "./levels";
import { solveSokoban } from "./solver";
import { motion } from "framer-motion";

function App() {
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSolve = () => {
    const steps = solveSokoban(currentLevel);
    setSolutionSteps(steps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < solutionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, solutionSteps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col items-center p-8 relative overflow-hidden">
      <motion.h1
        className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Sokoban AI Solver
      </motion.h1>

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-indigo-400 opacity-20 blur-3xl top-[-200px] right-[-200px] animate-pulse"
      />

      <LevelSelector levels={levels} onSelect={setCurrentLevel} />

      <Board
        level={currentLevel}
        playerPos={solutionSteps[currentStep]?.player || currentLevel.player}
        boxPositions={solutionSteps[currentStep]?.boxes || currentLevel.boxes}
      />

      <Controls
        onSolve={handleSolve}
        onNext={handleNext}
        onPrev={handlePrev}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        isPlaying={isPlaying}
      />

      {solutionSteps.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-2">
            <div className="h-2 bg-indigo-500 rounded-lg" style={{ width: `${((currentStep + 1) / solutionSteps.length) * 100}%` }}></div>
            <p className="text-center text-sm mt-1">{`Step ${currentStep + 1} / ${solutionSteps.length}`}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
