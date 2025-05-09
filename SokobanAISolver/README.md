A Python project that generates random Sokoban puzzles and solves them using an advanced A search algorithm* with optimal heuristics and deadlock detection.

✨ Features
✅ Random Level Generation
Automatically creates random Sokoban puzzles with customizable grid size and number of boxes.

✅ Generate-Until-Solvable
Keeps generating random levels until it finds a solvable one.

✅ Advanced Solver
Uses A* search with:

Hungarian Algorithm for optimal box-goal assignment

Deadlock detection (corner and edge deadlocks)

✅ Step-by-Step Solution Animation
Visualizes the solution step-by-step directly in the console.

✅ User Input
Choose grid size and number of boxes at runtime.

📝 Requirements
Python 3.7+

NumPy

SciPy

The program will:

✅ Generate random levels until it finds a solvable puzzle
✅ Display the generated level
✅ Solve the puzzle and show the solution
✅ Animate the solution step-by-step in the console

⚠️ Notes
For larger grids or more boxes, generation and solving may take longer.

The solver is optimized for small to medium puzzles.

Want to use a different level generator (e.g., backward generation)?
→ Simply replace the generate_random_level function in random_level.py with your own.

