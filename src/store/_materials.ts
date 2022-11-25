import type { IMaterial } from "../../typings/types.ts";
import { channelPercentage } from "../_utils.ts";
export const materials: IMaterial[] = [
  {
    name: { en_US: "Plastic" },
    label: "rough",
    normal: "brick_normal",
    sound: "note.snare",
    friction: (idx: number) => Math.min(0.9, Math.max(0.1, idx * 0.01)),
    minimumLevel: 50,
    maximumLevel: 100,
    endStep: 100,
    step: 25,
    explosionResistance: (idx: number) => Math.min(1, Math.max(0, idx * 0.1)),
    lightAbsorption: (_itr: number) => 15,
    lightEmission: () => 0,
    metalness: () => 0,
    emissive: () => 0,
    roughness: (idx: number) => channelPercentage(100 - idx),
    opacity: () => 1,
    shading: [
      {
        texture: "plastic_soft-light",
        blend: "soft-light",
      },
      {
        blend: "multiply",
        texture: "plastic_multiply",
      },
    ],
  },
  {
    name: { en_US: "Metallic" },
    label: "metal",
    normal: "brick_normal",
    sound: "note.iron_xylophone",
    friction: (idx: number) => Math.min(0.5, Math.max(0.001, idx * 0.1)),
    minimumLevel: 50,
    maximumLevel: 100,
    endStep: 100,
    step: 25,
    explosionResistance: (idx: number) => Math.min(1, Math.max(0, idx * 0.01)),
    lightAbsorption: (itr: number) =>
      Math.min(15, Math.max(0, 15 * (itr / 100))),
    lightEmission: () => 0,
    metalness: (idx: number) => channelPercentage(idx),
    emissive: () => 0,
    roughness: () => 0,
    opacity: () => 1,
    shading: [
      {
        blend: "overlay",
        texture: "metal_overlay",
      },
      {
        blend: "overlay",
        texture: "metal_reflectivity",
      },
    ],
  },
  {
    name: { en_US: "Glowing" },
    label: "emissive",
    normal: "block_normal",
    sound: "chime.amethyst_block",
    friction: (idx: number) => Math.min(0.3, Math.max(0.01, idx * 0.1)),
    minimumLevel: 0,
    maximumLevel: 100,
    endStep: 100,
    step: 25,
    explosionResistance: (idx: number) => Math.min(1, Math.max(0, idx * 0.1)),
    lightAbsorption: (_itr: number) => 10,
    lightEmission: (itr: number) =>
      Math.max(0, Math.min(15, Math.round(itr * 0.9))),
    metalness: () => 0,
    emissive: (idx: number) =>
      Math.min(99, Math.floor(channelPercentage(idx) * 0.9)),
    roughness: () => 0,
    opacity: () => 1,
    shading: [{
      blend: "lighter",
      texture: "glowing",
    }],
  },
  {
    name: { en_US: "Glass" },
    label: "glass",
    normal: "block_normal",
    sound: "glass",
    friction: () => 0.2,
    minimumLevel: 40,
    maximumLevel: 80,
    endStep: 90,
    step: 20,
    explosionResistance: () => 0,
    lightAbsorption: () => 1,
    lightEmission: () => 0,
    metalness: () => 0,
    emissive: () => 0,
    roughness: () => 30,
    opacity: (itr: number) => Math.min(0.66, Math.max(0.499, itr * 0.1)),
    shading: [{
      blend: "multiply",
      texture: "glass",
    }],
  },
  {
    name: { en_US: "Glass Pane" },
    label: "glass_pane",
    normal: "block_normal",
    sound: "glass",
    geometry: "pane",
    friction: () => 0.2,
    minimumLevel: 45,
    maximumLevel: 55,
    endStep: 90,
    step: 5,
    explosionResistance: () => 0,
    lightAbsorption: () => 1,
    lightEmission: () => 0,
    metalness: () => 0,
    emissive: () => 0,
    roughness: () => 25,
    opacity: (itr: number) => Math.min(0.65, Math.max(0.499, itr * 0.01)),
    shading: [{
      blend: "multiply",
      texture: "glass",
    }],
  },
  // {
  //   name: { en_US: "Dot" },
  //   label: "dot",
  //   normal: "dot_normal",
  //   sound: "pop",
  //   friction: () => 0.5,
  //   minimumLevel: 0,
  //   maximumLevel: 100,
  //   endStep: 100,
  //   step: 25,
  //   explosionResistance: () => 1,
  //   lightAbsorption: () => 15,
  //   lightEmission: () => 0,
  //   metalness: () => 0,
  //   emissive: () => 0,
  //   roughness: () => 0,
  //   opacity: () => 1,
  // }
];
