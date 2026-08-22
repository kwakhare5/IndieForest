"use client";

import React from "react";
import { Billboard, Text } from "@react-three/drei";
import { ConiferTree } from "@/components/canvas/models/ConiferTree";
import { DeciduousTree } from "@/components/canvas/models/DeciduousTree";
import { LogCabin } from "@/components/canvas/models/LogCabin";
import { CanvasTent } from "@/components/canvas/models/CanvasTent";
import { Campfire } from "@/components/canvas/models/Campfire";
import { CampDog } from "@/components/canvas/models/CampDog";
import { RobinBird } from "@/components/canvas/models/RobinBird";
import { Flagpole } from "@/components/canvas/models/Flagpole";
import { ZenStump } from "@/components/canvas/models/ZenStump";
import { Windmill } from "@/components/canvas/models/Windmill";
import { HarborPier } from "@/components/canvas/models/HarborPier";
import { Lighthouse } from "@/components/canvas/models/Lighthouse";

interface ShowroomCatalogProps {
  isNight?: boolean;
  wireframe?: boolean;
}

function SubtleLabel({
  text,
  y,
  isNight = false,
}: {
  text: string;
  y: number;
  isNight?: boolean;
}) {
  return (
    <Billboard position={[0, y, 0]} follow lockX={false} lockY={false} lockZ={false}>
      <Text
        fontSize={0.22}
        color={isNight ? "#f5f5f4" : "#1c1917"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isNight ? "#000000" : "#ffffff"}
      >
        {text}
      </Text>
    </Billboard>
  );
}

function Pedestal({
  position,
  children,
  radius = 0.95,
  label,
  labelY,
  isNight = false,
  wireframe = false,
}: {
  position: [number, number, number];
  children: React.ReactNode;
  radius?: number;
  label?: string;
  labelY?: number;
  isNight?: boolean;
  wireframe?: boolean;
}) {
  return (
    <group position={position}>
      {/* 8-Sided Tactile Pedestal Block */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.08, 0.16, 8]} />
        <meshStandardMaterial
          color={isNight ? "#1e293b" : "#f5f5f4"}
          roughness={0.8}
          metalness={0.05}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
      {/* Top Porcelain Rim Ring */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.85, radius * 0.98, 8]} />
        <meshBasicMaterial
          color={isNight ? "#334155" : "#e7e5e4"}
          transparent
          opacity={0.8}
          wireframe={wireframe}
        />
      </mesh>
      {/* Mounted 3D Asset */}
      <group position={[0, 0.16, 0]}>{children}</group>
      {/* Hover Floating Billboard Label */}
      {label && <SubtleLabel text={label} y={labelY || 1.6} isNight={isNight} />}
    </group>
  );
}

export function ShowroomCatalog({ isNight = false, wireframe = false }: ShowroomCatalogProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* ROW 1: GITHUB ALPINE CONIFER LINEAGE */}
      <group position={[0, 0, -5.5]}>
        <Pedestal position={[-4.5, 0, 0]} label="Stage 1: Crop Sprout" labelY={1.1} isNight={isNight} wireframe={wireframe}>
          <ConiferTree tier="sapling" />
        </Pedestal>
        <Pedestal position={[-1.5, 0, 0]} label="Stage 2: Young Pine" labelY={1.5} isNight={isNight} wireframe={wireframe}>
          <ConiferTree tier="young" />
        </Pedestal>
        <Pedestal position={[1.5, 0, 0]} label="Stage 3: Mountain Cedar" labelY={2.1} isNight={isNight} wireframe={wireframe}>
          <ConiferTree tier="mature" />
        </Pedestal>
        <Pedestal position={[4.5, 0, 0]} label="Stage 4: Majestic Pine" labelY={2.7} isNight={isNight} wireframe={wireframe}>
          <ConiferTree tier="majestic" />
        </Pedestal>
      </group>

      {/* ROW 2: STRIPE REVENUE GOLDEN MONEY OAK LINEAGE */}
      <group position={[0, 0, -2.5]}>
        <Pedestal position={[-4.5, 0, 0]} label="Stage 1: Gold Sprout" labelY={1.1} isNight={isNight} wireframe={wireframe}>
          <DeciduousTree tier="sapling" />
        </Pedestal>
        <Pedestal position={[-1.5, 0, 0]} label="Stage 2: Golden Ginkgo" labelY={1.5} isNight={isNight} wireframe={wireframe}>
          <DeciduousTree tier="young" />
        </Pedestal>
        <Pedestal position={[1.5, 0, 0]} label="Stage 3: Golden Oak" labelY={2.1} isNight={isNight} wireframe={wireframe}>
          <DeciduousTree tier="mature" />
        </Pedestal>
        <Pedestal position={[4.5, 0, 0]} label="Stage 4: Solar Money Oak" labelY={2.7} isNight={isNight} wireframe={wireframe}>
          <DeciduousTree tier="majestic" />
        </Pedestal>
      </group>

      {/* ROW 3: ELITE MONUMENT ARCHITECTURE */}
      <group position={[0, 0, 0.5]}>
        <Pedestal position={[-4.5, 0, 0]} label="War Room Cabin" labelY={1.8} isNight={isNight} wireframe={wireframe}>
          <LogCabin isNight={isNight} />
        </Pedestal>
        <Pedestal position={[-1.5, 0, 0]} label="Alpine Windmill" labelY={2.8} isNight={isNight} wireframe={wireframe}>
          <Windmill isNight={isNight} />
        </Pedestal>
        <Pedestal position={[1.5, 0, 0]} label="Harbor Pier & Boat" labelY={1.2} isNight={isNight} wireframe={wireframe}>
          <HarborPier isNight={isNight} />
        </Pedestal>
        <Pedestal position={[4.5, 0, 0]} label="Coast Lighthouse" labelY={3.5} isNight={isNight} wireframe={wireframe}>
          <Lighthouse isNight={isNight} />
        </Pedestal>
      </group>

      {/* ROW 4: CAMPSITE & RETREAT PROPS */}
      <group position={[0, 0, 3.5]}>
        <Pedestal position={[-4.5, 0, 0]} label="Focus Campfire" labelY={1.4} isNight={isNight} wireframe={wireframe}>
          <Campfire isNight={isNight} />
        </Pedestal>
        <Pedestal position={[-1.5, 0, 0]} label="Sabbatical Tent" labelY={1.6} isNight={isNight} wireframe={wireframe}>
          <CanvasTent />
        </Pedestal>
        <Pedestal position={[1.5, 0, 0]} label="Zen Sabbatical Stump" labelY={1.2} isNight={isNight} wireframe={wireframe}>
          <ZenStump />
        </Pedestal>
        <Pedestal position={[4.5, 0, 0]} label="Streak Flagpole" labelY={2.6} isNight={isNight} wireframe={wireframe}>
          <Flagpole />
        </Pedestal>
      </group>

      {/* ROW 5: LIVING WILDLIFE */}
      <group position={[0, 0, 6.0]}>
        <Pedestal position={[-1.5, 0, 0]} label="Robin Bird" labelY={1.2} isNight={isNight} wireframe={wireframe}>
          <RobinBird />
        </Pedestal>
        <Pedestal position={[1.5, 0, 0]} label="Camp Golden Companion" labelY={1.4} isNight={isNight} wireframe={wireframe}>
          <CampDog interactive />
        </Pedestal>
      </group>
    </group>
  );
}
