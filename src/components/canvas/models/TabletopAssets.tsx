import React, { useMemo } from "react";
import * as THREE from "three";

// Colors from reference image
export const TColors = {
  grass: "#8BC34A",
  grassLight: "#9CCC65",
  pine: "#2E7D32",
  pineDark: "#1B5E20",
  deciduous: "#7CB342",
  trunk: "#5D4037",
  dirt: "#D7CCC8",
  path: "#E7C28F", // warm sand/dirt path
  rockLight: "#B0BEC5",
  rockDark: "#78909C",
  mountainBase: "#8D6E63",
  mountainSnow: "#ECEFF1",
  woodLight: "#A1887F",
  woodDark: "#5D4037",
  water: "#64B5F6",
  roof: "#8D6E63",
  underbellyDirt: "#8D6E63",
  underbellyRock: "#455A64",
};

// --- FLORA ---

export function PineTree({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Trunk */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 5]} />
        <meshStandardMaterial color={TColors.trunk} flatShading />
      </mesh>
      {/* Foliage Tiers */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.45, 0.8, 6]} />
        <meshStandardMaterial color={TColors.pine} flatShading />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.35, 0.7, 6]} />
        <meshStandardMaterial color={TColors.pine} flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.25, 0.6, 6]} />
        <meshStandardMaterial color={TColors.pine} flatShading />
      </mesh>
    </group>
  );
}

export function DeciduousTree({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.6, 5]} />
        <meshStandardMaterial color={TColors.trunk} flatShading />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={TColors.deciduous} flatShading />
      </mesh>
    </group>
  );
}

// --- ROCKS & MOUNTAINS ---

export function Rock({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], color = TColors.rockLight }: any) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

export function Mountain({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 3, 6]} />
        <meshStandardMaterial color={TColors.rockDark} flatShading />
      </mesh>
      {/* Snow Cap (intersecting cone) */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.7, 1.4, 6]} />
        <meshStandardMaterial color={TColors.mountainSnow} flatShading />
      </mesh>
    </group>
  );
}

// --- STRUCTURES ---

export function Cabin({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Main Box */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.0]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      {/* Pitched Roof */}
      <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 1.3, 4]} />
        <meshStandardMaterial color={TColors.roof} flatShading />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.4, 1.2, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={TColors.rockLight} flatShading />
      </mesh>
      {/* Porch */}
      <mesh position={[0, 0.05, 0.6]} receiveShadow>
        <boxGeometry args={[1.2, 0.1, 0.4]} />
        <meshStandardMaterial color={TColors.woodLight} flatShading />
      </mesh>
      {/* Porch Pillars */}
      <mesh position={[-0.5, 0.4, 0.7]} castShadow>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[0.5, 0.4, 0.7]} castShadow>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
    </group>
  );
}

export function Campfire({ position = [0, 0, 0], scale = 1 }: any) {
  return (
    <group position={position} scale={scale}>
      {/* Stone Ring */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 4) * 0.3, 0.05, Math.sin((i * Math.PI) / 4) * 0.3]} castShadow>
          <dodecahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color={TColors.rockLight} flatShading />
        </mesh>
      ))}
      {/* Logs */}
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
        <meshStandardMaterial color={TColors.trunk} flatShading />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
        <meshStandardMaterial color={TColors.trunk} flatShading />
      </mesh>
      {/* Fire */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial color="#FFB300" emissive="#FFB300" emissiveIntensity={1} flatShading />
      </mesh>
      <pointLight position={[0, 0.4, 0]} color="#FFD54F" intensity={2} distance={3} />
    </group>
  );
}

export function RiverBridge({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: any) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Arching Deck */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 0.6]} />
        <meshStandardMaterial color={TColors.woodLight} flatShading />
      </mesh>
      {/* Rails */}
      <mesh position={[0, 0.4, 0.25]} castShadow>
        <boxGeometry args={[1.8, 0.05, 0.05]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[0, 0.4, -0.25]} castShadow>
        <boxGeometry args={[1.8, 0.05, 0.05]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      {/* Posts */}
      {[-0.8, -0.3, 0.3, 0.8].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.15, 0.25]} castShadow>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color={TColors.woodDark} flatShading />
          </mesh>
          <mesh position={[x, 0.15, -0.25]} castShadow>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color={TColors.woodDark} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Farmstead({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Barn */}
      <mesh position={[-0.8, 0.3, -0.5]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.8]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[-0.8, 0.8, -0.5]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.7, 0.6, 4]} />
        <meshStandardMaterial color={TColors.roof} flatShading />
      </mesh>
      
      {/* Crops */}
      <group position={[0.5, 0.02, 0.2]}>
        {[0, 1, 2, 3].map((row) => (
          <group key={`row-${row}`} position={[0, 0, row * 0.3]}>
            <mesh position={[0, 0, 0]} receiveShadow>
              <boxGeometry args={[1.4, 0.05, 0.2]} />
              <meshStandardMaterial color={TColors.dirt} flatShading />
            </mesh>
            {[...Array(5)].map((_, col) => (
              <mesh key={`crop-${col}`} position={[-0.55 + col * 0.27, 0.08, 0]} castShadow>
                <coneGeometry args={[0.06, 0.15, 4]} />
                <meshStandardMaterial color={TColors.grassLight} flatShading />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

export function MineComplex({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Cave Entrance Arch */}
      <mesh position={[-0.4, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[0.4, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[1.0, 0.1, 0.1]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      {/* Dark Hole */}
      <mesh position={[0, 0.4, -0.05]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

export function PierAndBoat({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Pier */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color={TColors.woodLight} flatShading />
      </mesh>
      {/* Posts */}
      <mesh position={[-0.5, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[0.5, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[-0.5, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      <mesh position={[0.5, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
        <meshStandardMaterial color={TColors.woodDark} flatShading />
      </mesh>
      
      {/* Rowboat */}
      <group position={[1.0, 0.05, 0.5]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.3]} />
          <meshStandardMaterial color={TColors.woodDark} flatShading />
        </mesh>
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.2]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
      </group>
    </group>
  );
}
