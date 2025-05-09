import { motion } from "framer-motion";

export function Board({ level, playerPos, boxPositions }) {
  const width = level.map[0].length;

  return (
    <div className="grid gap-1 p-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg" style={{ gridTemplateColumns: `repeat(${width}, 40px)` }}>
      {level.map.flatMap((row, y) =>
        row.split("").map((cell, x) => {
          let content = "";
          const isPlayer = playerPos.x === x && playerPos.y === y;
          const isBox = boxPositions.some(b => b.x === x && b.y === y);

          if (isPlayer) content = "🙂";
          else if (isBox) content = "📦";
          else if (cell === "#") content = "🟫";
          else if (cell === ".") content = "⚪";
          else if (cell === "G") content = "🎯";

          return (
            <motion.div
              key={`${x}-${y}`}
              className="w-10 h-10 flex items-center justify-center text-xl rounded-md border border-white/20 shadow-inner"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (x + y * width) * 0.02 }}
            >
              {content}
            </motion.div>
          );
        })
      )}
    </div>
  );
}
