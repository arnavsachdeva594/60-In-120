# solver.py

import heapq
import numpy as np
from scipy.optimize import linear_sum_assignment

DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]
DIR_NAMES = ['Up', 'Down', 'Left', 'Right']

class SokobanSolver:
    """
    Improved A* Sokoban solver with optimal assignment heuristic,
    corner and edge deadlock detection, and canonical state representation.
    """
    def __init__(self, game):
        self.game = game
        self.walls = set(
            (y, x)
            for y, row in enumerate(game.grid)
            for x, cell in enumerate(row)
            if cell == game.WALLS
        )
        self.goals = game.goals

    def heuristic(self, boxes):
        boxes = list(boxes)
        goals = list(self.goals)
        cost_matrix = np.zeros((len(boxes), len(goals)), dtype=int)
        for i, (by, bx) in enumerate(boxes):
            for j, (gy, gx) in enumerate(goals):
                cost_matrix[i, j] = abs(bx - gx) + abs(by - gy)
        row_ind, col_ind = linear_sum_assignment(cost_matrix)
        return cost_matrix[row_ind, col_ind].sum()

    def is_corner_deadlock(self, pos):
        y, x = pos
        if pos in self.goals:
            return False
        if ((y-1, x) in self.walls or (y+1, x) in self.walls) and \
           ((y, x-1) in self.walls or (y, x+1) in self.walls):
            return True
        return False

    def is_edge_deadlock(self, pos):
        y, x = pos
        if pos in self.goals:
            return False
        # Horizontal edge
        if ((y-1, x) in self.walls or (y+1, x) in self.walls):
            if all((y, gx) not in self.goals for gx in range(len(self.game.grid[0]))):
                return True
        # Vertical edge
        if ((y, x-1) in self.walls or (y, x+1) in self.walls):
            if all((gy, x) not in self.goals for gy in range(len(self.game.grid))):
                return True
        return False

    def is_deadlock(self, boxes):
        for box in boxes:
            if self.is_corner_deadlock(box) or self.is_edge_deadlock(box):
                return True
        return False

    def get_neighbors(self, player, boxes):
        neighbors = []
        for i, (dy, dx) in enumerate(DIRECTIONS):
            ny, nx = player[0] + dy, player[1] + dx
            dest = (ny, nx)
            if dest in self.walls:
                continue
            if dest in boxes:
                # Try to push box
                by, bx = ny + dy, nx + dx
                new_box = (by, bx)
                if new_box in self.walls or new_box in boxes:
                    continue
                new_boxes = set(boxes)
                new_boxes.remove(dest)
                new_boxes.add(new_box)
                if self.is_deadlock(new_boxes):
                    continue
                neighbors.append((dest, tuple(sorted(new_boxes)), DIR_NAMES[i]))
            else:
                neighbors.append((dest, tuple(sorted(boxes)), DIR_NAMES[i]))
        return neighbors

    def solve(self):
        initial_state = (self.game.player, tuple(sorted(self.game.boxes)))
        heap = [(self.heuristic(self.game.boxes), 0, initial_state, [])]
        visited = set()
        while heap:
            _, cost, (player, boxes), path = heapq.heappop(heap)
            state_id = (player, boxes)
            if state_id in visited:
                continue
            visited.add(state_id)
            if self.game.is_completed(boxes):
                return path
            for next_player, next_boxes, move_name in self.get_neighbors(player, boxes):
                next_state = (next_player, next_boxes)
                if next_state not in visited:
                    heapq.heappush(
                        heap,
                        (
                            cost + 1 + self.heuristic(next_boxes),
                            cost + 1,
                            next_state,
                            path + [move_name]
                        )
                    )
        return None
