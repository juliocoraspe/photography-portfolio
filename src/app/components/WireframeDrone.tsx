import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

interface DronePart {
  points: Point3D[];
  lines: [number, number][];
  offsetX: number;
  offsetY: number;
  offsetDirection: "up" | "left" | "right" | "none";
}

export function WireframeDrone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.5;
    const scale = 3;

    // Define drone parts - all centered at origin
    const createDroneParts = (): DronePart[] => {
      // Position adjustments
      const droneYOffset = 12; // Lower drone
      const gogglesYOffset = -8; // Raise goggles
      const gogglesXOffset = -25; // Move goggles left
      const controllerYOffset = 4; // Align controller top with goggles
      const controllerXOffset = 25; // Move controller right

      return [
        // ========== DRONE (centered) - SCALED 1.7x, LOWERED ==========
        // Main central body - elongated box (front to back depth)
        {
          points: [
            { x: -42.5, y: -110.5 + droneYOffset, z: 17 },
            { x: 42.5, y: -110.5 + droneYOffset, z: 17 },
            { x: 42.5, y: -59.5 + droneYOffset, z: 17 },
            { x: -42.5, y: -59.5 + droneYOffset, z: 17 },
            { x: -42.5, y: -110.5 + droneYOffset, z: -68 },
            { x: 42.5, y: -110.5 + droneYOffset, z: -68 },
            { x: 42.5, y: -59.5 + droneYOffset, z: -68 },
            { x: -42.5, y: -59.5 + droneYOffset, z: -68 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Top canopy bulge
        {
          points: [
            { x: -30.6, y: -119 + droneYOffset, z: 8.5 },
            { x: 30.6, y: -119 + droneYOffset, z: 8.5 },
            { x: 30.6, y: -102 + droneYOffset, z: 8.5 },
            { x: -30.6, y: -102 + droneYOffset, z: 8.5 },
            { x: -25.5, y: -122.4 + droneYOffset, z: -25.5 },
            { x: 25.5, y: -122.4 + droneYOffset, z: -25.5 },
            { x: 25.5, y: -105.4 + droneYOffset, z: -25.5 },
            { x: -25.5, y: -105.4 + droneYOffset, z: -25.5 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Front camera module housing (protruding forward)
        {
          points: [
            { x: -20.4, y: -68 + droneYOffset, z: 25.5 },
            { x: 20.4, y: -68 + droneYOffset, z: 25.5 },
            { x: 20.4, y: -54.4 + droneYOffset, z: 25.5 },
            { x: -20.4, y: -54.4 + droneYOffset, z: 25.5 },
            { x: -17, y: -68 + droneYOffset, z: 51 },
            { x: 17, y: -68 + droneYOffset, z: 51 },
            { x: 17, y: -54.4 + droneYOffset, z: 51 },
            { x: -17, y: -54.4 + droneYOffset, z: 51 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Camera lens
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: Math.cos(angle) * 13.6,
              y: -61.2 + droneYOffset + Math.sin(angle) * 10.2,
              z: 54.4,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Battery compartment detail (top center)
        {
          points: [
            { x: -34, y: -105.4 + droneYOffset, z: -8.5 },
            { x: 34, y: -105.4 + droneYOffset, z: -8.5 },
            { x: 34, y: -76.5 + droneYOffset, z: -8.5 },
            { x: -34, y: -76.5 + droneYOffset, z: -8.5 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },

        // Front RIGHT motor arm (angled forward and right)
        {
          points: [
            { x: 34, y: -93.5 + droneYOffset, z: 8.5 },
            { x: 110.5, y: -119 + droneYOffset, z: 42.5 },
            { x: 113.9, y: -115.6 + droneYOffset, z: 42.5 },
            { x: 37.4, y: -90.1 + droneYOffset, z: 8.5 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Front RIGHT motor housing
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: 112.2 + Math.cos(angle) * 17,
              y: -117.3 + droneYOffset + Math.sin(angle) * 17,
              z: 42.5,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Front RIGHT propeller
        {
          points: [
            { x: 112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: 139.4, y: -127.5 + droneYOffset, z: 47.6 },
            { x: 112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: 85, y: -107.1 + droneYOffset, z: 47.6 },
            { x: 112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: 122.4, y: -144.5 + droneYOffset, z: 47.6 },
            { x: 112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: 102, y: -90.1 + droneYOffset, z: 47.6 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },

        // Front LEFT motor arm (angled forward and left)
        {
          points: [
            { x: -34, y: -93.5 + droneYOffset, z: 8.5 },
            { x: -110.5, y: -119 + droneYOffset, z: 42.5 },
            { x: -113.9, y: -115.6 + droneYOffset, z: 42.5 },
            { x: -37.4, y: -90.1 + droneYOffset, z: 8.5 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Front LEFT motor housing
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: -112.2 + Math.cos(angle) * 17,
              y: -117.3 + droneYOffset + Math.sin(angle) * 17,
              z: 42.5,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Front LEFT propeller
        {
          points: [
            { x: -112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: -139.4, y: -127.5 + droneYOffset, z: 47.6 },
            { x: -112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: -85, y: -107.1 + droneYOffset, z: 47.6 },
            { x: -112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: -122.4, y: -144.5 + droneYOffset, z: 47.6 },
            { x: -112.2, y: -117.3 + droneYOffset, z: 47.6 },
            { x: -102, y: -90.1 + droneYOffset, z: 47.6 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },

        // Back RIGHT motor arm (angled backward and right)
        {
          points: [
            { x: 34, y: -81.6 + droneYOffset, z: -59.5 },
            { x: 102, y: -102 + droneYOffset, z: -102 },
            { x: 105.4, y: -98.6 + droneYOffset, z: -102 },
            { x: 37.4, y: -78.2 + droneYOffset, z: -59.5 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Back RIGHT motor housing
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: 103.7 + Math.cos(angle) * 17,
              y: -100.3 + droneYOffset + Math.sin(angle) * 17,
              z: -102,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Back RIGHT propeller
        {
          points: [
            { x: 103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: 130.9, y: -110.5 + droneYOffset, z: -107.1 },
            { x: 103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: 76.5, y: -90.1 + droneYOffset, z: -107.1 },
            { x: 103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: 113.9, y: -127.5 + droneYOffset, z: -107.1 },
            { x: 103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: 93.5, y: -73.1 + droneYOffset, z: -107.1 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },

        // Back LEFT motor arm (angled backward and left)
        {
          points: [
            { x: -34, y: -81.6 + droneYOffset, z: -59.5 },
            { x: -102, y: -102 + droneYOffset, z: -102 },
            { x: -105.4, y: -98.6 + droneYOffset, z: -102 },
            { x: -37.4, y: -78.2 + droneYOffset, z: -59.5 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Back LEFT motor housing
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: -103.7 + Math.cos(angle) * 17,
              y: -100.3 + droneYOffset + Math.sin(angle) * 17,
              z: -102,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },
        // Back LEFT propeller
        {
          points: [
            { x: -103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: -130.9, y: -110.5 + droneYOffset, z: -107.1 },
            { x: -103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: -76.5, y: -90.1 + droneYOffset, z: -107.1 },
            { x: -103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: -113.9, y: -127.5 + droneYOffset, z: -107.1 },
            { x: -103.7, y: -100.3 + droneYOffset, z: -107.1 },
            { x: -93.5, y: -73.1 + droneYOffset, z: -107.1 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "up",
        },

        // ========== FPV GOGGLES - SCALED 0.8x, RAISED ==========
        // Main goggle body - rounded shape using multiple segments
        // Front face top arc
        {
          points: [
            { x: -88, y: 12 + gogglesYOffset, z: 12 },
            { x: -72, y: 6.4 + gogglesYOffset, z: 12 },
            { x: -56, y: 4 + gogglesYOffset, z: 12 },
            { x: -40, y: 2.4 + gogglesYOffset, z: 12 },
            { x: -24, y: 2.4 + gogglesYOffset, z: 12 },
            { x: -8, y: 4 + gogglesYOffset, z: 12 },
            { x: 8, y: 6.4 + gogglesYOffset, z: 12 },
            { x: 24, y: 12 + gogglesYOffset, z: 12 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Front face bottom arc
        {
          points: [
            { x: -88, y: 44 + gogglesYOffset, z: 12 },
            { x: -72, y: 49.6 + gogglesYOffset, z: 12 },
            { x: -56, y: 52 + gogglesYOffset, z: 12 },
            { x: -40, y: 53.6 + gogglesYOffset, z: 12 },
            { x: -24, y: 53.6 + gogglesYOffset, z: 12 },
            { x: -8, y: 52 + gogglesYOffset, z: 12 },
            { x: 8, y: 49.6 + gogglesYOffset, z: 12 },
            { x: 24, y: 44 + gogglesYOffset, z: 12 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Connect front top to bottom
        {
          points: [
            { x: -88, y: 12 + gogglesYOffset, z: 12 },
            { x: -88, y: 44 + gogglesYOffset, z: 12 },
            { x: 24, y: 12 + gogglesYOffset, z: 12 },
            { x: 24, y: 44 + gogglesYOffset, z: 12 },
          ],
          lines: [
            [0, 1],
            [2, 3],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Back face (face padding side)
        {
          points: [
            { x: -84, y: 14.4 + gogglesYOffset, z: -20 },
            { x: -68, y: 9.6 + gogglesYOffset, z: -20 },
            { x: -52, y: 7.2 + gogglesYOffset, z: -20 },
            { x: -36, y: 6.4 + gogglesYOffset, z: -20 },
            { x: -20, y: 6.4 + gogglesYOffset, z: -20 },
            { x: -4, y: 7.2 + gogglesYOffset, z: -20 },
            { x: 12, y: 9.6 + gogglesYOffset, z: -20 },
            { x: 28, y: 14.4 + gogglesYOffset, z: -20 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        {
          points: [
            { x: -84, y: 41.6 + gogglesYOffset, z: -20 },
            { x: -68, y: 46.4 + gogglesYOffset, z: -20 },
            { x: -52, y: 48.8 + gogglesYOffset, z: -20 },
            { x: -36, y: 49.6 + gogglesYOffset, z: -20 },
            { x: -20, y: 49.6 + gogglesYOffset, z: -20 },
            { x: -4, y: 48.8 + gogglesYOffset, z: -20 },
            { x: 12, y: 46.4 + gogglesYOffset, z: -20 },
            { x: 28, y: 41.6 + gogglesYOffset, z: -20 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Connect back top to bottom
        {
          points: [
            { x: -84, y: 14.4 + gogglesYOffset, z: -20 },
            { x: -84, y: 41.6 + gogglesYOffset, z: -20 },
            { x: 28, y: 14.4 + gogglesYOffset, z: -20 },
            { x: 28, y: 41.6 + gogglesYOffset, z: -20 },
          ],
          lines: [
            [0, 1],
            [2, 3],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Connect front to back (depth lines)
        {
          points: [
            { x: -88, y: 12 + gogglesYOffset, z: 12 },
            { x: -84, y: 14.4 + gogglesYOffset, z: -20 },
            { x: 24, y: 12 + gogglesYOffset, z: 12 },
            { x: 28, y: 14.4 + gogglesYOffset, z: -20 },
            { x: -88, y: 44 + gogglesYOffset, z: 12 },
            { x: -84, y: 41.6 + gogglesYOffset, z: -20 },
            { x: 24, y: 44 + gogglesYOffset, z: 12 },
            { x: 28, y: 41.6 + gogglesYOffset, z: -20 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },

        // Left lens (circular, more accurate)
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 14.4,
              y: 28 + gogglesYOffset + Math.sin(angle) * 12.8,
              z: 14.4,
            };
          }),
          lines: Array.from(
            { length: 24 },
            (_, i) => [i, (i + 1) % 24] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Left lens inner detail
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: -60 + Math.cos(angle) * 9.6,
              y: 28 + gogglesYOffset + Math.sin(angle) * 8,
              z: 15.2,
            };
          }),
          lines: Array.from(
            { length: 20 },
            (_, i) => [i, (i + 1) % 20] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Right lens (circular, more accurate)
        {
          points: Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            return {
              x: -4 + Math.cos(angle) * 14.4,
              y: 28 + gogglesYOffset + Math.sin(angle) * 12.8,
              z: 14.4,
            };
          }),
          lines: Array.from(
            { length: 24 },
            (_, i) => [i, (i + 1) % 24] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Right lens inner detail
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: -4 + Math.cos(angle) * 9.6,
              y: 28 + gogglesYOffset + Math.sin(angle) * 8,
              z: 15.2,
            };
          }),
          lines: Array.from(
            { length: 20 },
            (_, i) => [i, (i + 1) % 20] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Center nose bridge
        {
          points: [
            { x: -40, y: 20 + gogglesYOffset, z: 13.6 },
            { x: -24, y: 20 + gogglesYOffset, z: 13.6 },
            { x: -24, y: 36 + gogglesYOffset, z: 13.6 },
            { x: -40, y: 36 + gogglesYOffset, z: 13.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },

        // TOP antennas (2 on top, angled forward)
        // Top left antenna
        {
          points: [
            { x: -68, y: 6.4 + gogglesYOffset, z: 0 },
            { x: -70.4, y: -16 + gogglesYOffset, z: 12 },
            { x: -68.8, y: -16 + gogglesYOffset, z: 12 },
            { x: -66.4, y: 6.4 + gogglesYOffset, z: 0 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Top right antenna
        {
          points: [
            { x: 4, y: 6.4 + gogglesYOffset, z: 0 },
            { x: 1.6, y: -16 + gogglesYOffset, z: 12 },
            { x: 3.2, y: -16 + gogglesYOffset, z: 12 },
            { x: 5.6, y: 6.4 + gogglesYOffset, z: 0 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },

        // BOTTOM antennas (2 on bottom, angled forward)
        // Bottom left antenna
        {
          points: [
            { x: -68, y: 49.6 + gogglesYOffset, z: 0 },
            { x: -70.4, y: 72 + gogglesYOffset, z: 12 },
            { x: -68.8, y: 72 + gogglesYOffset, z: 12 },
            { x: -66.4, y: 49.6 + gogglesYOffset, z: 0 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        // Bottom right antenna
        {
          points: [
            { x: 4, y: 49.6 + gogglesYOffset, z: 0 },
            { x: 1.6, y: 72 + gogglesYOffset, z: 12 },
            { x: 3.2, y: 72 + gogglesYOffset, z: 12 },
            { x: 5.6, y: 49.6 + gogglesYOffset, z: 0 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },

        // Head strap attachment points
        {
          points: [
            { x: -88, y: 24 + gogglesYOffset, z: 0 },
            { x: -92, y: 24 + gogglesYOffset, z: 0 },
            { x: -92, y: 32 + gogglesYOffset, z: 0 },
            { x: -88, y: 32 + gogglesYOffset, z: 0 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },
        {
          points: [
            { x: 24, y: 24 + gogglesYOffset, z: 0 },
            { x: 28, y: 24 + gogglesYOffset, z: 0 },
            { x: 28, y: 32 + gogglesYOffset, z: 0 },
            { x: 24, y: 32 + gogglesYOffset, z: 0 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "left",
        },

        // ========== REMOTE CONTROLLER - DJI FPV Style - SCALED 0.8x, LOWERED ==========
        // Left shoulder section (wide for left stick)
        {
          points: [
            { x: 36, y: 0 + controllerYOffset, z: 4 },
            { x: 60, y: 0 + controllerYOffset, z: 4 },
            { x: 64, y: 14.4 + controllerYOffset, z: 4 },
            { x: 36, y: 14.4 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 37.6, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 58.4, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 62.4, y: 16 + controllerYOffset, z: -17.6 },
            { x: 37.6, y: 16 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Right shoulder section (wide for right stick)
        {
          points: [
            { x: 84, y: 0 + controllerYOffset, z: 4 },
            { x: 108, y: 0 + controllerYOffset, z: 4 },
            { x: 108, y: 14.4 + controllerYOffset, z: 4 },
            { x: 80, y: 14.4 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 85.6, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 106.4, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 106.4, y: 16 + controllerYOffset, z: -17.6 },
            { x: 81.6, y: 16 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Center narrow section
        {
          points: [
            { x: 60, y: 0 + controllerYOffset, z: 4 },
            { x: 84, y: 0 + controllerYOffset, z: 4 },
            { x: 84, y: 12 + controllerYOffset, z: 4 },
            { x: 60, y: 12 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 61.6, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 82.4, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 82.4, y: 13.6 + controllerYOffset, z: -17.6 },
            { x: 61.6, y: 13.6 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Connect shoulders and center front to back
        {
          points: [
            { x: 36, y: 0 + controllerYOffset, z: 4 },
            { x: 37.6, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 60, y: 0 + controllerYOffset, z: 4 },
            { x: 58.4, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 84, y: 0 + controllerYOffset, z: 4 },
            { x: 85.6, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 108, y: 0 + controllerYOffset, z: 4 },
            { x: 106.4, y: 1.6 + controllerYOffset, z: -17.6 },
            { x: 36, y: 14.4 + controllerYOffset, z: 4 },
            { x: 37.6, y: 16 + controllerYOffset, z: -17.6 },
            { x: 64, y: 14.4 + controllerYOffset, z: 4 },
            { x: 62.4, y: 16 + controllerYOffset, z: -17.6 },
            { x: 80, y: 14.4 + controllerYOffset, z: 4 },
            { x: 81.6, y: 16 + controllerYOffset, z: -17.6 },
            { x: 108, y: 14.4 + controllerYOffset, z: 4 },
            { x: 106.4, y: 16 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
            [8, 9],
            [10, 11],
            [12, 13],
            [14, 15],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Transition to grips - left side
        {
          points: [
            { x: 36, y: 14.4 + controllerYOffset, z: 4 },
            { x: 64, y: 14.4 + controllerYOffset, z: 4 },
            { x: 65.6, y: 28 + controllerYOffset, z: 4 },
            { x: 34.4, y: 28 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 37.6, y: 16 + controllerYOffset, z: -17.6 },
            { x: 62.4, y: 16 + controllerYOffset, z: -17.6 },
            { x: 64, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 36, y: 29.6 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Transition to grips - right side
        {
          points: [
            { x: 80, y: 14.4 + controllerYOffset, z: 4 },
            { x: 108, y: 14.4 + controllerYOffset, z: 4 },
            { x: 109.6, y: 28 + controllerYOffset, z: 4 },
            { x: 78.4, y: 28 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 81.6, y: 16 + controllerYOffset, z: -17.6 },
            { x: 106.4, y: 16 + controllerYOffset, z: -17.6 },
            { x: 108, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 80, y: 29.6 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 34.4, y: 28 + controllerYOffset, z: 4 },
            { x: 36, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 109.6, y: 28 + controllerYOffset, z: 4 },
            { x: 108, y: 29.6 + controllerYOffset, z: -17.6 },
          ],
          lines: [
            [0, 1],
            [2, 3],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },

        // Left stick (on left shoulder)
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: 48 + Math.cos(angle) * 8.8,
              y:
                7.2 + controllerYOffset + Math.sin(angle) * 8.8,
              z: 8,
            };
          }),
          lines: Array.from(
            { length: 20 },
            (_, i) => [i, (i + 1) % 20] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: 48 + Math.cos(angle) * 4.8,
              y:
                7.2 + controllerYOffset + Math.sin(angle) * 4.8,
              z: 12.8,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Right stick (on right shoulder)
        {
          points: Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: 96 + Math.cos(angle) * 8.8,
              y:
                7.2 + controllerYOffset + Math.sin(angle) * 8.8,
              z: 8,
            };
          }),
          lines: Array.from(
            { length: 20 },
            (_, i) => [i, (i + 1) % 20] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return {
              x: 96 + Math.cos(angle) * 4.8,
              y:
                7.2 + controllerYOffset + Math.sin(angle) * 4.8,
              z: 12.8,
            };
          }),
          lines: Array.from(
            { length: 16 },
            (_, i) => [i, (i + 1) % 16] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },

        // Antenna (top center)
        {
          points: [
            { x: 70.4, y: 0 + controllerYOffset, z: -6.4 },
            { x: 73.6, y: 0 + controllerYOffset, z: -6.4 },
            { x: 73.6, y: -22.4 + controllerYOffset, z: -6.4 },
            { x: 70.4, y: -22.4 + controllerYOffset, z: -6.4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 72, y: -22.4 + controllerYOffset, z: -6.4 },
            { x: 72, y: -28 + controllerYOffset, z: -6.4 },
          ],
          lines: [[0, 1] as [number, number]],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },

        // Center controls
        {
          points: [
            { x: 65.6, y: 3.2 + controllerYOffset, z: 5.6 },
            { x: 78.4, y: 3.2 + controllerYOffset, z: 5.6 },
            { x: 78.4, y: 9.6 + controllerYOffset, z: 5.6 },
            { x: 65.6, y: 9.6 + controllerYOffset, z: 5.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        // Center buttons
        {
          points: Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            return {
              x: 68 + Math.cos(angle) * 2,
              y: 6.4 + controllerYOffset + Math.sin(angle) * 2,
              z: 6.4,
            };
          }),
          lines: Array.from(
            { length: 10 },
            (_, i) => [i, (i + 1) % 10] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            return {
              x: 76 + Math.cos(angle) * 2,
              y: 6.4 + controllerYOffset + Math.sin(angle) * 2,
              z: 6.4,
            };
          }),
          lines: Array.from(
            { length: 10 },
            (_, i) => [i, (i + 1) % 10] as [number, number],
          ),
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },

        // Left grip (curves down and outward)
        {
          points: [
            { x: 34.4, y: 28 + controllerYOffset, z: 4 },
            { x: 30.4, y: 38.4 + controllerYOffset, z: 9.6 },
            { x: 28, y: 49.6 + controllerYOffset, z: 12 },
            { x: 27.2, y: 60.8 + controllerYOffset, z: 11.2 },
            { x: 28.8, y: 70.4 + controllerYOffset, z: 8 },
            { x: 33.6, y: 78.4 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 38.4, y: 29.6 + controllerYOffset, z: 2.4 },
            { x: 36, y: 39.2 + controllerYOffset, z: 6.4 },
            { x: 34.4, y: 49.6 + controllerYOffset, z: 8 },
            { x: 33.6, y: 60.8 + controllerYOffset, z: 7.2 },
            { x: 35.2, y: 69.6 + controllerYOffset, z: 4.8 },
            { x: 38.4, y: 76 + controllerYOffset, z: 1.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 36, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 32, y: 40 + controllerYOffset, z: -12.8 },
            { x: 29.6, y: 51.2 + controllerYOffset, z: -11.2 },
            { x: 28.8, y: 62.4 + controllerYOffset, z: -12 },
            { x: 30.4, y: 72 + controllerYOffset, z: -15.2 },
            { x: 35.2, y: 80 + controllerYOffset, z: -18.4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 40, y: 31.2 + controllerYOffset, z: -16 },
            { x: 37.6, y: 40.8 + controllerYOffset, z: -11.2 },
            { x: 36, y: 51.2 + controllerYOffset, z: -9.6 },
            { x: 35.2, y: 62.4 + controllerYOffset, z: -10.4 },
            { x: 36.8, y: 71.2 + controllerYOffset, z: -13.6 },
            { x: 40, y: 77.6 + controllerYOffset, z: -16.8 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 34.4, y: 28 + controllerYOffset, z: 4 },
            { x: 36, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 30.4, y: 38.4 + controllerYOffset, z: 9.6 },
            { x: 32, y: 40 + controllerYOffset, z: -12.8 },
            { x: 28, y: 49.6 + controllerYOffset, z: 12 },
            { x: 29.6, y: 51.2 + controllerYOffset, z: -11.2 },
            { x: 27.2, y: 60.8 + controllerYOffset, z: 11.2 },
            { x: 28.8, y: 62.4 + controllerYOffset, z: -12 },
            { x: 28.8, y: 70.4 + controllerYOffset, z: 8 },
            { x: 30.4, y: 72 + controllerYOffset, z: -15.2 },
            { x: 33.6, y: 78.4 + controllerYOffset, z: 4 },
            { x: 35.2, y: 80 + controllerYOffset, z: -18.4 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
            [8, 9],
            [10, 11],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 38.4, y: 29.6 + controllerYOffset, z: 2.4 },
            { x: 40, y: 31.2 + controllerYOffset, z: -16 },
            { x: 38.4, y: 76 + controllerYOffset, z: 1.6 },
            { x: 40, y: 77.6 + controllerYOffset, z: -16.8 },
          ],
          lines: [
            [0, 1],
            [2, 3],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },

        // Right grip (curves down and outward)
        {
          points: [
            { x: 109.6, y: 28 + controllerYOffset, z: 4 },
            { x: 113.6, y: 38.4 + controllerYOffset, z: 9.6 },
            { x: 116, y: 49.6 + controllerYOffset, z: 12 },
            { x: 116.8, y: 60.8 + controllerYOffset, z: 11.2 },
            { x: 115.2, y: 70.4 + controllerYOffset, z: 8 },
            { x: 110.4, y: 78.4 + controllerYOffset, z: 4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 105.6, y: 29.6 + controllerYOffset, z: 2.4 },
            { x: 108, y: 39.2 + controllerYOffset, z: 6.4 },
            { x: 109.6, y: 49.6 + controllerYOffset, z: 8 },
            { x: 110.4, y: 60.8 + controllerYOffset, z: 7.2 },
            { x: 108.8, y: 69.6 + controllerYOffset, z: 4.8 },
            { x: 105.6, y: 76 + controllerYOffset, z: 1.6 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 108, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 112, y: 40 + controllerYOffset, z: -12.8 },
            { x: 114.4, y: 51.2 + controllerYOffset, z: -11.2 },
            { x: 115.2, y: 62.4 + controllerYOffset, z: -12 },
            { x: 113.6, y: 72 + controllerYOffset, z: -15.2 },
            { x: 108.8, y: 80 + controllerYOffset, z: -18.4 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 104, y: 31.2 + controllerYOffset, z: -16 },
            { x: 106.4, y: 40.8 + controllerYOffset, z: -11.2 },
            { x: 108, y: 51.2 + controllerYOffset, z: -9.6 },
            { x: 108.8, y: 62.4 + controllerYOffset, z: -10.4 },
            { x: 107.2, y: 71.2 + controllerYOffset, z: -13.6 },
            { x: 104, y: 77.6 + controllerYOffset, z: -16.8 },
          ],
          lines: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 109.6, y: 28 + controllerYOffset, z: 4 },
            { x: 108, y: 29.6 + controllerYOffset, z: -17.6 },
            { x: 113.6, y: 38.4 + controllerYOffset, z: 9.6 },
            { x: 112, y: 40 + controllerYOffset, z: -12.8 },
            { x: 116, y: 49.6 + controllerYOffset, z: 12 },
            { x: 114.4, y: 51.2 + controllerYOffset, z: -11.2 },
            { x: 116.8, y: 60.8 + controllerYOffset, z: 11.2 },
            { x: 115.2, y: 62.4 + controllerYOffset, z: -12 },
            { x: 115.2, y: 70.4 + controllerYOffset, z: 8 },
            { x: 113.6, y: 72 + controllerYOffset, z: -15.2 },
            { x: 110.4, y: 78.4 + controllerYOffset, z: 4 },
            { x: 108.8, y: 80 + controllerYOffset, z: -18.4 },
          ],
          lines: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
            [8, 9],
            [10, 11],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
        {
          points: [
            { x: 105.6, y: 29.6 + controllerYOffset, z: 2.4 },
            { x: 104, y: 31.2 + controllerYOffset, z: -16 },
            { x: 105.6, y: 76 + controllerYOffset, z: 1.6 },
            { x: 104, y: 77.6 + controllerYOffset, z: -16.8 },
          ],
          lines: [
            [0, 1],
            [2, 3],
          ],
          offsetX: 0,
          offsetY: 0,
          offsetDirection: "right",
        },
      ];
    };

    const droneParts = createDroneParts();

    // Project 3D point to 2D with rotation
    const project = (
      point: Point3D,
      rotationY: number,
      offsetX: number,
      offsetY: number,
      partDirection: string,
    ): Point2D => {
      const cos = Math.cos(rotationY);
      const sin = Math.sin(rotationY);

      // Apply horizontal offsets based on part direction
      let adjustedX = point.x;
      if (partDirection === "left") {
        adjustedX += -25; // Move goggles left
      } else if (partDirection === "right") {
        adjustedX += 25; // Move controller right
      }

      // Rotate around Y-axis
      const x = adjustedX * cos + point.z * sin;
      const z = -adjustedX * sin + point.z * cos;
      const y = point.y;

      // Simple perspective projection
      const perspective = 800;
      const projectedScale = perspective / (perspective + z);

      return {
        x: centerX + (x + offsetX) * scale * projectedScale,
        y: centerY + (y + offsetY) * scale * projectedScale,
      };
    };

    // Draw function
    const draw = () => {
      if (!canvas || !ctx) return;

      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const scrollHeight =
        container.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(
        scrollTop / scrollHeight,
        1,
      );

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate rotation (0 to 180 degrees)
      const rotationY = scrollProgress * Math.PI + Math.PI;

      // Calculate fragmentation (starts at 50% progress, which is 180°)
      const fragmentStart = 0.5;
      const fragmentProgress = Math.max(
        0,
        (scrollProgress - fragmentStart) / (1 - fragmentStart),
      );

      // Draw each part
      droneParts.forEach((part) => {
        let offsetX = 0;
        let offsetY = 0;

        // Calculate offset based on direction
        if (part.offsetDirection === "up") {
          offsetY = -fragmentProgress * 900; // Up and out
          offsetX = fragmentProgress * 100; // Slight drift
        } else if (part.offsetDirection === "left") {
          offsetX = -fragmentProgress * 800; // Left
        } else if (part.offsetDirection === "right") {
          offsetX = fragmentProgress * 800; // Right
        }

        part.offsetX = offsetX;
        part.offsetY = offsetY;

        // Calculate opacity (fade out during fragmentation)
        const opacity = 1 - fragmentProgress;

        if (opacity <= 0) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Project all points
        const projectedPoints = part.points.map((p) =>
          project(
            p,
            rotationY,
            offsetX,
            offsetY,
            part.offsetDirection,
          ),
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
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: "400vh" }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen"
        style={{ background: "#000000" }}
      />
    </div>
  );
}