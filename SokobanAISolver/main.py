# main.py

import time
from sokoban import Sokoban
from solver import SokobanSolver
from random_level import generate_random_level

def get_int(prompt, min_value, max_value):
    while True:
        try:
            value = int(input(prompt))
            if value < min_value or value > max_value:
                print(f"Please enter a value between {min_value} and {max_value}.")
                continue
            return value
        except ValueError:
            print("Please enter a valid integer.")

def generate_until_solvable(width, height, num_boxes, max_attempts=1000, seed=None):
    attempts = 0
    start_time = time.time()
    while attempts < max_attempts:
        level_str = generate_random_level(width=width, height=height, num_boxes=num_boxes, seed=seed)
        game = Sokoban(level_str)
        solver = SokobanSolver(game)
        solution = solver.solve()
        if solution:
            print(f"Solvable level found after {attempts+1} attempt(s) in {time.time()-start_time:.2f} seconds.")
            return level_str, solution
        attempts += 1
        if attempts % 10 == 0:
            print(f"Attempts: {attempts}... still searching.")
    raise RuntimeError("Failed to generate a solvable level after many attempts.")

def main():
    print("Sokoban AI Solver (Generate-Until-Solvable)\n")
    width = get_int("Enter grid width (min 5, max 10): ", 5, 10)
    height = get_int("Enter grid height (min 5, max 10): ", 5, 10)
    max_boxes = min((width-2)*(height-2)//4, 10)
    num_boxes = get_int(f"Enter number of boxes/goals (min 1, max {max_boxes}): ", 1, max_boxes)

    level_str, solution = generate_until_solvable(width, height, num_boxes)
    print("\nGenerated Solvable Level:\n")
    print(level_str)
    game = Sokoban(level_str)
    print("\nInitial State:")
    print(game.render())
    print("\nSolution found in {} moves:".format(len(solution)))
    print(" -> ".join(solution))
    # Animate the solution
    print("\nAnimating solution:")
    player = game.player
    boxes = set(game.boxes)
    print(game.render(player, boxes))
    for move in solution:
        idx = ['Up', 'Down', 'Left', 'Right'].index(move)
        dy, dx = [(-1,0),(1,0),(0,-1),(0,1)][idx]
        ny, nx = player[0]+dy, player[1]+dx
        dest = (ny, nx)
        if dest in boxes:
            # Push box
            by, bx = ny+dy, nx+dx
            boxes.remove(dest)
            boxes.add((by, bx))
        player = dest
        print("\nMove:", move)
        print(game.render(player, boxes))

if __name__ == "__main__":
    main()
