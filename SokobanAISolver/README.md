SokobanAISolver
A Python project that generates random Sokoban puzzles and solves them using an advanced A* search algorithm with optimal heuristics and deadlock detection.

Features
Random Level Generation: Automatically creates random Sokoban puzzles of user-specified size and box count.

Generate-Until-Solvable: Keeps generating levels until a solvable one is found.

Advanced Solver: Uses A* search with the Hungarian algorithm for optimal box-goal assignment and deadlock detection (corner and edge).

Step-by-Step Solution Animation: Shows the solution and animates the moves in the console.

User Input: Choose grid size and number of boxes at runtime.

Requirements
Python 3.7+

NumPy

SciPy

Install dependencies with:

bash
pip install numpy scipy
Usage
Clone or download this repository.

Navigate to the project folder.

Run the main program:

bash
python main.py
Follow the prompts:

Enter grid width (5–10)

Enter grid height (5–10)

Enter number of boxes/goals (auto-limited by grid size)

The program will:

Generate random levels until it finds a solvable one

Display the level and the solution

Animate the solution step by step

Example
text
Sokoban AI Solver (Generate-Until-Solvable)

Enter grid width (min 5, max 10): 7
Enter grid height (min 5, max 10): 7
Enter number of boxes/goals (min 1, max 6): 2
Solvable level found after 3 attempt(s) in 0.14 seconds.

Generated Solvable Level:

#######
#     #
#.$@$.#
#     #
#######

Initial State:
#######
#     #
#.$@$.#
#     #
#######

Solution found in 4 moves:
Right -> Down -> Left -> Up

Animating solution:
...
Notes
For larger grids or more boxes, generation and solving may take longer.

The solver is robust for small to medium puzzles.

If you want to use a different level generator (such as backward generation), simply swap out generate_random_level in random_level.py.
