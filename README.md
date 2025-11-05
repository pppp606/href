# HREF - High-Resolution Edit Format

A comprehensive event capture and replay system for text editing interactions. HREF records every keystroke, IME input, selection change, and editing event with precise timing, allowing you to replay and analyze text editing sessions.

## Features

- 🎙️ **High-fidelity recording** - Captures keyboard, input, IME composition, selection, and focus events
- 🎬 **Smooth playback** - Replay recordings with adjustable speed and timeline seeking
- 🌏 **IME support** - Full support for Japanese, Chinese, and other complex input methods
- 📊 **Structured format** - JSON-based format with comprehensive event data
- 🎨 **Visualization** - Built-in text viewer with selection rendering
- 🔧 **TypeScript** - Fully typed with excellent IDE support

## Installation

```bash
npm install href
```

## Quick Start

### Recording

```typescript
import { HrefRecorder } from 'href';

// Create recorder
const recorder = new HrefRecorder({
  target: document.querySelector('textarea')
});

// Start recording
recorder.start();

// Stop recording
recorder.stop();

// Get recorded document
const document = recorder.getDocument();

// Export as JSON
const json = recorder.exportJSON();
```

### Playback

```typescript
import { HrefPlayer } from 'href';

// Create player with container
const player = new HrefPlayer({
  container: document.getElementById('viewer'),
  speed: 1.0
});

// Load recording
player.load(document);

// Control playback
player.play();
player.pause();
player.stop();

// Seek to specific time (in milliseconds)
player.seek(5000);

// Adjust speed
player.setSpeed(2.0);
```

## API Reference

### HrefRecorder

#### Constructor Options

```typescript
interface RecorderOptions {
  target?: HTMLElement | Document;  // Element to observe (default: document)
  autoStart?: boolean;              // Auto-start recording (default: false)
}
```

#### Methods

- `start(): void` - Start recording events
- `stop(): void` - Stop recording
- `getDocument(): HrefDocument` - Get recorded document
- `exportJSON(): string` - Export as JSON string
- `exportNDJSON(): string` - Export as newline-delimited JSON

### HrefPlayer

#### Constructor Options

```typescript
interface PlayerOptions {
  container?: HTMLElement;      // Container for visualization
  speed?: number;               // Playback speed multiplier (default: 1.0)
  showSelection?: boolean;      // Show selection highlight (default: true)
}
```

#### Methods

- `load(document: HrefDocument): void` - Load HREF document
- `loadJSON(json: string): void` - Load from JSON string
- `play(): void` - Start playback
- `pause(): void` - Pause playback
- `stop(): void` - Stop and reset
- `seek(time: number): void` - Seek to time in milliseconds
- `setSpeed(speed: number): void` - Set playback speed
- `getState(): PlayerState` - Get current player state

## Document Format

HREF documents follow a structured JSON format:

```json
{
  "version": "0.1",
  "session": {
    "id": "session-uuid",
    "user_agent": "Mozilla/5.0...",
    "lang": "ja",
    "device": "desktop",
    "source": "HrefRecorder"
  },
  "initial_text": "",
  "events": [
    {
      "time": 0,
      "type": "focus"
    },
    {
      "time": 100,
      "type": "keydown",
      "key": "h",
      "code": "KeyH",
      "pos": 0
    },
    {
      "time": 120,
      "type": "input",
      "inputType": "insertText",
      "data": "h",
      "text": "h",
      "pos": 1
    }
  ]
}
```

## Event Types

HREF captures the following event types:

- **keyboard** - `keydown`, `keyup`
- **input** - `beforeinput`, `input`
- **composition** - `compositionstart`, `compositionupdate`, `compositionend` (IME)
- **selection** - `selectionchange`
- **focus** - `focus`, `blur`

## Examples

See the `examples/` directory for complete demos:

- `examples/index.html` - Integrated recorder and player demo
- `examples/recorder-demo.html` - Standalone recorder demo
- `examples/player-demo.html` - Standalone player demo

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Watch mode
npm run build:watch

# Run demo server
npm run dev
```

## License

MIT
