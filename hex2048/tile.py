import math

class Tile:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def hex_corners(self, center, size):
        """Calculate the corners of a hexagon given a center and size."""
        corners = []
        angle = math.pi / 3
        for i in range(6):
            x = center[0] + size * math.cos(angle * i)
            y = center[1] + size * math.sin(angle * i)
            corners.append((x, y))
        return corners
