export const BASE_URL = "https://devdeckio.netlify.app";

export const SEO_META = {
    "/": {
        title: "DevDeck — All Your Dev Tools. One Command Away.",
        description:
            "DevDeck is a free, fast developer toolbox with 22+ tools. Format JSON, decode JWT, generate UUIDs, convert Base64, and more — all in your browser.",
        about: "DevDeck gives developers instant access to 22+ utilities in a single progressive web app. No sign-up, no data sent to servers — everything runs locally in your browser.",
        keywords: "developer tools, online tools, devtools, toolbox, free developer utilities"
    },
    "/json-viewer": {
        title: "JSON Viewer & Formatter — Validate and Pretty Print JSON | DevDeck",
        description:
            "Format, validate, and interactively browse JSON data in your browser. Supports large payloads with tree view and error highlighting.",
        about: "JSON Viewer lets you paste or load JSON and instantly see it formatted, validated, and browsable as a tree. Useful for debugging API responses, config files, and data payloads.",
        keywords: "json viewer, json formatter, json validator, pretty print json, json tree viewer"
    },
    "/base64-image": {
        title: "Base64 Image Converter — Encode & Decode Images | DevDeck",
        description: "Convert images to Base64 strings and decode Base64 back to images. Supports PNG, JPG, SVG, and WebP. No upload required.",
        about: "Base64 Image Converter encodes any image file to a Base64 data URI and decodes Base64 strings back to viewable images — entirely in your browser with no data leaving your device.",
        keywords: "base64 image, image to base64, base64 to image, encode image, decode base64 image"
    },
    "/qr-generator": {
        title: "QR Code Generator — Free Online QR Creator | DevDeck",
        description: "Generate QR codes from any text, URL, or data. Add a custom logo overlay. Download as PNG instantly.",
        about: "QR Code Generator creates high-quality QR codes from any text or URL. Customize size, add a logo overlay, and download as PNG — no account needed.",
        keywords: "qr code generator, free qr code, qr creator, qr code online, generate qr"
    },
    "/image-resizer": {
        title: "Image Resizer & Cropper — Resize Images Online | DevDeck",
        description: "Crop, scale, and rotate images with a live canvas preview. Download resized images as PNG without uploading to any server.",
        about: "Image Resizer gives you a drag-and-drop canvas to crop, scale, and rotate photos directly in the browser. All processing is local — your images never leave your device.",
        keywords: "image resizer, crop image online, resize image, scale photo, rotate image, image editor"
    },
    "/aspect-ratio-calculator": {
        title: "Aspect Ratio Calculator — Width & Height Dimensions | DevDeck",
        description: "Calculate and simplify aspect ratios from width and height values. Instantly get ratios like 16:9, 4:3, or custom.",
        about: "Aspect Ratio Calculator computes the simplified ratio from any width and height pair. Useful for responsive design, video production, and image layout work.",
        keywords: "aspect ratio calculator, 16:9 calculator, image dimensions, width height ratio"
    },
    "/base64-text": {
        title: "Base64 Text Encoder & Decoder — Online Tool | DevDeck",
        description: "Encode plain text to Base64 and decode Base64 back to readable text. Supports Unicode and handles large strings.",
        about: "Base64 Text Encoder/Decoder converts any text string to Base64 and back. Useful for encoding credentials, embedding data in URLs, and working with APIs that use Base64.",
        keywords: "base64 encode, base64 decode, text to base64, base64 to text, online base64"
    },
    "/url-validator": {
        title: "URL Validator & HTTP Status Checker | DevDeck",
        description: "Check HTTP status codes and response headers for any URL. Strip UTM tracking parameters and validate URL structure.",
        about: "URL Validator checks whether a URL is reachable, returns its HTTP status code, and strips common tracking parameters. Useful for link auditing and debugging redirects.",
        keywords: "url validator, http status checker, check url, url status, link checker online"
    },
    "/url-shortener": {
        title: "URL Shortener — Shorten Long Links Free | DevDeck",
        description: "Shorten any long URL into a compact shareable link. Powered by Short.io.",
        about: "URL Shortener converts long URLs into short, shareable links using the Short.io API. Great for sharing links in limited-character contexts like Twitter or SMS.",
        keywords: "url shortener, shorten url, short link, short.io, link shortener"
    },
    "/password-tools": {
        title: "Password Generator & Strength Meter | DevDeck",
        description: "Generate secure random passwords with custom length and character sets. Analyze password strength with crack-time estimation.",
        about: "Password Generator creates cryptographically random passwords with configurable length, uppercase, lowercase, numbers, and symbols. The built-in strength meter shows estimated crack time.",
        keywords: "password generator, strong password, random password, password strength meter, secure password"
    },
    "/color-converter": {
        title: "Color Converter — HEX, RGB, HSL Online Tool | DevDeck",
        description: "Convert colors instantly between HEX, RGB, and HSL formats. Paste any color code and get all three representations.",
        about: "Color Converter translates color values between HEX (#rrggbb), RGB (r,g,b), and HSL (h,s%,l%) formats. Useful for front-end development, design systems, and CSS work.",
        keywords: "color converter, hex to rgb, rgb to hex, hsl converter, color code converter"
    },
    "/text-case": {
        title: "Text Case Converter — UPPER, lower, camelCase | DevDeck",
        description: "Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more instantly.",
        about: "Text Case Converter changes the capitalization format of any text. Supports UPPER, lower, Title, camelCase, snake_case, PascalCase, and kebab-case transformations.",
        keywords: "text case converter, camelcase converter, snake case, uppercase lowercase, title case"
    },
    "/hash-generator": {
        title: "Hash Generator — MD5, SHA-256, SHA-512 Online | DevDeck",
        description: "Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text input. Runs entirely in your browser.",
        about: "Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 digests from any text. Useful for verifying file integrity, storing password hashes, and debugging cryptographic workflows.",
        keywords: "hash generator, md5 hash, sha256 online, sha512 generator, checksum tool"
    },
    "/regex-tester": {
        title: "Regex Tester — Test Regular Expressions Online | DevDeck",
        description: "Test regular expressions with live match highlighting and named group capture. Supports JavaScript regex flags.",
        about: "Regex Tester lets you write a pattern and test it against input text with real-time match highlighting. Supports flags (g, i, m, s) and shows capture group values.",
        keywords: "regex tester, regular expression tester, regex online, test regex, regexp validator"
    },
    "/jwt-decoder": {
        title: "JWT Decoder — Decode JSON Web Tokens Online | DevDeck",
        description: "Decode and inspect JWT token header and payload instantly. No server-side processing — decoding runs in your browser.",
        about: "JWT Decoder splits a JSON Web Token into its header, payload, and signature parts, then formats them as readable JSON. Useful for debugging auth flows without sharing tokens with external services.",
        keywords: "jwt decoder, json web token decoder, decode jwt, jwt inspector, jwt online"
    },
    "/uuid-generator": {
        title: "UUID Generator — Generate UUID v4 Online | DevDeck",
        description: "Generate one or multiple UUID v4 values with a single click. Copy to clipboard instantly.",
        about: "UUID Generator produces RFC-compliant UUID v4 values using the browser's built-in crypto.randomUUID(). Generate up to 100 UUIDs at once and copy them individually or in bulk.",
        keywords: "uuid generator, guid generator, uuid v4, random uuid, unique id generator online"
    },
    "/timestamp": {
        title: "Unix Timestamp Converter — Epoch to Date & Time | DevDeck",
        description: "Convert Unix timestamps to human-readable dates and convert dates back to Unix epoch time. Supports seconds and milliseconds.",
        about: "Unix Timestamp Converter translates epoch timestamps (seconds or milliseconds) to UTC and local date-time strings, and vice versa. Essential for debugging logs, APIs, and database records.",
        keywords: "unix timestamp converter, epoch to date, timestamp to date, date to unix timestamp, epoch time"
    },
    "/number-base": {
        title: "Number Base Converter — Binary, Hex, Octal, Decimal | DevDeck",
        description: "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Supports large numbers.",
        about: "Number Base Converter translates integers between base-2 (binary), base-8 (octal), base-10 (decimal), and base-16 (hexadecimal). Useful for low-level programming, networking, and CS coursework.",
        keywords: "number base converter, binary to decimal, hex to decimal, octal converter, base conversion"
    },
    "/yaml-json": {
        title: "YAML to JSON Converter — Online YAML Parser | DevDeck",
        description: "Convert YAML to JSON and JSON to YAML with syntax error feedback. Handles nested structures and arrays.",
        about: "YAML/JSON Converter transforms YAML documents to JSON and back with live error highlighting. Useful for working with Kubernetes configs, CI/CD pipelines, and API schemas.",
        keywords: "yaml to json, json to yaml, yaml converter, yaml parser online, yaml formatter"
    },
    "/text-diff": {
        title: "Text Diff Tool — Compare Two Texts Online | DevDeck",
        description: "Compare two text blocks side-by-side with added and removed words highlighted. Line-level and word-level diff.",
        about: "Text Diff highlights changes between two text inputs at the word level. Useful for comparing document revisions, code snippets, config files, or any plain text.",
        keywords: "text diff, compare text online, diff tool, text compare, find differences in text"
    },
    "/lorem-ipsum": {
        title: "Lorem Ipsum Generator — Placeholder Text Online | DevDeck",
        description: "Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Copy instantly.",
        about: "Lorem Ipsum Generator creates standard or custom-length placeholder text for mockups, wireframes, and design layouts. Configure by paragraph count, sentence length, or word count.",
        keywords: "lorem ipsum generator, placeholder text, dummy text generator, lorem ipsum online"
    },
    "/word-counter": {
        title: "Word Counter & Character Counter — Online Tool | DevDeck",
        description: "Count words, characters, lines, sentences, and paragraphs. Get reading time estimate instantly.",
        about: "Word Counter analyzes any text and returns word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time. Useful for writers, editors, and SEO work.",
        keywords: "word counter, character counter, word count online, reading time calculator, text analyzer"
    },
    "/csv-json": {
        title: "CSV to JSON Converter — Parse CSV Online | DevDeck",
        description: "Convert CSV data to JSON with configurable header row support. Handles quoted fields and special characters.",
        about: "CSV to JSON Converter parses CSV input using PapaParse and returns a structured JSON array. Supports custom delimiters, header rows, and handles quoted fields with commas.",
        keywords: "csv to json, csv converter, parse csv online, csv parser, convert csv to json"
    },

    "/api-builder": {
        title: "API Request Builder — Test HTTP Endpoints Online | DevDeck",
        description:
            "Build and send HTTP requests directly in your browser. Test GET, POST, PUT, DELETE, PATCH endpoints with custom headers and JSON body. No backend required.",
        about: "API Request Builder lets you construct and fire HTTP requests from the browser — choose a method, enter a URL, add headers, and inspect the JSON response with status code and timing. Useful for testing REST APIs, debugging webhooks, and exploring public endpoints.",
        keywords: "api tester, http client, test api online, rest client, api request builder, http request tester"
    },

    // ── Blog index ───────────────────────────────────────────────────────────
    "/blog": {
        title: "DevDeck Blog — Developer Tools Explained",
        description: "Guides, tutorials and tips for every DevDeck tool. Learn JSON, Base64, JWT, UUID, regex, timestamps and more.",
        keywords: "developer tools blog, json guide, base64 tutorial, jwt decoder guide, devdeck blog, developer guides"
    },

    // ── Blog posts ───────────────────────────────────────────────────────────
    "/blog/aspect-ratio-calculator": {
        title: "Aspect Ratio Calculator — Width & Height Dimensions | DevDeck",
        description:
            "Learn how to calculate and simplify aspect ratios from width and height values. Use DevDeck's free browser-based tool instantly.",
        keywords: "aspect ratio calculator, 16:9 calculator, image dimensions, width height ratio, online aspect ratio"
    },
    "/blog/base64-image-converter": {
        title: "Base64 Image Converter — Encode & Decode Images | DevDeck",
        description: "Convert images to Base64 data URIs and decode Base64 back to images. Supports PNG, JPG, SVG, WebP. Free, browser-based.",
        keywords: "base64 image, image to base64, base64 to image, encode image, decode base64 image, data URI"
    },
    "/blog/base64-text-encoder": {
        title: "Base64 Text Encoder & Decoder — Online Guide | DevDeck",
        description: "Encode plain text to Base64 and decode Base64 back to readable text. Learn how Base64 works and when to use it.",
        keywords: "base64 encode, base64 decode, text to base64, base64 to text, online base64 encoder"
    },
    "/blog/color-converter": {
        title: "Color Converter — HEX, RGB, HSL Guide | DevDeck",
        description: "Convert colors instantly between HEX, RGB, and HSL formats. Learn which format to use and when.",
        keywords: "color converter, hex to rgb, rgb to hex, hsl converter, color code converter, css colors"
    },
    "/blog/csv-to-json-converter": {
        title: "CSV to JSON Converter — Parse CSV Online | DevDeck",
        description: "Convert CSV data to JSON instantly. Learn how CSV to JSON conversion works and how to use it in your workflow.",
        keywords: "csv to json, csv converter, parse csv online, csv parser, convert csv to json"
    },
    "/blog/hash-generator": {
        title: "Hash Generator — MD5, SHA-256, SHA-512 Guide | DevDeck",
        description: "Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes. Learn which algorithm to use and why.",
        keywords: "hash generator, md5 hash, sha256 online, sha512 generator, checksum tool, cryptographic hash"
    },
    "/blog/image-resizer": {
        title: "Image Resizer & Cropper — Resize Images Online | DevDeck",
        description: "Crop, scale, and rotate images with live canvas preview. No upload required. Learn how to resize images in browser.",
        keywords: "image resizer, crop image online, resize image, scale photo, rotate image, image editor online"
    },
    "/blog/json-viewer": {
        title: "JSON Viewer & Formatter — Format and Inspect JSON | DevDeck",
        description: "Format, validate, and browse JSON data in your browser. Learn what a JSON viewer is and how it helps developers.",
        keywords: "json viewer, json formatter, json validator, pretty print json, json tree viewer, format json online"
    },
    "/blog/jwt-decoder": {
        title: "JWT Decoder — Decode JSON Web Tokens Online | DevDeck",
        description: "Decode and inspect JWT token header and payload instantly. Learn what JWTs are and how to read them.",
        keywords: "jwt decoder, json web token decoder, decode jwt, jwt inspector, jwt online, jwt debugger"
    },
    "/blog/lorem-ipsum-generator": {
        title: "Lorem Ipsum Generator — Placeholder Text Guide | DevDeck",
        description: "Generate lorem ipsum placeholder text for mockups and wireframes. Learn what lorem ipsum is and how to use it.",
        keywords: "lorem ipsum generator, placeholder text, dummy text generator, lorem ipsum online, filler text"
    },
    "/blog/number-base-converter": {
        title: "Number Base Converter — Binary, Hex, Octal, Decimal | DevDeck",
        description: "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Learn number base systems.",
        keywords: "number base converter, binary to decimal, hex to decimal, octal converter, base conversion, binary hex octal"
    },
    "/blog/password-generator": {
        title: "Password Generator & Strength Meter Guide | DevDeck",
        description: "Generate secure random passwords and analyze strength. Learn best practices for creating strong passwords.",
        keywords: "password generator, strong password, random password, password strength meter, secure password, password creator"
    },
    "/blog/qr-code-generator": {
        title: "QR Code Generator — Free Online QR Creator Guide | DevDeck",
        description: "Generate QR codes from any URL or text. Learn what QR codes are and how to use them effectively.",
        keywords: "qr code generator, free qr code, qr creator, qr code online, generate qr, qr from url"
    },
    "/blog/regex-tester": {
        title: "Regex Tester — Test Regular Expressions Online | DevDeck",
        description: "Test regular expressions with live match highlighting. Learn how to write and debug regex patterns.",
        keywords: "regex tester, regular expression tester, regex online, test regex, regexp validator, regex debugger"
    },
    "/blog/text-case-converter": {
        title: "Text Case Converter — UPPER, lower, camelCase Guide | DevDeck",
        description: "Transform text between UPPERCASE, lowercase, camelCase, snake_case, and more. Learn when to use each format.",
        keywords: "text case converter, camelcase converter, snake case, uppercase lowercase, title case, kebab case, pascal case"
    },
    "/blog/text-diff-checker": {
        title: "Text Diff Tool — Compare Two Texts Online | DevDeck",
        description: "Compare two text blocks with word-level diff highlighting. Learn how diff tools work and when to use them.",
        keywords: "text diff, compare text online, diff tool, text compare, find differences in text, text comparison"
    },
    "/blog/timestamp-converter": {
        title: "Unix Timestamp Converter — Epoch to Date & Time | DevDeck",
        description: "Convert Unix timestamps to human-readable dates. Learn what Unix epoch time is and how to work with it.",
        keywords: "unix timestamp converter, epoch to date, timestamp to date, date to unix timestamp, epoch time, unix time"
    },
    "/blog/url-parser": {
        title: "URL Validator & Parser — Check URL Structure | DevDeck",
        description: "Validate URL structure, check HTTP status, strip UTM params. Learn how URLs are structured and parsed.",
        keywords: "url validator, url parser, http status checker, check url, url structure, url components, utm stripper"
    },
    "/blog/url-shortener": {
        title: "URL Shortener — Shorten Long Links Guide | DevDeck",
        description: "Shorten any long URL into a compact shareable link. Learn why and when to use URL shorteners.",
        keywords: "url shortener, shorten url, short link, short.io, link shortener, compact url"
    },
    "/blog/uuid-generator": {
        title: "UUID Generator — Generate UUID v4 Guide | DevDeck",
        description: "Generate UUID v4 values instantly. Learn what UUIDs are, why they're unique, and how to use them.",
        keywords: "uuid generator, guid generator, uuid v4, random uuid, unique id generator online, universally unique identifier"
    },
    "/blog/word-counter": {
        title: "Word Counter & Character Counter — Online Guide | DevDeck",
        description: "Count words, characters, sentences, and get reading time. Learn why word and character counts matter.",
        keywords: "word counter, character counter, word count online, reading time calculator, text analyzer, character count"
    },
    "/blog/yaml-to-json-converter": {
        title: "YAML to JSON Converter — Online YAML Parser Guide | DevDeck",
        description: "Convert YAML to JSON and JSON to YAML with error feedback. Learn when to use YAML vs JSON.",
        keywords: "yaml to json, json to yaml, yaml converter, yaml parser online, yaml formatter, yaml json"
    },
    "/blog/api-request-builder": {
        title: "API Request Builder — Test HTTP Endpoints in Your Browser | DevDeck",
        description: "Build and send HTTP requests without Postman or curl. Test REST APIs with custom headers, JSON body, and live response inspection — free and browser-based.",
        keywords: "api request builder, http client online, test api online, rest client browser, api tester, postman alternative, curl command online"
    }
};
