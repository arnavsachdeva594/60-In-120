
class Sokoban:
    """
    Handles Sokoban level parsing and state management.
    """
    WALLS = '#'
    PLAYER = '@'
    BOX = '$'
    GOAL = '.'
    BOX_ON_GOAL = '*'
    PLAYER_ON_GOAL = '+'
    FLOOR = ' '

    def __init__(self, level_string):
        self.grid = []
        self.boxes = set()
        self.goals = set()
        self.player = None
        self.parse_level(level_string)

    def parse_level(self, level_string):
        lines = [line.rstrip('\n') for line in level_string.strip().splitlines()]
        self.height = len(lines)
        self.width = max(len(line) for line in lines)
        for y, line in enumerate(lines):
            row = []
            for x, char in enumerate(line.ljust(self.width)):
                if char == self.PLAYER:
                    self.player = (y, x)
                    row.append(self.FLOOR)
                elif char == self.PLAYER_ON_GOAL:
                    self.player = (y, x)
                    self.goals.add((y, x))
                    row.append(self.GOAL)
                elif char == self.BOX:
                    self.boxes.add((y, x))
                    row.append(self.FLOOR)
                elif char == self.BOX_ON_GOAL:
                    self.boxes.add((y, x))
                    self.goals.add((y, x))
                    row.append(self.GOAL)
                elif char == self.GOAL:
                    self.goals.add((y, x))
                    row.append(self.GOAL)
                else:
                    row.append(char)
            self.grid.append(row)

    def render(self, player=None, boxes=None):
        """
        Returns a string representation of the current state.
        """
        display = []
        player = player or self.player
        boxes = boxes or self.boxes
        for y, row in enumerate(self.grid):
            row_str = ""
            for x, cell in enumerate(row):
                pos = (y, x)
                if pos == player:
                    if pos in self.goals:
                        row_str += self.PLAYER_ON_GOAL
                    else:
                        row_str += self.PLAYER
                elif pos in boxes:
                    if pos in self.goals:
                        row_str += self.BOX_ON_GOAL
                    else:
                        row_str += self.BOX
                elif pos in self.goals:
                    row_str += self.GOAL
                else:
                    row_str += cell
            display.append(row_str)
        return "\n".join(display)

    def is_completed(self, boxes):
        return all(box in self.goals for box in boxes)
