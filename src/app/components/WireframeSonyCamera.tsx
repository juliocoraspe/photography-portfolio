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

interface CameraPart {
  points: Point3D[];
  lines: [number, number][];
  offsetX: number;
  offsetDirection: number; // -1 for left, 1 for right, 0 for no movement
  accordionIndex?: number;
  averageDepth?: number;
}

interface WireframeSonyCameraProps {
  disableScrollAnimationOnMobile?: boolean;
}

export function WireframeSonyCamera({ disableScrollAnimationOnMobile = false }: WireframeSonyCameraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    let cameraX = window.innerWidth < 768 ? window.innerWidth * 0.34 : window.innerWidth * 0.26;
    let cameraY = window.innerHeight < 760 ? window.innerHeight * 0.47 : window.innerHeight * 0.49;
    let scale = 2.6;

    const isStaticMobileMode = () =>
      disableScrollAnimationOnMobile && window.innerWidth <= 768;

    const updateViewportParams = () => {
      const staticMobile = isStaticMobileMode();
      const baseYFactor = window.innerHeight < 760 ? 0.47 : 0.49;
      cameraX = staticMobile
        ? window.innerWidth * 0.5
        : window.innerWidth < 768
          ? window.innerWidth * 0.34
          : window.innerWidth * 0.26;
      cameraY = window.innerHeight * (staticMobile ? baseYFactor - 0.05 : baseYFactor);
      // Mobile About mode: keep same position, but render 10% smaller
      // so it is fully visible immediately without requiring scroll.
      scale = staticMobile ? 2.6 * 0.7695 : 2.6;
    };

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateViewportParams();
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Define camera parts based on Sony A7CR
    const createCameraParts = (): CameraPart[] => {
      return [
        // Main body - compact mirrorless body
        {
          points: [
            { x: -75, y: -45, z: 0 },
            { x: 75, y: -45, z: 0 },
            { x: 75, y: 45, z: 0 },
            { x: -75, y: 45, z: 0 },
            { x: -75, y: -45, z: -35 },
            { x: 75, y: -45, z: -35 },
            { x: 75, y: 45, z: -35 },
            { x: -75, y: 45, z: -35 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Body inner frame
        {
          points: [
            { x: -70, y: -40, z: -2 },
            { x: 70, y: -40, z: -2 },
            { x: 70, y: 40, z: -2 },
            { x: -70, y: 40, z: -2 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // EVF (Electronic Viewfinder) housing - left side
        {
          points: [
            { x: -35, y: -45, z: -35 },
            { x: 15, y: -45, z: -35 },
            { x: 15, y: -55, z: -35 },
            { x: -35, y: -55, z: -35 },
            { x: -35, y: -45, z: -50 },
            { x: 15, y: -45, z: -50 },
            { x: 15, y: -55, z: -50 },
            { x: -35, y: -55, z: -50 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // EVF eyepiece
        {
          points: [
            { x: -30, y: -50, z: -50 },
            { x: 10, y: -50, z: -50 },
            { x: 10, y: -53, z: -50 },
            { x: -30, y: -53, z: -50 },
            { x: -27, y: -50, z: -54 },
            { x: 7, y: -50, z: -54 },
            { x: 7, y: -53, z: -54 },
            { x: -27, y: -53, z: -54 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // Hot shoe mount
        {
          points: [
            { x: 20, y: -55, z: -38 },
            { x: 50, y: -55, z: -38 },
            { x: 50, y: -60, z: -38 },
            { x: 20, y: -60, z: -38 },
            { x: 22, y: -55, z: -42 },
            { x: 48, y: -55, z: -42 },
            { x: 48, y: -60, z: -42 },
            { x: 22, y: -60, z: -42 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Shutter button
        {
          points: Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return {
              x: 70 + Math.cos(angle) * 5,
              y: -55 + Math.sin(angle) * 5,
              z: -30,
            };
          }),
          lines: Array.from({ length: 12 }, (_, i) => [i, (i + 1) % 12] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens mount - outer ring
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 45,
              y: Math.sin(angle) * 45,
              z: 5,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Lens mount - inner bayonet
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 42,
              y: Math.sin(angle) * 42,
              z: 3,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Lens barrel - first section
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 40,
              y: Math.sin(angle) * 40,
              z: 15,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Lens barrel - second section
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 38,
              y: Math.sin(angle) * 38,
              z: 25,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Lens - front element ring
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 36,
              y: Math.sin(angle) * 36,
              z: 35,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Lens - front glass element
        {
          points: Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 34,
              y: Math.sin(angle) * 34,
              z: 33,
            };
          }),
          lines: Array.from({ length: 40 }, (_, i) => [i, (i + 1) % 40] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Focus ring
        {
          points: Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 39,
              y: Math.sin(angle) * 39,
              z: 20,
            };
          }),
          lines: Array.from({ length: 40 }, (_, i) => [i, (i + 1) % 40] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Aperture ring
        {
          points: Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 39,
              y: Math.sin(angle) * 39,
              z: 10,
            };
          }),
          lines: Array.from({ length: 40 }, (_, i) => [i, (i + 1) % 40] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Connecting lines lens to body
        ...Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return {
            points: [
              {
                x: Math.cos(angle) * 45,
                y: Math.sin(angle) * 45,
                z: 5,
              },
              {
                x: Math.cos(angle) * 40,
                y: Math.sin(angle) * 40,
                z: 15,
              },
            ],
            lines: [[0, 1] as [number, number]],
            offsetX: 0,
            offsetDirection: -1,
          };
        }),
        // Right grip - textured surface (positioned in front of body)
        {
          points: [
            { x: 75, y: -15, z: 15 },
            { x: 85, y: -10, z: 18 },
            { x: 85, y: 35, z: 18 },
            { x: 75, y: 40, z: 15 },
            { x: 75, y: -15, z: 10 },
            { x: 85, y: -10, z: 13 },
            { x: 85, y: 35, z: 13 },
            { x: 75, y: 40, z: 10 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Right grip texture lines
        ...Array.from({ length: 12 }, (_, i) => ({
          points: [
            { x: 76, y: -10 + i * 4, z: 14 },
            { x: 82, y: -8 + i * 4, z: 16 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: 1,
        })),
        // Right side panel
        {
          points: [
            { x: 75, y: -30, z: -5 },
            { x: 75, y: 35, z: -5 },
            { x: 75, y: 35, z: -20 },
            { x: 75, y: -30, z: -20 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // LCD screen (back)
        {
          points: [
            { x: -50, y: -25, z: -36 },
            { x: 50, y: -25, z: -36 },
            { x: 50, y: 30, z: -36 },
            { x: -50, y: 30, z: -36 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // LCD inner frame
        {
          points: [
            { x: -47, y: -22, z: -36 },
            { x: 47, y: -22, z: -36 },
            { x: 47, y: 27, z: -36 },
            { x: -47, y: 27, z: -36 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Control buttons (back right)
        ...Array.from({ length: 4 }, (_, i) => ({
          points: Array.from({ length: 12 }, (_, j) => {
            const angle = (j / 12) * Math.PI * 2;
            return {
              x: 58 + Math.cos(angle) * 4,
              y: -15 + i * 12 + Math.sin(angle) * 4,
              z: -35,
            };
          }),
          lines: Array.from({ length: 12 }, (_, j) => [j, (j + 1) % 12] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        })),
        // D-pad/Wheel control (back)
        {
          points: Array.from({ length: 32 }, (_, i) => {
            const angle = (i / 32) * Math.PI * 2;
            return {
              x: -58 + Math.cos(angle) * 12,
              y: 5 + Math.sin(angle) * 12,
              z: -35,
            };
          }),
          lines: Array.from({ length: 32 }, (_, i) => [i, (i + 1) % 32] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // D-pad inner ring
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -58 + Math.cos(angle) * 9,
              y: 5 + Math.sin(angle) * 9,
              z: -35,
            };
          }),
          lines: Array.from({ length: 24 }, (_, i) => [i, (i + 1) % 24] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // D-pad cross lines
        {
          points: [
            { x: -58, y: -7, z: -35 },
            { x: -58, y: 17, z: -35 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: -1,
        },
        {
          points: [
            { x: -70, y: 5, z: -35 },
            { x: -46, y: 5, z: -35 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: -1,
        },
        // Strap lug - left
        {
          points: [
            { x: -75, y: -40, z: 5 },
            { x: -82, y: -38, z: 5 },
            { x: -82, y: -32, z: 5 },
            { x: -75, y: -30, z: 5 },
            { x: -75, y: -40, z: 0 },
            { x: -82, y: -38, z: 0 },
            { x: -82, y: -32, z: 0 },
            { x: -75, y: -30, z: 0 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // Strap lug - right
        {
          points: [
            { x: 75, y: -40, z: -8 },
            { x: 82, y: -38, z: -8 },
            { x: 82, y: -32, z: -8 },
            { x: 75, y: -30, z: -8 },
            { x: 75, y: -40, z: -13 },
            { x: 82, y: -38, z: -13 },
            { x: 82, y: -32, z: -13 },
            { x: 75, y: -30, z: -13 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // USB-C port (left side)
        {
          points: [
            { x: -75, y: 20, z: -8 },
            { x: -72, y: 20, z: -8 },
            { x: -72, y: 26, z: -8 },
            { x: -75, y: 26, z: -8 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // HDMI port (left side)
        {
          points: [
            { x: -75, y: 28, z: -12 },
            { x: -72, y: 28, z: -12 },
            { x: -72, y: 33, z: -12 },
            { x: -75, y: 33, z: -12 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // SD card slot (right side)
        {
          points: [
            { x: 72, y: 10, z: -18 },
            { x: 75, y: 10, z: -18 },
            { x: 75, y: 20, z: -18 },
            { x: 72, y: 20, z: -18 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
      ];
    };

    const cameraParts = createCameraParts().map((part) => ({
      ...part,
      averageDepth: part.points.reduce((sum, point) => sum + point.z, 0) / Math.max(part.points.length, 1),
    }));

    // Preserve the physical front-to-back order during the accordion.
    // Rear parts draw first and receive smaller offsets; front elements draw last and get the farthest right placement.
    const depthSortedParts = [...cameraParts]
      .sort((a, b) => (a.averageDepth ?? 0) - (b.averageDepth ?? 0))
      .map((part, index) => ({
        ...part,
        accordionIndex: index,
      }));

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
        x: cameraX + (x + offsetX) * scale * projectedScale,
        y: cameraY + y * scale * projectedScale,
      };
    };

    // Project with a frozen side-view rotation and screen-space accordion offset
    const projectAccordion = (point: Point3D, frozenRotationY: number, offsetX: number): Point2D => {
      const cos = Math.cos(frozenRotationY);
      const sin = Math.sin(frozenRotationY);

      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      const y = point.y;

      const perspective = 800;
      const projectedScale = perspective / (perspective + z);

      return {
        x: cameraX + x * scale * projectedScale + offsetX,
        y: cameraY + y * scale * projectedScale,
      };
    };

    // Draw camera
    const draw = () => {
      if (!canvas || !ctx) return;

      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const scrollHeight = container.scrollHeight - window.innerHeight;
      const scrollProgress = isStaticMobileMode()
        ? 0
        : Math.min(scrollTop / Math.max(scrollHeight, 1), 1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate 90 degrees to the right, then hold the side view for the accordion
      const fragmentStart = 0.5;
      const sideViewRotationY = Math.PI / 2;
      const rotationPhaseProgress = Math.min(scrollProgress / fragmentStart, 1);
      const rotationY = Math.PI - rotationPhaseProgress * (Math.PI / 2);

      // Accordion fragmentation starts after the 90 degree side view is reached
      const fragmentProgress = Math.max(0, (scrollProgress - fragmentStart) / (1 - fragmentStart));

      // Draw each part
      const maxAccordionIndex = Math.max(depthSortedParts.length - 1, 0);

      depthSortedParts.forEach((part) => {
        const accordionIndex = part.accordionIndex ?? 0;
        const staggerRank = maxAccordionIndex - accordionIndex;
        const staggerProgress = Math.max(0, fragmentProgress - staggerRank * 0.006);
        const normalizedAccordion = Math.min(staggerProgress / 0.964, 1);

        // Progressively larger rightward offsets create the accordion spread
        const fragmentOffset = normalizedAccordion * (90 + accordionIndex * 18);
        part.offsetX = fragmentOffset;

        // Fade to 50% at the end of the accordion
        const opacity = 1 - fragmentProgress * 0.5;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Project all points
        const projectedPoints = part.points.map((p) =>
          fragmentProgress > 0
            ? projectAccordion(p, sideViewRotationY, fragmentOffset)
            : project(p, rotationY, 0)
        );

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
  }, [disableScrollAnimationOnMobile]);

  return (
    <div
      ref={containerRef}
      style={{ height: '400vh' }}
      className={`relative${disableScrollAnimationOnMobile ? ' wireframe-sony--no-mobile-scroll' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen"
        style={{ background: '#000000', pointerEvents: 'none' }}
      />
    </div>
  );
}
