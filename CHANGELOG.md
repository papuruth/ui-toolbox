# Changelog

All notable changes to DevDeck are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-04-27

### Added

#### New Tools
- **Regex Tester** — live pattern matching with flag toggles (g, i, m, s), 9 built-in presets (Email, URL, IPv4, UUID, JWT, and more), match highlighting, and capture group detail
- **JSON Viewer / Editor** — interactive tree view with inline add/edit/delete, search/filter, expand-all/collapse-all, and load JSON from a remote URL
- **Password Strength Meter** — real-time analysis using zxcvbn: strength score, estimated crack time, and character-type breakdown
- **YAML ↔ JSON Converter** — bidirectional conversion between YAML and JSON with live error feedback

#### New UX Features
- **Command Palette** — keyboard-accessible (`⌘K` / `Ctrl+K`) launcher to search tools, recent items, and actions from anywhere in the app
- **Smart Input** — paste any raw data (JSON, JWT, URL, timestamp…) and the app auto-detects the right tool to open
- **Tool Chaining** — send output from one tool directly into another via the "Send To" button (e.g. Password Generator → Hash Generator)
- **Shareable URLs** — Regex Tester and other tools encode their state into the URL so you can share a pre-loaded view
- **Input History** — per-tool history dropdown lets you recall recent inputs without re-typing
- **Update Banner** — in-app notification when a new version of the PWA is available, with a one-click reload

#### Developer Experience
- **Full i18n / Localization** — every visible UI string in all tools is now sourced from `localization/languages/english.js`, making the app translation-ready
- **Google Tag Manager** — analytics integration for usage tracking

### Changed

- **QR Generator** — fully redesigned with a two-panel layout; added foreground/background color pickers, size slider, optional logo overlay (drop zone), and SVG export alongside PNG
- **Image Resizer / Cropper** — rebuilt with `react-image-crop`; supports scale, rotation, free/locked aspect ratio, live crop-dimension readout, and direct canvas download
- **URL Shortener** — replaced Redux + sagas state management with local React state; removed `URLShortnerActions`, `URLShortnerReducer`, and `URLShortnerSagas`
- **Base64 Image** — refactored encoder/decoder into dedicated components (`EncodeBase64`, `DecodeBase64`) with cleaner separation of concerns
- **Global layout** — sidebar and header updated to surface the Command Palette trigger and Smart Input entry point
- **Redux store** — root reducer and root sagas slimmed down after URL Shortener migration off Redux

### Fixed

- Corrected indentation and formatting in `index.html`
- Fixed layout styling regressions in several components
- Fixed Number Formatter display and styling issues
- Fixed responsiveness issues across panel-based layouts

### Removed

- `URLShortnerActions.js`, `URLShortnerReducer.js`, `URLShortnerSagas.js` — superseded by local state

---

## [1.0.1] - 2024-01-01

### Fixed

- Minor bug fixes and stability improvements

---

## [1.0.0] - 2023-12-01

### Added

- Initial release with core developer tools: Base64 Text, Color Converter, CSV to JSON, Hash Generator, JWT Decoder, Lorem Ipsum, Number Base Converter, Password Generator, QR Generator, Timestamp Converter, Text Case Converter, Text Diff, URL Validator, UUID Generator, Word Counter, Aspect Ratio Calculator, Image Resizer
- Dark / light mode toggle
- Progressive Web App (PWA) with offline support
- English localization foundation
