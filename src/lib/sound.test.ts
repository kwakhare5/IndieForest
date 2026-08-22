import { describe, it, expect, beforeEach } from "vitest";
import { sound } from "./sound";

describe("SoundEngine", () => {
  beforeEach(() => {
    sound.setMuted(false);
    sound.stopCampfireAmbiance();
  });

  it("handles mute toggling properly", () => {
    expect(sound.getMuted()).toBe(false);
    const muted = sound.toggleMute();
    expect(muted).toBe(true);
    expect(sound.getMuted()).toBe(true);

    sound.setMuted(false);
    expect(sound.getMuted()).toBe(false);
  });

  it("safely triggers sound methods in headless environment without crashing", () => {
    expect(() => {
      sound.playClick();
      sound.playCoin();
      sound.playPlantTree();
      sound.playShipSuccess();
      sound.playLevelUp();
    }).not.toThrow();
  });

  it("handles campfire ambiance toggle without errors", () => {
    expect(() => {
      sound.toggleCampfireAmbiance();
      sound.stopCampfireAmbiance();
    }).not.toThrow();
  });
});
