/**
 * Composition event handler
 *
 * Captures IME composition events for Japanese, Chinese, and other complex input methods.
 */

import type { HrefCompositionEvent } from '../../core/types.js';

export class CompositionHandler {
  private startTime: number;
  private onEvent: (event: HrefCompositionEvent) => void;

  constructor(startTime: number, onEvent: (event: HrefCompositionEvent) => void) {
    this.startTime = startTime;
    this.onEvent = onEvent;
  }

  /**
   * Handle compositionstart event
   */
  handleCompositionStart = (event: CompositionEvent): void => {
    const pos = this.getCursorPosition(event.target);

    const hrefEvent: HrefCompositionEvent = {
      time: Date.now() - this.startTime,
      type: 'compositionstart',
      ...(pos !== undefined && { pos }),
      ...(event.data && { data: event.data }),
    };

    this.onEvent(hrefEvent);
  };

  /**
   * Handle compositionupdate event
   */
  handleCompositionUpdate = (event: CompositionEvent): void => {
    const pos = this.getCursorPosition(event.target);
    const segments = this.extractSegments(event.target);

    const hrefEvent: HrefCompositionEvent = {
      time: Date.now() - this.startTime,
      type: 'compositionupdate',
      ...(pos !== undefined && { pos }),
      ...(event.data && { data: event.data }),
      ...(segments && segments.length > 0 && { segments }),
    };

    this.onEvent(hrefEvent);
  };

  /**
   * Handle compositionend event
   */
  handleCompositionEnd = (event: CompositionEvent): void => {
    const pos = this.getCursorPosition(event.target);

    const hrefEvent: HrefCompositionEvent = {
      time: Date.now() - this.startTime,
      type: 'compositionend',
      ...(pos !== undefined && { pos }),
      ...(event.data && { data: event.data }),
    };

    this.onEvent(hrefEvent);
  };

  /**
   * Extract composition segments (experimental)
   *
   * This attempts to extract segment information from the composition,
   * but browser support is limited.
   */
  private extractSegments(target: EventTarget | null): Array<{ text: string; highlight?: boolean }> | undefined {
    if (!target) return undefined;

    // Check if the browser supports EditContext API (experimental)
    // For now, we'll return undefined as this requires more advanced implementation
    // In a future version, we could use:
    // - EditContext API (Chrome/Edge experimental)
    // - Text Input Processor (Firefox)
    // - Custom IME detection logic

    return undefined;
  }

  /**
   * Get cursor position from the event target
   */
  private getCursorPosition(target: EventTarget | null): number | undefined {
    if (!target) return undefined;

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return target.selectionStart ?? undefined;
    }

    // For contenteditable elements
    if (target instanceof HTMLElement && target.isContentEditable) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return undefined;

      const range = selection.getRangeAt(0);
      return range.startOffset;
    }

    return undefined;
  }

  /**
   * Attach event listeners to target element
   */
  attach(target: HTMLElement | Document = document): void {
    target.addEventListener('compositionstart', this.handleCompositionStart as EventListener);
    target.addEventListener('compositionupdate', this.handleCompositionUpdate as EventListener);
    target.addEventListener('compositionend', this.handleCompositionEnd as EventListener);
  }

  /**
   * Detach event listeners from target element
   */
  detach(target: HTMLElement | Document = document): void {
    target.removeEventListener('compositionstart', this.handleCompositionStart as EventListener);
    target.removeEventListener('compositionupdate', this.handleCompositionUpdate as EventListener);
    target.removeEventListener('compositionend', this.handleCompositionEnd as EventListener);
  }
}
