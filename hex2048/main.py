import pygame
import math

WIDTH, HEIGHT = 800, 600
BACKGROUND_COLOR = (30, 30, 30)  
WHITE = (255, 255, 255)

pygame.init()

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Hex 2048")
clock = pygame.time.Clock()

font = pygame.font.Font(None, 36)

theme = {"grid": (100, 100, 100), "text": WHITE}  

def hex_to_pixel(hex_pos, hex_size=50):
    """Convert hex coordinate to pixel coordinate."""
    x = hex_size * (3/2) * hex_pos[0]
    y = hex_size * (math.sqrt(3)) * (hex_pos[1] + 0.5 * (hex_pos[0] % 2))
    return (x, y)

class HexGrid:
    def __init__(self, width=10, height=10, hex_size=50):
        self.width = width
        self.height = height
        self.hex_size = hex_size
        self.grid = [[0 for _ in range(height)] for _ in range(width)] 

    def draw(self, screen, hex_to_pixel, hex_size, font, theme):
        """Draw the hexagonal grid on the screen."""
        for x in range(self.width):
            for y in range(self.height):
                center = hex_to_pixel((x, y), hex_size)
                pygame.draw.polygon(screen, theme["grid"], self.hex_corners(center, hex_size), 1)
                self.draw_tile(screen, center, hex_size, font)

    def hex_corners(self, center, size):
        """Calculate the corners of a hexagon given a center and size."""
        corners = []
        angle = math.pi / 3
        for i in range(6):
            x = center[0] + size * math.cos(angle * i)
            y = center[1] + size * math.sin(angle * i)
            corners.append((x, y))
        return corners

    def draw_tile(self, screen, center, size, font):
        """Draw the tile with its value."""
        pygame.draw.circle(screen, (200, 200, 200), center, size) 
        text = font.render(str(0), True, (0, 0, 0)) 
        text_rect = text.get_rect(center=center)
        screen.blit(text, text_rect)

    def move_up(self):
        pass 

    def move_down(self):
        pass  

    def move_left(self):
        pass  

    def move_right(self):
        pass  

# Game loop
def main():
    print("Starting game...")
    grid = HexGrid()
    running = True

    while running:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        keys = pygame.key.get_pressed()

        if keys[pygame.K_w]:  
            grid.move_up()
        if keys[pygame.K_s]: 
            grid.move_down()
        if keys[pygame.K_a]:  
            grid.move_left()
        if keys[pygame.K_d]:  
            grid.move_right()

        screen.fill(BACKGROUND_COLOR)

        # Draw the grid
        grid.draw(screen, hex_to_pixel, 50, font, theme)  

        pygame.display.flip()

        clock.tick(30)

    pygame.quit()

if __name__ == "__main__":
    main()
