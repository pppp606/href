/**
 * HrefPlayer
 *
 * Main class for replaying editing events.
 */

import type { HrefDocument } from '../core/types.js';
import { PlaybackEngine } from './engine.js';
import { StateReconstructor } from './state.js';
import { TextViewer } from './viewer.js';
import type { TextState } from './state.js';

export interface PlayerOptions {
  /** Container element for visualization */
  container?: HTMLElement;
  /** Playback speed multiplier (default: 1.0) */
  speed?: number;
  /** Auto-play on initialization */
  autoPlay?: boolean;
  /** Show selection in visualization */
  showSelection?: boolean;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  textState: TextState;
}

export class HrefPlayer {
  private document: HrefDocument | null = null;
  private engine: PlaybackEngine;
  private stateReconstructor: StateReconstructor;
  private viewer: TextViewer | null = null;

  constructor(options: PlayerOptions = {}) {
    this.engine = new PlaybackEngine({
      speed: options.speed ?? 1.0,
    });

    this.stateReconstructor = new StateReconstructor();

    // Set up event handler
    this.engine.onEvent((event) => {
      this.stateReconstructor.applyEvent(event);
      if (this.viewer) {
        this.viewer.render(this.stateReconstructor.getState());
      }
    });

    // Set up viewer if container provided
    if (options.container) {
      this.viewer = new TextViewer({
        container: options.container,
        showSelection: options.showSelection ?? true,
      });
    }
  }

  /**
   * Load an HREF document
   */
  load(document: HrefDocument): void {
    this.document = document;
    this.engine.loadEvents(document.events);
    this.stateReconstructor.reset(document.initial_text);

    if (this.viewer) {
      this.viewer.render(this.stateReconstructor.getState());
    }
  }

  /**
   * Load from JSON string
   */
  loadJSON(json: string): void {
    const document = JSON.parse(json) as HrefDocument;
    this.load(document);
  }

  /**
   * Start playback
   */
  play(): void {
    if (!this.document) {
      throw new Error('No document loaded');
    }
    this.engine.play();
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.engine.pause();
  }

  /**
   * Stop playback and reset
   */
  stop(): void {
    this.engine.stop();
    if (this.document) {
      this.stateReconstructor.reset(this.document.initial_text);
      if (this.viewer) {
        this.viewer.render(this.stateReconstructor.getState());
      }
    }
  }

  /**
   * Seek to specific time (in milliseconds)
   */
  seek(time: number): void {
    if (!this.document) {
      throw new Error('No document loaded');
    }

    // Reset state
    this.stateReconstructor.reset(this.document.initial_text);

    // Seek engine
    this.engine.seek(time);

    // Render current state
    if (this.viewer) {
      this.viewer.render(this.stateReconstructor.getState());
    }
  }

  /**
   * Set playback speed
   */
  setSpeed(speed: number): void {
    this.engine.setSpeed(speed);
  }

  /**
   * Get current player state
   */
  getState(): PlayerState {
    return {
      isPlaying: this.engine.getIsPlaying(),
      currentTime: this.engine.getCurrentTime(),
      duration: this.engine.getDuration(),
      speed: this.engine.getSpeed(),
      textState: this.stateReconstructor.getState(),
    };
  }

  /**
   * Get current text state
   */
  getTextState(): TextState {
    return this.stateReconstructor.getState();
  }

  /**
   * Attach viewer to container
   */
  attachViewer(container: HTMLElement, options?: { showSelection?: boolean }): void {
    this.viewer = new TextViewer({
      container,
      showSelection: options?.showSelection ?? true,
    });

    // Render current state
    this.viewer.render(this.stateReconstructor.getState());
  }

  /**
   * Detach viewer
   */
  detachViewer(): void {
    if (this.viewer) {
      this.viewer.clear();
      this.viewer = null;
    }
  }
}
