import React from "react";
import {Composition} from "remotion";
import {Example01WalkingStickman, EXAMPLE01_FRAMES} from "./scenes/Example01WalkingStickman";
import {Example02OfficeScene, EXAMPLE02_FRAMES} from "./scenes/Example02OfficeScene";
import {Example03MiniDocumentary, EXAMPLE03_FRAMES} from "./scenes/Example03MiniDocumentary";
import {FPS, H, W} from "./styles/palette";

// One composition per example. Render with: npx remotion render src/index.ts <Id> out/<name>.mp4
export const Root: React.FC = () => (
  <>
    <Composition id="Example01-WalkingStickman" component={Example01WalkingStickman} durationInFrames={EXAMPLE01_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Example02-OfficeScene" component={Example02OfficeScene} durationInFrames={EXAMPLE02_FRAMES} fps={FPS} width={W} height={H} />
    <Composition
      id="Example03-MiniDocumentary"
      component={Example03MiniDocumentary}
      durationInFrames={EXAMPLE03_FRAMES}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{narration: undefined}}
    />
  </>
);
