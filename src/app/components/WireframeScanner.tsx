import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

interface ScannerPart {
  points: Point3D[];
  lines: [number, number][];
  offsetX: number;
  isFilmHolder: boolean; // true if it's part of the film holder
}

export function WireframeScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Scanner position - centered
    const scannerX = window.innerWidth * 0.5;
    const scannerY = window.innerHeight * 0.5;
    const scale = 3;

    // Define scanner parts based on Plustek 8300
    const createScannerParts = (): ScannerPart[] => {
      return [
        // Main scanner body - wider, flatter box
        {
          points: [
            { x: -100, y: -40, z: 0 },
            { x: 100, y: -40, z: 0 },
            { x: 100, y: 40, z: 0 },
            { x: -100, y: 40, z: 0 },
            { x: -100, y: -40, z: -60 },
            { x: 100, y: -40, z: -60 },
            { x: 100, y: 40, z: -60 },
            { x: -100, y: 40, z: -60 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // Top lid - angled edges
        {
          points: [
            { x: -95, y: -40, z: -60 },
            { x: 95, y: -40, z: -60 },
            { x: 105, y: -50, z: -70 },
            { x: -105, y: -50, z: -70 },
            { x: -105, y: -50, z: -80 },
            { x: 105, y: -50, z: -80 },
            { x: 95, y: -40, z: -90 },
            { x: -95, y: -40, z: -90 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 7], [1, 6], [2, 5], [3, 4],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // Top surface detail
        {
          points: [
            { x: -90, y: -45, z: -75 },
            { x: 90, y: -45, z: -75 },
            { x: 90, y: -45, z: -85 },
            { x: -90, y: -45, z: -85 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // Front panel
        {
          points: [
            { x: -95, y: -35, z: 5 },
            { x: 95, y: -35, z: 5 },
            { x: 95, y: 35, z: 5 },
            { x: -95, y: 35, z: 5 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // Ventilation grid dots (left side)
        ...Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => ({
            points: Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              return {
                x: -75 + col * 8,
                y: -20 + row * 8,
                z: 6,
              };
            }),
            lines: Array.from({ length: 8 }, (_, i) => [i, (i + 1) % 8] as [number, number]),
            offsetX: 0,
            isFilmHolder: false,
          }))
        ).flat(),
        // Power button (circular)
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: -10 + Math.cos(angle) * 12,
              y: 20 + Math.sin(angle) * 8,
              z: 6,
            };
          }),
          lines: Array.from({ length: 20 }, (_, i) => [i, (i + 1) % 20] as [number, number]),
          offsetX: 0,
          isFilmHolder: false,
        },
        // Power button inner
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: -10 + Math.cos(angle) * 9,
              y: 20 + Math.sin(angle) * 6,
              z: 7,
            };
          }),
          lines: Array.from({ length: 16 }, (_, i) => [i, (i + 1) % 16] as [number, number]),
          offsetX: 0,
          isFilmHolder: false,
        },
        // IntelliScan button
        {
          points: [
            { x: 15, y: -10, z: 6 },
            { x: 35, y: -10, z: 6 },
            { x: 35, y: 2, z: 6 },
            { x: 15, y: 2, z: 6 },
            { x: 16, y: -9, z: 8 },
            { x: 34, y: -9, z: 8 },
            { x: 34, y: 1, z: 8 },
            { x: 16, y: 1, z: 8 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // QuickScan button
        {
          points: [
            { x: 15, y: 5, z: 6 },
            { x: 35, y: 5, z: 6 },
            { x: 35, y: 17, z: 6 },
            { x: 15, y: 17, z: 6 },
            { x: 16, y: 6, z: 8 },
            { x: 34, y: 6, z: 8 },
            { x: 34, y: 16, z: 8 },
            { x: 16, y: 16, z: 8 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // LED indicator
        {
          points: Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return {
              x: 50 + Math.cos(angle) * 3,
              y: -25 + Math.sin(angle) * 3,
              z: 6,
            };
          }),
          lines: Array.from({ length: 12 }, (_, i) => [i, (i + 1) % 12] as [number, number]),
          offsetX: 0,
          isFilmHolder: false,
        },
        // Right side handle
        {
          points: [
            { x: 95, y: -20, z: -15 },
            { x: 105, y: -20, z: -15 },
            { x: 105, y: 20, z: -15 },
            { x: 95, y: 20, z: -15 },
            { x: 95, y: -20, z: -35 },
            { x: 105, y: -20, z: -35 },
            { x: 105, y: 20, z: -35 },
            { x: 95, y: 20, z: -35 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // Handle grip detail
        {
          points: [
            { x: 100, y: -10, z: -20 },
            { x: 103, y: -10, z: -20 },
            { x: 103, y: 10, z: -20 },
            { x: 100, y: 10, z: -20 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },
        // Left side handle
        {
          points: [
            { x: -105, y: -20, z: -15 },
            { x: -95, y: -20, z: -15 },
            { x: -95, y: 20, z: -15 },
            { x: -105, y: 20, z: -15 },
            { x: -105, y: -20, z: -35 },
            { x: -95, y: -20, z: -35 },
            { x: -95, y: 20, z: -35 },
            { x: -105, y: 20, z: -35 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: false,
        },

        // === FILM HOLDER PARTS (will separate) ===
        
        // Film holder - main rail (horizontal bar)
        {
          points: [
            { x: -150, y: -8, z: -25 },
            { x: 150, y: -8, z: -25 },
            { x: 150, y: 8, z: -25 },
            { x: -150, y: 8, z: -25 },
            { x: -150, y: -8, z: -32 },
            { x: 150, y: -8, z: -32 },
            { x: 150, y: 8, z: -32 },
            { x: -150, y: 8, z: -32 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film holder - top rail
        {
          points: [
            { x: -148, y: -8, z: -32 },
            { x: 148, y: -8, z: -32 },
            { x: 148, y: -6, z: -32 },
            { x: -148, y: -6, z: -32 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film holder - bottom rail
        {
          points: [
            { x: -148, y: 6, z: -32 },
            { x: 148, y: 6, z: -32 },
            { x: 148, y: 8, z: -32 },
            { x: -148, y: 8, z: -32 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film holder - left end piece
        {
          points: [
            { x: -155, y: -12, z: -25 },
            { x: -145, y: -12, z: -25 },
            { x: -145, y: 12, z: -25 },
            { x: -155, y: 12, z: -25 },
            { x: -155, y: -12, z: -32 },
            { x: -145, y: -12, z: -32 },
            { x: -145, y: 12, z: -32 },
            { x: -155, y: 12, z: -32 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film holder - right end piece
        {
          points: [
            { x: 145, y: -12, z: -25 },
            { x: 155, y: -12, z: -25 },
            { x: 155, y: 12, z: -25 },
            { x: 145, y: 12, z: -25 },
            { x: 145, y: -12, z: -32 },
            { x: 155, y: -12, z: -32 },
            { x: 155, y: 12, z: -32 },
            { x: 145, y: 12, z: -32 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film frame window (left)
        {
          points: [
            { x: -140, y: -5, z: -27 },
            { x: -120, y: -5, z: -27 },
            { x: -120, y: 5, z: -27 },
            { x: -140, y: 5, z: -27 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film frame window (center)
        {
          points: [
            { x: -15, y: -5, z: -27 },
            { x: 15, y: -5, z: -27 },
            { x: 15, y: 5, z: -27 },
            { x: -15, y: 5, z: -27 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film frame window (right)
        {
          points: [
            { x: 120, y: -5, z: -27 },
            { x: 140, y: -5, z: -27 },
            { x: 140, y: 5, z: -27 },
            { x: 120, y: 5, z: -27 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film holder grip detail (left)
        {
          points: [
            { x: -152, y: -10, z: -28 },
            { x: -148, y: -10, z: -28 },
            { x: -148, y: 10, z: -28 },
            { x: -152, y: 10, z: -28 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
        // Film holder grip detail (right)
        {
          points: [
            { x: 148, y: -10, z: -28 },
            { x: 152, y: -10, z: -28 },
            { x: 152, y: 10, z: -28 },
            { x: 148, y: 10, z: -28 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          isFilmHolder: true,
        },
      ];
    };

    const scannerParts = createScannerParts();

    // Project 3D point to 2D with rotation
    const project = (point: Point3D, rotationY: number, offsetX: number): Point2D => {
      const cos = Math.cos(rotationY);
      const sin = Math.sin(rotationY);

      // Rotate around Y-axis
      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      const y = point.y;

      // Simple perspective projection
      const perspective = 800;
      const projectedScale = perspective / (perspective + z);

      return {
        x: scannerX + (x + offsetX) * scale * projectedScale,
        y: scannerY + y * scale * projectedScale,
      };
    };

    // Project 3D point to 2D for separation (frozen rotation, screen space offset)
    const projectWithSeparation = (point: Point3D, frozenRotationY: number, offsetX: number): Point2D => {
      const cos = Math.cos(frozenRotationY);
      const sin = Math.sin(frozenRotationY);

      // Rotate around Y-axis at frozen angle
      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      const y = point.y;

      // Simple perspective projection
      const perspective = 800;
      const projectedScale = perspective / (perspective + z);

      // Apply horizontal offset directly in screen space
      return {
        x: scannerX + x * scale * projectedScale + offsetX,
        y: scannerY + y * scale * projectedScale,
      };
    };

    // Draw scanner
    const draw = () => {
      if (!canvas || !ctx) return;

      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const scrollHeight = container.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / scrollHeight, 1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate rotation (0 to 360 degrees)
      const rotationY = scrollProgress * Math.PI * 2 + Math.PI;

      // Calculate separation (starts at 50% progress, which is 180°)
      const separationStart = 0.5;
      const separationProgress = Math.max(0, (scrollProgress - separationStart) / (1 - separationStart));

      // Freeze rotation angle at 180 degrees for separation phase
      const frozenRotationY = separationStart * Math.PI * 2 + Math.PI;

      // Draw each part
      scannerParts.forEach((part) => {
        let offset = 0;
        let opacity = 1;

        if (separationProgress > 0) {
          // During separation phase
          if (part.isFilmHolder) {
            // Film holder shoots out horizontally to the right
            offset = separationProgress * 1200;
            opacity = 1 - separationProgress;
          } else {
            // Scanner body moves to the left
            offset = -separationProgress * 800;
            opacity = 1 - separationProgress;
          }
        }

        if (opacity <= 0) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Project all points
        const projectedPoints = part.points.map((p) => {
          if (separationProgress > 0) {
            // Both use frozen rotation during separation, with different offsets
            return projectWithSeparation(p, frozenRotationY, offset);
          } else {
            // Before separation, everything rotates together
            return project(p, rotationY, 0);
          }
        });

        // Draw lines
        ctx.beginPath();
        part.lines.forEach(([startIdx, endIdx]) => {
          const start = projectedPoints[startIdx];
          const end = projectedPoints[endIdx];

          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
        });
        ctx.stroke();
      });
    };

    // Scroll handler
    const handleScroll = () => {
      requestAnimationFrame(draw);
    };

    // Initial draw
    draw();

    // Listen to scroll
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '400vh' }} className="relative">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen"
        style={{ background: '#000000' }}
      />
    </div>
  );
}