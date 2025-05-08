import React, { useEffect, useState } from "react";
import countriesData from "./countries.json";

function getCountryGraph() {
  const graph = {};
  countriesData.forEach((c) => {
    graph[c.name.common] = (c.borders || [])
      .map(code =>
        countriesData.find(cc => cc.cca3 === code)?.name.common
      )
      .filter(Boolean);
  });
  return graph;
}

function getRandomPuzzle(graph, seed) {
  // Deterministic shuffle based on date
  const countries = Object.keys(graph);
  let i = seed % countries.length;
  let j = (seed * 13) % countries.length;
  let start = countries[i];
  let end = countries[j];
  // Ensure start and end are not the same and are connected
  while (start === end || !findShortestPath(graph, start, end)) {
    i = (i + 1) % countries.length;
    j = (j + 1) % countries.length;
    start = countries[i];
    end = countries[j];
  }
  return { start, end };
}

function findShortestPath(graph, start, end) {
  if (!graph[start] || !graph[end]) return null;
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const last = path[path.length - 1];
    if (last === end) return path;
    for (const neighbor of graph[last]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

function todaySeed() {
  const now = new Date();
  return parseInt(now.toISOString().slice(0, 10).replace(/-/g, ""));
}

const graph = getCountryGraph();

export default function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [guess, setGuess] = useState("");
  const [path, setPath] = useState([]);
  const [history, setHistory] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const seed = todaySeed();
    setPuzzle(getRandomPuzzle(graph, seed));
    setHistory([]);
    setPath([]);
    setSolved(false);
  }, []);

  if (!puzzle) return <div className="text-center mt-20">Loading...</div>;

  const handleGuess = (e) => {
    e.preventDefault();
    if (!graph[guess] || history.includes(guess)) return;
    setHistory([...history, guess]);
    setPath([...path, guess]);
    if (guess === puzzle.end) setSolved(true);
    setGuess("");
  };

  const handleRestart = () => {
    const seed = todaySeed();
    setPuzzle(getRandomPuzzle(graph, seed));
    setHistory([]);
    setPath([]);
    setSolved(false);
    setGuess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-emerald-100 flex flex-col items-center">
      <header className="w-full py-8 bg-blue-900 text-white text-center shadow">
        <h1 className="text-3xl font-bold tracking-tight">Travle Earth Clone</h1>
        <p className="text-lg mt-2">Find the shortest path from <span className="font-semibold">{puzzle.start}</span> to <span className="font-semibold">{puzzle.end}</span> by land!</p>
      </header>
      <main className="w-full max-w-xl bg-white rounded-xl shadow-lg mt-10 p-8">
        {solved ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Congratulations! 🎉</h2>
            <p className="mb-2">You found a path:</p>
            <p className="font-mono bg-gray-100 rounded p-2 mb-4">
              { [puzzle.start, ...path].join(" → ") }
            </p>
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={handleRestart}
            >
              Play Today's Puzzle Again
            </button>
          </div>
        ) : (
          <>
            <form className="flex gap-2 mb-4" onSubmit={handleGuess}>
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="Next country..."
                list="countries"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                disabled={solved}
                autoFocus
              />
              <datalist id="countries">
                {Object.keys(graph).map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                type="submit"
                disabled={solved}
              >
                Guess
              </button>
            </form>
            <div className="mb-4">
              <span className="font-bold">Path so far:</span>
              <span className="ml-2 text-blue-700 font-mono">
                { [puzzle.start, ...path].join(" → ") }
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Guesses:</span>
              <ul className="list-disc ml-6">
                {history.map((g, i) => (
                  <li key={i} className={g === puzzle.end ? "text-green-700 font-bold" : ""}>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
      <footer className="mt-10 text-gray-500 text-sm text-center">
        Country data from <a href="https://github.com/mledoze/countries" className="underline">mledoze/countries</a>.
      </footer>
    </div>
  );
}
