/**
 * HREF - High-Resolution Edit Format
 *
 * A comprehensive event capture and replay system for text editing interactions.
 */

// Recorder
export { HrefRecorder } from './recorder/HrefRecorder.js';
export type { RecorderOptions } from './recorder/HrefRecorder.js';

// Player
export { HrefPlayer } from './player/HrefPlayer.js';
export { PlaybackEngine } from './player/engine.js';
export { StateReconstructor } from './player/state.js';
export { TextViewer } from './player/viewer.js';
export type { PlayerOptions, PlayerState } from './player/HrefPlayer.js';
export type { TextState } from './player/state.js';
export type { ViewerOptions } from './player/viewer.js';

// Core types
export type * from './core/types.js';
