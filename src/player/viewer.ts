/**
 * Text Viewer
 *
 * Renders text content with cursor and selection visualization.
 */

import type { TextState } from './state.js';

export interface ViewerOptions {
  container: HTMLElement;
  showSelection?: boolean;
}

export class TextViewer {
  private container: HTMLElement;
  private textElement: HTMLElement;
  private showSelection: boolean;

  constructor(options: ViewerOptions) {
    this.container = options.container;
    this.showSelection = options.showSelection ?? true;

    this.setupDOM();
    this.textElement = this.container.querySelector('.href-viewer-text')!;
  }

  /**
   * Set up DOM structure
   */
  private setupDOM(): void {
    this.container.innerHTML = '';
    this.container.className = 'href-viewer';
    this.container.style.position = 'relative';
    this.container.style.fontFamily = 'monospace';
    this.container.style.fontSize = '14px';
    this.container.style.lineHeight = '1.6';
    this.container.style.padding = '1rem';
    this.container.style.border = '1px solid #888';
    this.container.style.borderRadius = '6px';
    this.container.style.background = '#fff';
    this.container.style.minHeight = '300px';
    this.container.style.whiteSpace = 'pre-wrap';
    this.container.style.wordBreak = 'break-word';
    this.container.style.overflowWrap = 'break-word';

    // Text content
    const textElement = document.createElement('div');
    textElement.className = 'href-viewer-text';
    textElement.style.position = 'relative';
    this.container.appendChild(textElement);

    // Add selection styles
    if (!document.getElementById('href-viewer-styles')) {
      const style = document.createElement('style');
      style.id = 'href-viewer-styles';
      style.textContent = `
        .href-viewer-selection {
          background: rgba(0, 0, 0, 0.2);
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Render text state
   */
  render(state: TextState): void {
    const { text, selectionStart, selectionEnd } = state;

    // Clear previous content
    this.textElement.innerHTML = '';

    if (text.length === 0) {
      this.textElement.textContent = '';
      return;
    }

    // Render text with selection
    if (this.showSelection && selectionStart !== selectionEnd) {
      this.renderTextWithSelection(text, selectionStart, selectionEnd);
    } else {
      this.textElement.textContent = text;
    }
  }

  /**
   * Render text with selection highlight
   */
  private renderTextWithSelection(text: string, start: number, end: number): void {
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const beforeNode = document.createTextNode(before);
    const selectedNode = document.createElement('span');
    selectedNode.className = 'href-viewer-selection';
    selectedNode.textContent = selected;
    const afterNode = document.createTextNode(after);

    this.textElement.appendChild(beforeNode);
    this.textElement.appendChild(selectedNode);
    this.textElement.appendChild(afterNode);
  }

  /**
   * Clear the viewer
   */
  clear(): void {
    this.textElement.textContent = '';
  }
}
