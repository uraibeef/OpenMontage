import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook, gateWeave } from "../beggar/FilmLook";
import { NotificationBanner, Bubble, SystemPill, UI_LEFT, UI_WIDTH } from "./ChatUI";
import type { OverlaySpec, Scene as SceneConfig } from "./constants";
import { HEIGHT, PALETTE, WIDTH } from "./constants";
import {
  AdminHistory,
  CallWave,
  CctvFrame,
  EvidenceWall,
  FinalTyping,
  JoinButton,
  LaughCount,
  LockedBadge,
  ProfileCard,
  SettingsPanel,
  SlowTyping,
  VoteConsole,
} from "./Evidence";

/**
 * One scene: a photoreal plate under a measured push, graded into the series
 * palette, with its evidence overlay on top.
 *
 * The motion rule from the art direction is enforced here: the plate only ever
 * pushes slowly, and the only aggressive motion in the frame belongs to the UI.
 */

const SAFE_OVERSCAN = 1.06;

export const Scene: React.FC<{ scene: SceneConfig; durationInFrames: number }> = ({ scene, durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = durationInFrames <= 1 ? 0 : frame / (durationInFrames - 1);
  const zoom = interpolate(progress, [0, 1], scene.zoom);
  const driftY = interpolate(progress, [0, 1], [0, scene.driftY ?? 0]);
  const weave = scene.cctv ? { x: 0, y: 0 } : gateWeave(frame);
  const fade = scene.fadeOut
    ? interpolate(frame, [durationInFrames - scene.fadeOut * 30, durationInFrames - 1], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <AbsoluteFill
          style={{
            transform: `translate(${weave.x}px, ${driftY + weave.y}px) scale(${zoom * SAFE_OVERSCAN})`,
            filter: scene.blur ? `blur(${scene.blur}px) brightness(0.62)` : undefined,
          }}
        >
          <Img src={staticFile(scene.plate)} style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }} />
        </AbsoluteFill>

        {scene.cctv ? null : <FilmLook />}
        {scene.overlay ? <Overlay spec={scene.overlay} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Overlay: React.FC<{ spec: OverlaySpec }> = ({ spec }) => {
  switch (spec.kind) {
    case "notification":
      return <NotificationBanner {...spec} />;
    case "chat":
      return (
        <div style={{ position: "absolute", left: UI_LEFT, top: 520, width: UI_WIDTH }}>
          {spec.messages.map((message) => (
            <Bubble key={`${message.sender}-${message.at}`} {...message} />
          ))}
        </div>
      );
    case "system":
      return <SystemPill text={spec.text} highlight={spec.highlight} appearAt={spec.appearAt} />;
    case "settings":
      return <SettingsPanel appearAt={spec.appearAt} />;
    case "cctv":
      return <CctvFrame label={spec.label} startClock={spec.startClock} reverseSecondsAt={spec.reverseSecondsAt} nowClock={spec.nowClock} />;
    case "vote":
      return <VoteConsole message={spec.message} messageAt={spec.messageAt} buttonsAt={spec.buttonsAt} />;
    case "laughCount":
      return <LaughCount steps={spec.steps} />;
    case "locked":
      return <LockedBadge appearAt={spec.appearAt} />;
    case "slowTyping":
      return (
        <>
          {spec.cctv ? <CctvFrame label={spec.cctv.label} startClock={spec.cctv.startClock} /> : null}
          <SlowTyping sender={spec.sender} text={spec.text} startAt={spec.startAt} endAt={spec.endAt} />
        </>
      );
    case "joinButton":
      return <JoinButton pressAt={spec.pressAt} />;
    case "callWave":
      return <CallWave dieAt={spec.dieAt} />;
    case "evidenceWall":
      return <EvidenceWall appearAt={spec.appearAt} />;
    case "adminHistory":
      return <AdminHistory appearAt={spec.appearAt} />;
    case "profileCard":
      return <ProfileCard name={spec.name} message={spec.message} messageAt={spec.messageAt} />;
    case "finalTyping":
      return <FinalTyping postAt={spec.postAt} laughAt={spec.laughAt} typingAt={spec.typingAt} />;
  }
};
