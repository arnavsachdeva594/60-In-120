# random_level.py

import numpy as np

def generate_random_level(width=7, height=7, num_boxes=2, seed=None):
    """
    Generates a random Sokoban level using NumPy's PCG64.
    """
    rng = np.random.Generator(np.random.PCG64(seed))
    grid = [[' ' for _ in range(width)] for _ in range(height)]

    # Add walls around the border
    for x in range(width):
        grid[0][x] = '#'
        grid[height-1][x] = '#'
    for y in range(height):
        grid[y][0] = '#'
        grid[y][width-1] = '#'

    # Place goals
    goals = set()
    while len(goals) < num_boxes:
        y, x = rng.integers(1, height-1), rng.integers(1, width-1)
        if (y, x) not in goals:
            goals.add((y, x))
            grid[y][x] = '.'

    # Place boxes (not on goals)
    boxes = set()
    while len(boxes) < num_boxes:
        y, x = rng.integers(1, height-1), rng.integers(1, width-1)
        if (y, x) not in goals and (y, x) not in boxes:
            boxes.add((y, x))
            grid[y][x] = '$'

    # Place player (not on box or goal)
    while True:
        y, x = rng.integers(1, height-1), rng.integers(1, width-1)
        if (y, x) not in goals and (y, x) not in boxes:
            grid[y][x] = '@'
            break

    # Convert to string
    return '\n'.join(''.join(row) for row in grid)
