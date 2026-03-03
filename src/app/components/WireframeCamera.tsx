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
  offsetX: number; // For fragmentation
  offsetDirection: number; // -1 for left, 1 for right
}

export function WireframeCamera() {
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

    // Camera position - centered vertically, ~60% from left
    const cameraX = window.innerWidth * 0.5;
    const cameraY = window.innerHeight * 0.5;
    const scale = 3;

    // Define camera parts based on Canon AE-1 Program front view
    const createCameraParts = (): CameraPart[] => {
      return [
        // Main body - wider proportions
        {
          points: [
            { x: -90, y: -50, z: 0 },
            { x: 90, y: -50, z: 0 },
            { x: 90, y: 55, z: 0 },
            { x: -90, y: 55, z: 0 },
            { x: -90, y: -50, z: -25 },
            { x: 90, y: -50, z: -25 },
            { x: 90, y: 55, z: -25 },
            { x: -90, y: 55, z: -25 },
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
            { x: -85, y: -45, z: -2 },
            { x: 85, y: -45, z: -2 },
            { x: 85, y: 50, z: -2 },
            { x: -85, y: 50, z: -2 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Body depth layer
        {
          points: [
            { x: -88, y: -48, z: -12 },
            { x: 88, y: -48, z: -12 },
            { x: 88, y: 53, z: -12 },
            { x: -88, y: 53, z: -12 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Pentaprism housing - pentagonal shape
        {
          points: [
            // Front face - pentagonal
            { x: -30, y: -50, z: -25 },
            { x: 30, y: -50, z: -25 },
            { x: 35, y: -65, z: -25 },
            { x: 0, y: -78, z: -25 },
            { x: -35, y: -65, z: -25 },
            // Back face - smaller pentagon
            { x: -28, y: -50, z: -35 },
            { x: 28, y: -50, z: -35 },
            { x: 32, y: -63, z: -35 },
            { x: 0, y: -74, z: -35 },
            { x: -32, y: -63, z: -35 },
          ],
          lines: [
            // Front pentagon
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
            // Back pentagon
            [5, 6], [6, 7], [7, 8], [8, 9], [9, 5],
            // Connecting edges
            [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Pentaprism top edge detail
        {
          points: [
            { x: -25, y: -68, z: -28 },
            { x: 25, y: -68, z: -28 },
            { x: 0, y: -76, z: -28 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Viewfinder eyepiece
        {
          points: [
            { x: -18, y: -78, z: -25 },
            { x: 18, y: -78, z: -25 },
            { x: 18, y: -84, z: -25 },
            { x: -18, y: -84, z: -25 },
            { x: -15, y: -78, z: -30 },
            { x: 15, y: -78, z: -30 },
            { x: 15, y: -84, z: -30 },
            { x: -15, y: -84, z: -30 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Hot shoe mount
        {
          points: [
            { x: -20, y: -84, z: -28 },
            { x: 20, y: -84, z: -28 },
            { x: 20, y: -88, z: -28 },
            { x: -20, y: -88, z: -28 },
            { x: -18, y: -84, z: -32 },
            { x: 18, y: -84, z: -32 },
            { x: 18, y: -88, z: -32 },
            { x: -18, y: -88, z: -32 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Lens mount - outer ring (larger)
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 50,
              y: Math.sin(angle) * 50,
              z: 28,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens mount - inner bayonet ring
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 47,
              y: Math.sin(angle) * 47,
              z: 26,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens barrel - outer housing
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 45,
              y: Math.sin(angle) * 45,
              z: 35,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens - front element outer ring
        {
          points: Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 42,
              y: Math.sin(angle) * 42,
              z: 38,
            };
          }),
          lines: Array.from({ length: 48 }, (_, i) => [i, (i + 1) % 48] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens - front glass element
        {
          points: Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 38,
              y: Math.sin(angle) * 38,
              z: 36,
            };
          }),
          lines: Array.from({ length: 40 }, (_, i) => [i, (i + 1) % 40] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens - aperture ring detail
        {
          points: Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 44,
              y: Math.sin(angle) * 44,
              z: 22,
            };
          }),
          lines: Array.from({ length: 40 }, (_, i) => [i, (i + 1) % 40] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens - focus ring
        {
          points: Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 46,
              y: Math.sin(angle) * 46,
              z: 15,
            };
          }),
          lines: Array.from({ length: 40 }, (_, i) => [i, (i + 1) % 40] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens grip texture lines (vertical)
        ...Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return {
            points: [
              {
                x: Math.cos(angle) * 44,
                y: Math.sin(angle) * 44,
                z: 12,
              },
              {
                x: Math.cos(angle) * 44,
                y: Math.sin(angle) * 44,
                z: 24,
              },
            ],
            lines: [[0, 1] as [number, number]],
            offsetX: 0,
            offsetDirection: 1,
          };
        }),
        // Lens - aperture blades (hexagonal)
        {
          points: Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 25,
              y: Math.sin(angle) * 25,
              z: 34,
            };
          }),
          lines: Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Connecting lines lens to body
        ...Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return {
            points: [
              {
                x: Math.cos(angle) * 50,
                y: Math.sin(angle) * 50,
                z: 28,
              },
              {
                x: Math.cos(angle) * 45,
                y: Math.sin(angle) * 45,
                z: 35,
              },
            ],
            lines: [[0, 1] as [number, number]],
            offsetX: 0,
            offsetDirection: 1,
          };
        }),
        // Film rewind knob - cylindrical (left side)
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -65 + Math.cos(angle) * 15,
              y: -70 + Math.sin(angle) * 15,
              z: -22,
            };
          }),
          lines: Array.from({ length: 24 }, (_, i) => [i, (i + 1) % 24] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Film rewind knob top
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -65 + Math.cos(angle) * 15,
              y: -70 + Math.sin(angle) * 15,
              z: -32,
            };
          }),
          lines: Array.from({ length: 24 }, (_, i) => [i, (i + 1) % 24] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Rewind knob connecting edges
        ...Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return {
            points: [
              {
                x: -65 + Math.cos(angle) * 15,
                y: -70 + Math.sin(angle) * 15,
                z: -22,
              },
              {
                x: -65 + Math.cos(angle) * 15,
                y: -70 + Math.sin(angle) * 15,
                z: -32,
              },
            ],
            lines: [[0, 1] as [number, number]],
            offsetX: 0,
            offsetDirection: 1,
          };
        }),
        // Rewind crank inner detail
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: -65 + Math.cos(angle) * 10,
              y: -70 + Math.sin(angle) * 10,
              z: -33,
            };
          }),
          lines: Array.from({ length: 16 }, (_, i) => [i, (i + 1) % 16] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Shutter button assembly
        {
          points: [
            { x: 75, y: -72, z: -20 },
            { x: 85, y: -72, z: -20 },
            { x: 85, y: -76, z: -20 },
            { x: 75, y: -76, z: -20 },
            { x: 77, y: -73, z: -24 },
            { x: 83, y: -73, z: -24 },
            { x: 83, y: -75, z: -24 },
            { x: 77, y: -75, z: -24 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Shutter button top circle
        {
          points: Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return {
              x: 80 + Math.cos(angle) * 4,
              y: -74 + Math.sin(angle) * 2,
              z: -24,
            };
          }),
          lines: Array.from({ length: 12 }, (_, i) => [i, (i + 1) % 12] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Film advance lever - angular
        {
          points: [
            { x: 82, y: -55, z: -22 },
            { x: 95, y: -62, z: -22 },
            { x: 92, y: -50, z: -22 },
            { x: 80, y: -53, z: -26 },
            { x: 93, y: -60, z: -26 },
            { x: 90, y: -48, z: -26 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 0],
            [3, 4], [4, 5], [5, 3],
            [0, 3], [1, 4], [2, 5],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Film advance lever pivot
        {
          points: Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return {
              x: 82 + Math.cos(angle) * 3,
              y: -55 + Math.sin(angle) * 3,
              z: -24,
            };
          }),
          lines: Array.from({ length: 12 }, (_, i) => [i, (i + 1) % 12] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Frame counter window
        {
          points: [
            { x: 50, y: -68, z: -20 },
            { x: 65, y: -68, z: -20 },
            { x: 65, y: -76, z: -20 },
            { x: 50, y: -76, z: -20 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Left strap lug - triangular
        {
          points: [
            { x: -85, y: -35, z: 5 },
            { x: -95, y: -30, z: 5 },
            { x: -85, y: -25, z: 5 },
            { x: -85, y: -35, z: 0 },
            { x: -95, y: -30, z: 0 },
            { x: -85, y: -25, z: 0 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 0],
            [3, 4], [4, 5], [5, 3],
            [0, 3], [1, 4], [2, 5],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Right strap lug - triangular
        {
          points: [
            { x: 85, y: -35, z: 5 },
            { x: 95, y: -30, z: 5 },
            { x: 85, y: -25, z: 5 },
            { x: 85, y: -35, z: 0 },
            { x: 95, y: -30, z: 0 },
            { x: 85, y: -25, z: 0 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 0],
            [3, 4], [4, 5], [5, 3],
            [0, 3], [1, 4], [2, 5],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Left grip panel detail
        {
          points: [
            { x: -90, y: -30, z: -5 },
            { x: -75, y: -30, z: -5 },
            { x: -75, y: 30, z: -5 },
            { x: -90, y: 30, z: -5 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Left grip texture lines
        ...Array.from({ length: 10 }, (_, i) => ({
          points: [
            { x: -88, y: -25 + i * 6, z: -5 },
            { x: -77, y: -25 + i * 6, z: -5 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: 1,
        })),
        // Right grip panel detail
        {
          points: [
            { x: 75, y: -20, z: -5 },
            { x: 90, y: -20, z: -5 },
            { x: 90, y: 40, z: -5 },
            { x: 75, y: 40, z: -5 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Right grip texture lines
        ...Array.from({ length: 10 }, (_, i) => ({
          points: [
            { x: 77, y: -15 + i * 6, z: -5 },
            { x: 88, y: -15 + i * 6, z: -5 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: 1,
        })),
        // Self-timer lever (front left)
        {
          points: [
            { x: -45, y: 20, z: 5 },
            { x: -40, y: 28, z: 5 },
            { x: -42, y: 20, z: 2 },
            { x: -37, y: 28, z: 2 },
          ],
          lines: [
            [0, 1], [2, 3], [0, 2], [1, 3],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Lens release button (front right)
        {
          points: Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return {
              x: 42 + Math.cos(angle) * 6,
              y: 25 + Math.sin(angle) * 6,
              z: 5,
            };
          }),
          lines: Array.from({ length: 12 }, (_, i) => [i, (i + 1) % 12] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Bottom plate detail
        {
          points: [
            { x: -70, y: 48, z: -10 },
            { x: 70, y: 48, z: -10 },
            { x: 70, y: 55, z: -10 },
            { x: -70, y: 55, z: -10 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 0,
        },
        // Tripod mount
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 10,
              y: 52 + Math.sin(angle) * 10,
              z: -10,
            };
          }),
          lines: Array.from({ length: 16 }, (_, i) => [i, (i + 1) % 16] as [number, number]),
          offsetX: 0,
          offsetDirection: 0,
        },
        // Film door latch
        {
          points: [
            { x: 85, y: 5, z: -12 },
            { x: 88, y: 5, z: -12 },
            { x: 88, y: 18, z: -12 },
            { x: 85, y: 18, z: -12 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Film door seam line
        {
          points: [
            { x: 83, y: -48, z: -12 },
            { x: 83, y: 53, z: -12 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Mode dial (left top, smaller)
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: -45 + Math.cos(angle) * 12,
              y: -70 + Math.sin(angle) * 12,
              z: -22,
            };
          }),
          lines: Array.from({ length: 20 }, (_, i) => [i, (i + 1) % 20] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Mode dial inner
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: -45 + Math.cos(angle) * 9,
              y: -70 + Math.sin(angle) * 9,
              z: -23,
            };
          }),
          lines: Array.from({ length: 16 }, (_, i) => [i, (i + 1) % 16] as [number, number]),
          offsetX: 0,
          offsetDirection: 1,
        },
        // Flash sync port (left side)
        {
          points: [
            { x: -85, y: 38, z: -8 },
            { x: -80, y: 38, z: -8 },
            { x: -80, y: 45, z: -8 },
            { x: -85, y: 45, z: -8 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Battery compartment cover (bottom)
        {
          points: [
            { x: -68, y: 48, z: -10 },
            { x: -48, y: 48, z: -10 },
            { x: -48, y: 53, z: -10 },
            { x: -68, y: 53, z: -10 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: 1,
        },
        // Film roll canister - BOTTOM circle (vertical orientation)
        {
          points: Array.from({ length: 32 }, (_, i) => {
            const angle = (i / 32) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 18,
              y: 35,
              z: -12 + Math.sin(angle) * 18,
            };
          }),
          lines: Array.from({ length: 32 }, (_, i) => [i, (i + 1) % 32] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film roll canister - TOP circle (vertical orientation)
        {
          points: Array.from({ length: 32 }, (_, i) => {
            const angle = (i / 32) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 18,
              y: -35,
              z: -12 + Math.sin(angle) * 18,
            };
          }),
          lines: Array.from({ length: 32 }, (_, i) => [i, (i + 1) % 32] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film roll canister - vertical connecting lines
        ...Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return {
            points: [
              {
                x: -60 + Math.cos(angle) * 18,
                y: 35,
                z: -12 + Math.sin(angle) * 18,
              },
              {
                x: -60 + Math.cos(angle) * 18,
                y: -35,
                z: -12 + Math.sin(angle) * 18,
              },
            ],
            lines: [[0, 1] as [number, number]],
            offsetX: 0,
            offsetDirection: -1,
          };
        }),
        // Film roll - top cap outer
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 14,
              y: -36,
              z: -12 + Math.sin(angle) * 14,
            };
          }),
          lines: Array.from({ length: 24 }, (_, i) => [i, (i + 1) % 24] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film roll - spool center (top)
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 6,
              y: -37,
              z: -12 + Math.sin(angle) * 6,
            };
          }),
          lines: Array.from({ length: 20 }, (_, i) => [i, (i + 1) % 20] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film roll - spool notches (top, radiating outward)
        ...Array.from({ length: 4 }, (_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return {
            points: [
              {
                x: -60 + Math.cos(angle) * 6,
                y: -37,
                z: -12 + Math.sin(angle) * 6,
              },
              {
                x: -60 + Math.cos(angle) * 13,
                y: -37,
                z: -12 + Math.sin(angle) * 13,
              },
            ],
            lines: [[0, 1] as [number, number]],
            offsetX: 0,
            offsetDirection: -1,
          };
        }),
        // Film roll - bottom cap
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 14,
              y: 36,
              z: -12 + Math.sin(angle) * 14,
            };
          }),
          lines: Array.from({ length: 24 }, (_, i) => [i, (i + 1) % 24] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film roll - inner canister detail ring (mid-height)
        {
          points: Array.from({ length: 28 }, (_, i) => {
            const angle = (i / 28) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 17,
              y: 0,
              z: -12 + Math.sin(angle) * 17,
            };
          }),
          lines: Array.from({ length: 28 }, (_, i) => [i, (i + 1) % 28] as [number, number]),
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film strip - main body outline (coming out horizontally from canister)
        {
          points: [
            { x: -42, y: -30, z: -12 },
            { x: -15, y: -30, z: -12 },
            { x: -15, y: 30, z: -12 },
            { x: -42, y: 30, z: -12 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film strip - perforation holes on top edge
        ...Array.from({ length: 10 }, (_, i) => ({
          points: [
            { x: -40 + i * 2.6, y: -30, z: -12 },
            { x: -39.3 + i * 2.6, y: -30, z: -12 },
            { x: -39.3 + i * 2.6, y: -28, z: -12 },
            { x: -40 + i * 2.6, y: -28, z: -12 },
          ],
          lines: [
            [0, 1] as [number, number],
            [1, 2] as [number, number],
            [2, 3] as [number, number],
            [3, 0] as [number, number],
          ],
          offsetX: 0,
          offsetDirection: -1,
        })),
        // Film strip - perforation holes on bottom edge
        ...Array.from({ length: 10 }, (_, i) => ({
          points: [
            { x: -40 + i * 2.6, y: 28, z: -12 },
            { x: -39.3 + i * 2.6, y: 28, z: -12 },
            { x: -39.3 + i * 2.6, y: 30, z: -12 },
            { x: -40 + i * 2.6, y: 30, z: -12 },
          ],
          lines: [
            [0, 1] as [number, number],
            [1, 2] as [number, number],
            [2, 3] as [number, number],
            [3, 0] as [number, number],
          ],
          offsetX: 0,
          offsetDirection: -1,
        })),
        // Film strip - perforation holes on left edge (vertical side)
        ...Array.from({ length: 20 }, (_, i) => ({
          points: [
            { x: -42, y: -28 + i * 3, z: -12 },
            { x: -42, y: -27 + i * 3, z: -12 },
            { x: -40, y: -27 + i * 3, z: -12 },
            { x: -40, y: -28 + i * 3, z: -12 },
          ],
          lines: [
            [0, 1] as [number, number],
            [1, 2] as [number, number],
            [2, 3] as [number, number],
            [3, 0] as [number, number],
          ],
          offsetX: 0,
          offsetDirection: -1,
        })),
        // Film strip - perforation holes on right edge (vertical side)
        ...Array.from({ length: 20 }, (_, i) => ({
          points: [
            { x: -15, y: -28 + i * 3, z: -12 },
            { x: -15, y: -27 + i * 3, z: -12 },
            { x: -17, y: -27 + i * 3, z: -12 },
            { x: -17, y: -28 + i * 3, z: -12 },
          ],
          lines: [
            [0, 1] as [number, number],
            [1, 2] as [number, number],
            [2, 3] as [number, number],
            [3, 0] as [number, number],
          ],
          offsetX: 0,
          offsetDirection: -1,
        })),
        // Film strip - frame divider lines (horizontal divisions)
        ...Array.from({ length: 6 }, (_, i) => ({
          points: [
            { x: -40, y: -22 + i * 9, z: -12 },
            { x: -17, y: -22 + i * 9, z: -12 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: -1,
        })),
        // Film canister detail - label area (rectangular area on canister surface)
        {
          points: [
            { x: -42, y: -12, z: -12 },
            { x: -42, y: 12, z: -12 },
            { x: -38, y: 12, z: -12 },
            { x: -38, y: -12, z: -12 },
          ],
          lines: [
            [0, 1], [1, 2], [2, 3], [3, 0],
          ],
          offsetX: 0,
          offsetDirection: -1,
        },
        // Film canister - brand text lines (horizontal lines on label)
        ...Array.from({ length: 3 }, (_, i) => ({
          points: [
            { x: -42, y: -8 + i * 8, z: -12 },
            { x: -38, y: -8 + i * 8, z: -12 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetDirection: -1,
        })),
      ];
    };

    const cameraParts = createCameraParts();

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

    // Draw camera
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

      // Calculate fragmentation (starts at 50% progress, which is 180°)
      const fragmentStart = 0.5;
      const fragmentProgress = Math.max(0, (scrollProgress - fragmentStart) / (1 - fragmentStart));

      // Draw each part
      cameraParts.forEach((part) => {
        // Calculate offset for fragmentation
        const fragmentOffset = part.offsetDirection * fragmentProgress * 800;
        part.offsetX = fragmentOffset;

        // Calculate opacity (fade out during fragmentation)
        const opacity = 1 - fragmentProgress;

        if (opacity <= 0) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Project all points
        const projectedPoints = part.points.map((p) =>
          project(p, rotationY, fragmentOffset)
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