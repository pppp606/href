/**
 * Kakiato type definitions.
 *
 * These interfaces define the Kakiato document format v0.1 and are
 * shared across recorder and player implementations.
 */

export type HrefVersion = "0.1";

type KnownHrefDevice = "desktop" | "mobile" | "tablet";

export interface HrefSessionMeta {
  id: string;
  user_agent: string;
  lang: string;
  device: KnownHrefDevice | (string & {});
  source: string;
  meta?: Record<string, unknown>;
}

export interface HrefModifiers {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
  [modifier: string]: boolean | undefined;
}

export interface HrefEventBase {
  time: number;
  type: HrefEventType;
  pos?: number;
  meta?: Record<string, unknown>;
}

export type HrefEventType =
  | "keydown"
  | "keyup"
  | "beforeinput"
  | "input"
  | "compositionstart"
  | "compositionupdate"
  | "compositionend"
  | "selectionchange"
  | "focus"
  | "blur"
  | "custom";

export interface HrefKeyboardEvent extends HrefEventBase {
  type: "keydown" | "keyup";
  key: string;
  code: string;
  modifiers?: HrefModifiers;
}

export interface HrefInputEvent extends HrefEventBase {
  type: "beforeinput" | "input";
  inputType: string;
  data?: string | null;
  text?: string | null;
  modifiers?: HrefModifiers;
}

export interface HrefCompositionSegment {
  text: string;
  highlight?: boolean;
}

export interface HrefCompositionEvent extends HrefEventBase {
  type: "compositionstart" | "compositionupdate" | "compositionend";
  data?: string;
  segments?: HrefCompositionSegment[];
}

export interface HrefSelectionPosition {
  index: number;
  affinity?: "forward" | "backward" | "none";
}

export interface HrefSelectionChangeEvent extends HrefEventBase {
  type: "selectionchange";
  anchor: HrefSelectionPosition;
  focus: HrefSelectionPosition;
}

export interface HrefFocusEvent extends HrefEventBase {
  type: "focus" | "blur";
}

export interface HrefCustomEvent extends HrefEventBase {
  type: "custom";
  label: string;
  payload?: Record<string, unknown>;
}

export type HrefEvent =
  | HrefKeyboardEvent
  | HrefInputEvent
  | HrefCompositionEvent
  | HrefSelectionChangeEvent
  | HrefFocusEvent
  | HrefCustomEvent;

export interface HrefDocument {
  version: HrefVersion;
  session: HrefSessionMeta;
  initial_text: string;
  events: HrefEvent[];
}

