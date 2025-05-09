export function LevelSelector({ levels, onSelect }) {
    return (
      <div className="mb-4">
        <label className="mr-2">Choose level:</label>
        <select className="p-2 rounded-lg text-black" onChange={(e) => onSelect(levels[e.target.value])}>
          {levels.map((level, idx) => (
            <option key={idx} value={idx}>Level {idx + 1}</option>
          ))}
        </select>
      </div>
    );
  }
  