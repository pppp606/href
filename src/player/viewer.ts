/**
 * Text Viewer
 *
 * Renders text content with cursor and selection visualization.
 */

import type { TextState } from './state.js';

export interface ViewerStyles {
  /** Container styles */
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  background?: string;
  minHeight?: string;
  whiteSpace?: string;
  color?: string;

  /** Selection highlight color */
  selectionBackground?: string;
}

export interface ViewerOptions {
  container: HTMLElement;
  showSelection?: boolean;
  styles?: ViewerStyles;
}

export class TextViewer {
  private container: HTMLElement;
  private textElement: HTMLElement;
  private showSelection: boolean;
  private styles: ViewerStyles;

  constructor(options: ViewerOptions) {
    this.container = options.container;
    this.showSelection = options.showSelection ?? true;
    this.styles = options.styles ?? {};

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

    // Apply default or custom styles
    this.container.style.fontFamily = this.styles.fontFamily ?? 'monospace';
    this.container.style.fontSize = this.styles.fontSize ?? '14px';
    this.container.style.lineHeight = this.styles.lineHeight ?? '1.6';
    this.container.style.padding = this.styles.padding ?? '1rem';
    this.container.style.border = this.styles.border ?? '1px solid #888';
    this.container.style.borderRadius = this.styles.borderRadius ?? '6px';
    this.container.style.background = this.styles.background ?? '#fff';
    this.container.style.minHeight = this.styles.minHeight ?? '300px';
    this.container.style.whiteSpace = this.styles.whiteSpace ?? 'pre-wrap';
    this.container.style.wordBreak = 'break-word';
    this.container.style.overflowWrap = 'break-word';

    if (this.styles.color) {
      this.container.style.color = this.styles.color;
    }

    // Text content
    const textElement = document.createElement('div');
    textElement.className = 'href-viewer-text';
    textElement.style.position = 'relative';
    this.container.appendChild(textElement);

    // Add selection styles
    const selectionBg = this.styles.selectionBackground ?? 'rgba(0, 0, 0, 0.2)';
    const styleId = 'href-viewer-styles';

    // Remove existing styles if present
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .href-viewer-selection {
        background: ${selectionBg};
      }
    `;
    document.head.appendChild(style);
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
