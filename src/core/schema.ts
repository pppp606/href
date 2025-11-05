/**
 * JSON Schema definition for HREF v0.1 documents.
 */

export const hrefDocumentSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://href.dev/schemas/v0.1/document.json",
  title: "High-Resolution Edit Format (HREF) Document",
  type: "object",
  additionalProperties: false,
  required: ["version", "session", "initial_text", "events"],
  properties: {
    version: {
      const: "0.1"
    },
    session: {
      $ref: "#/definitions/SessionMeta"
    },
    initial_text: {
      type: "string"
    },
    events: {
      type: "array",
      items: { $ref: "#/definitions/Event" }
    }
  },
  definitions: {
    SessionMeta: {
      type: "object",
      additionalProperties: false,
      required: ["id", "user_agent", "lang", "device", "source"],
      properties: {
        id: { type: "string" },
        user_agent: { type: "string" },
        lang: { type: "string" },
        device: { type: "string" },
        source: { type: "string" },
        meta: {
          type: "object",
          additionalProperties: true
        }
      }
    },
    Modifiers: {
      type: "object",
      additionalProperties: {
        type: "boolean"
      },
      properties: {
        shift: { type: "boolean" },
        ctrl: { type: "boolean" },
        alt: { type: "boolean" },
        meta: { type: "boolean" }
      }
    },
    SelectionPosition: {
      type: "object",
      additionalProperties: false,
      required: ["index"],
      properties: {
        index: { type: "number" },
        affinity: {
          type: "string",
          enum: ["forward", "backward", "none"],
          nullable: true
        }
      }
    },
    CompositionSegment: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: { type: "string" },
        highlight: { type: "boolean" }
      }
    },
    EventBase: {
      type: "object",
      additionalProperties: true,
      required: ["time", "type"],
      properties: {
        time: { type: "number" },
        type: { type: "string" },
        pos: { type: "number" },
        modifiers: { $ref: "#/definitions/Modifiers" },
        meta: {
          type: "object",
          additionalProperties: true
        }
      }
    },
    KeyboardEvent: {
      allOf: [
        { $ref: "#/definitions/EventBase" },
        {
          properties: {
            type: { enum: ["keydown", "keyup"] },
            key: { type: "string" },
            code: { type: "string" }
          },
          required: ["key", "code"],
          additionalProperties: true
        }
      ]
    },
    InputEvent: {
      allOf: [
        { $ref: "#/definitions/EventBase" },
        {
          properties: {
            type: { enum: ["beforeinput", "input"] },
            inputType: { type: "string" },
            data: { type: ["string", "null"] },
            text: { type: ["string", "null"] }
          },
          required: ["inputType"],
          additionalProperties: true
        }
      ]
    },
    CompositionEvent: {
      allOf: [
        { $ref: "#/definitions/EventBase" },
        {
          properties: {
            type: {
              enum: ["compositionstart", "compositionupdate", "compositionend"]
            },
            data: { type: "string" },
            segments: {
              type: "array",
              items: { $ref: "#/definitions/CompositionSegment" }
            }
          },
          additionalProperties: true
        }
      ]
    },
    SelectionChangeEvent: {
      allOf: [
        { $ref: "#/definitions/EventBase" },
        {
          properties: {
            type: { enum: ["selectionchange"] },
            anchor: { $ref: "#/definitions/SelectionPosition" },
            focus: { $ref: "#/definitions/SelectionPosition" }
          },
          required: ["anchor", "focus"],
          additionalProperties: true
        }
      ]
    },
    FocusEvent: {
      allOf: [
        { $ref: "#/definitions/EventBase" },
        {
          properties: {
            type: { enum: ["focus", "blur"] }
          },
          additionalProperties: true
        }
      ]
    },
    CustomEvent: {
      allOf: [
        { $ref: "#/definitions/EventBase" },
        {
          properties: {
            type: { enum: ["custom"] },
            label: { type: "string" },
            payload: {
              type: "object",
              additionalProperties: true
            }
          },
          required: ["label"],
          additionalProperties: true
        }
      ]
    },
    Event: {
      oneOf: [
        { $ref: "#/definitions/KeyboardEvent" },
        { $ref: "#/definitions/InputEvent" },
        { $ref: "#/definitions/CompositionEvent" },
        { $ref: "#/definitions/SelectionChangeEvent" },
        { $ref: "#/definitions/FocusEvent" },
        { $ref: "#/definitions/CustomEvent" }
      ]
    }
  }
} as const;

export type HrefDocumentSchema = typeof hrefDocumentSchema;

