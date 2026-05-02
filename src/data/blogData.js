// Blog data for all 22 DevDeck tools
// Shape: slug → { slug, title, metaDescription, metaKeywords, intro, sections[], cta, relatedSlugs[], faq[] }

const blogData = {
    "aspect-ratio-calculator": {
        slug: "aspect-ratio-calculator",
        title: "Aspect Ratio Calculator — Width & Height Dimensions",
        metaDescription:
            "Learn how to calculate and simplify aspect ratios from width and height values. Use DevDeck's free browser-based aspect ratio calculator instantly.",
        metaKeywords: "aspect ratio calculator, 16:9 calculator, image dimensions, width height ratio, online aspect ratio",
        intro: "Aspect ratio describes the proportional relationship between width and height. Whether you're designing for video, web layouts, or print, getting the ratio right prevents distortion and ensures consistency across screen sizes.",
        sections: [
            {
                heading: "What is an Aspect Ratio?",
                body: "An aspect ratio is the ratio of an image's or screen's width to its height, expressed as two numbers separated by a colon — like 16:9 or 4:3. It tells you the shape of the display area without specifying actual pixel dimensions."
            },
            {
                heading: "Why Aspect Ratio Matters",
                body: "Wrong aspect ratios cause stretched or cropped visuals. Front-end developers use it to size video embeds, hero images, and responsive containers correctly. Video producers need it to match platform requirements (YouTube is 16:9, Instagram is 1:1 or 4:5)."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Instantly simplify any width × height pair to its lowest-term ratio",
                    "No installation — runs entirely in browser",
                    "Works for any resolution, not just standard presets",
                    "Great for responsive design and media production",
                    "Free with no signup required"
                ]
            },
            {
                heading: "How to Use the Aspect Ratio Calculator",
                steps: ["Enter the width value", "Enter the height value", "View the simplified ratio instantly", "Copy or note down the result"]
            },
            {
                heading: "Example Use Case",
                body: "A developer building a video player needs to maintain 16:9 ratio for any given width. Enter 1920 × 1080 → get 16:9. Enter 800 × 600 → get 4:3. Instantly compare ratios across different content sizes."
            },
            {
                heading: "Tips",
                list: [
                    "Use 16:9 for landscape video content",
                    "Use 1:1 for social media square posts",
                    "Use 4:5 for Instagram portrait posts",
                    "CSS padding-top trick uses ratio to maintain proportional containers"
                ]
            }
        ],
        cta: { label: "Try Aspect Ratio Calculator →", toolRoute: "/aspect-ratio-calculator" },
        relatedSlugs: ["image-resizer", "base64-image-converter", "word-counter"],
        faq: [
            { q: "Is the Aspect Ratio Calculator free?", a: "Yes, completely free. No signup required." },
            { q: "Does it store my data?", a: "No. All processing happens locally in your browser." },
            { q: "What is 16:9 in pixels?", a: "Any resolution where width ÷ height = 1.778. For example 1920×1080, 1280×720, 854×480." }
        ]
    },

    "base64-image-converter": {
        slug: "base64-image-converter",
        title: "Base64 Image Converter — Encode & Decode Images",
        metaDescription:
            "Convert images to Base64 data URIs and decode Base64 back to images. Supports PNG, JPG, SVG, WebP. Free, browser-based, no upload required.",
        metaKeywords: "base64 image, image to base64, base64 to image, encode image, decode base64 image, data URI",
        intro: "Base64 image conversion lets you embed images directly into HTML, CSS, or JavaScript as text strings. No separate file requests, no CDN — the image travels with your code.",
        sections: [
            {
                heading: "What is Base64 Image Encoding?",
                body: "Base64 encoding converts binary image data into a printable ASCII string. The result is a data URI like `data:image/png;base64,iVBORw0KGgo...` that browsers can render directly without an HTTP request."
            },
            {
                heading: "Why Use Base64 for Images?",
                body: "Embedding images as Base64 reduces HTTP requests — useful for small icons, inline SVGs in CSS, or email templates where external images may be blocked. It's also handy for storing images in JSON APIs or localStorage."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Encode any PNG, JPG, SVG, GIF, or WebP to Base64",
                    "Decode any Base64 string back to a viewable image",
                    "No file upload to any server — fully client-side",
                    "Copy data URI with one click",
                    "Preview decoded image immediately"
                ]
            },
            {
                heading: "How to Use Base64 Image Converter",
                steps: [
                    "Drag and drop or select an image file",
                    "The Base64 data URI appears instantly",
                    "Copy and use in your HTML, CSS, or JSON",
                    "To decode: paste a Base64 string and see the image preview"
                ]
            },
            {
                heading: "Example Use Case",
                body: "An email developer needs to embed a logo without relying on external hosting (many email clients block remote images). Encode the PNG to Base64, paste the data URI into the `<img src>` attribute — the image renders reliably in every email client."
            },
            {
                heading: "Tips",
                list: [
                    "Base64 increases file size by ~33% — only use for small images",
                    "SVGs are already text so Base64 is often unnecessary for them",
                    "Large images as Base64 will bloat HTML significantly",
                    "Use for icons under 5KB for best performance"
                ]
            }
        ],
        cta: { label: "Try Base64 Image Converter →", toolRoute: "/base64-image" },
        relatedSlugs: ["image-resizer", "base64-text-encoder", "qr-code-generator"],
        faq: [
            { q: "Is Base64 Image Converter free?", a: "Yes, completely free." },
            { q: "Does it store my images?", a: "No. All encoding/decoding happens locally in your browser." },
            { q: "What image formats are supported?", a: "PNG, JPG/JPEG, GIF, SVG, and WebP." },
            { q: "Can I use the Base64 output in CSS?", a: "Yes. Use it as background-image: url('data:image/png;base64,...')" }
        ]
    },

    "base64-text-encoder": {
        slug: "base64-text-encoder",
        title: "Base64 Text Encoder & Decoder — Online Tool",
        metaDescription: "Encode plain text to Base64 and decode Base64 back to readable text. Supports Unicode. Free browser-based tool on DevDeck.",
        metaKeywords: "base64 encode, base64 decode, text to base64, base64 to text, online base64 encoder",
        intro: "Base64 text encoding converts any string into a safe ASCII representation. It's widely used in HTTP Basic Auth headers, JWT tokens, email encoding, and anywhere binary-safe text transport is needed.",
        sections: [
            {
                heading: "What is Base64 Text Encoding?",
                body: "Base64 is an encoding scheme that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It doesn't encrypt — it just makes arbitrary bytes safe to transmit as text."
            },
            {
                heading: "Why Use Base64 for Text?",
                body: "HTTP headers, JSON payloads, and URLs can't safely carry arbitrary binary data. Base64 solves this by transforming any string into URL-safe or header-safe characters. It's the backbone of HTTP Basic Authentication (`Authorization: Basic dXNlcjpwYXNz`)."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Encode any text string to Base64 instantly",
                    "Decode any Base64 string back to plain text",
                    "Handles Unicode (UTF-8) characters",
                    "Supports large strings",
                    "100% client-side — nothing sent to server"
                ]
            },
            {
                heading: "How to Use Base64 Text Encoder",
                steps: [
                    "Paste or type your text in the input field",
                    "Switch between Encode and Decode modes",
                    "See the result instantly",
                    "Copy output to clipboard"
                ]
            },
            {
                heading: "Example Use Case",
                body: "A developer debugging an API that uses HTTP Basic Auth needs to manually construct the Authorization header. Enter `username:password` → encode → get the Base64 string to paste in the header. Also useful for decoding JWT payloads (the middle part of a JWT is Base64-encoded JSON)."
            },
            {
                heading: "Tips",
                list: [
                    "Base64 is not encryption — do not use it to 'hide' sensitive data",
                    "JWT middle section is Base64URL encoded (uses - and _ instead of + and /)",
                    "btoa() and atob() are built-in browser Base64 functions",
                    "For binary files, use the Base64 Image tool instead"
                ]
            }
        ],
        cta: { label: "Try Base64 Text Encoder →", toolRoute: "/base64-text" },
        relatedSlugs: ["base64-image-converter", "hash-generator", "jwt-decoder"],
        faq: [
            {
                q: "Is Base64 encoding secure?",
                a: "No. Base64 is encoding, not encryption. Anyone can decode it. Use it only for transport compatibility, not for hiding data."
            },
            { q: "Does it store my text?", a: "No. Everything runs locally in your browser." },
            { q: "What is the difference between Base64 and Base64URL?", a: "Base64URL replaces + with - and / with _ to make the string URL-safe." }
        ]
    },

    "color-converter": {
        slug: "color-converter",
        title: "Color Converter — HEX, RGB, HSL Online Tool",
        metaDescription: "Convert colors instantly between HEX, RGB, and HSL formats. Free browser-based color converter on DevDeck.",
        metaKeywords: "color converter, hex to rgb, rgb to hex, hsl converter, color code converter, css colors",
        intro: "Color codes come in multiple formats depending on the context — CSS uses HEX or RGB, design tools use HSL, and APIs may return any format. Color Converter lets you translate between all three instantly.",
        sections: [
            {
                heading: "What is a Color Converter?",
                body: "A color converter translates color values between different notation systems: HEX (#rrggbb), RGB (red, green, blue channels 0–255), and HSL (hue 0–360°, saturation %, lightness %). All three represent the same color — just in different formats."
            },
            {
                heading: "Why Use a Color Converter?",
                body: "Design tools like Figma export colors as HEX, but CSS animations and theming often work better with HSL. APIs return RGB values. Having a quick converter eliminates manual calculation and copy-paste errors between design and development."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Instant conversion between HEX, RGB, and HSL",
                    "Visual color preview",
                    "Copy any format with one click",
                    "Works in browser with no installation",
                    "Supports the full visible color gamut"
                ]
            },
            {
                heading: "How to Use Color Converter",
                steps: [
                    "Paste a HEX code, RGB value, or HSL value",
                    "All three formats update instantly",
                    "Click to copy any format",
                    "Use the color picker for visual selection"
                ]
            },
            {
                heading: "Example Use Case",
                body: "A developer implementing a dark mode theme needs a color that's 20% lighter than the brand color #22cc99. Convert to HSL → adjust lightness → convert back to HEX for CSS. Much faster than mental math."
            },
            {
                heading: "Tips",
                list: [
                    "HSL is best for programmatic color manipulation (adjust L for shades)",
                    "HEX is most common in CSS and design tools",
                    "RGB(a) needed when working with canvas or WebGL",
                    "HSL hue 0=red, 120=green, 240=blue"
                ]
            }
        ],
        cta: { label: "Try Color Converter →", toolRoute: "/color-converter" },
        relatedSlugs: ["text-case-converter", "hash-generator", "regex-tester"],
        faq: [
            { q: "Is Color Converter free?", a: "Yes, completely free." },
            {
                q: "Does it support alpha/transparency?",
                a: "The converter handles RGB and HEX. RGBA/HSLA support depends on the current version of the tool."
            },
            {
                q: "What is the HEX format?",
                a: "HEX is a 6-digit hexadecimal color code (#RRGGBB) where each pair represents red, green, and blue from 00 to FF."
            }
        ]
    },

    "csv-to-json-converter": {
        slug: "csv-to-json-converter",
        title: "CSV to JSON Converter — Parse CSV Online",
        metaDescription:
            "Convert CSV data to JSON with header row support. Handles quoted fields and special characters. Free, browser-based on DevDeck.",
        metaKeywords: "csv to json, csv converter, parse csv online, csv parser, convert csv to json",
        intro: "CSV is the universal format for spreadsheet exports and database dumps, but modern APIs and apps expect JSON. Convert CSV to JSON instantly without writing a single line of code.",
        sections: [
            {
                heading: "What is CSV to JSON Conversion?",
                body: "CSV (Comma-Separated Values) stores tabular data as plain text rows. JSON (JavaScript Object Notation) is a nested key-value format used by APIs and web apps. Converting between them maps column headers to JSON keys and row values to JSON values."
            },
            {
                heading: "Why Convert CSV to JSON?",
                body: "REST APIs consume JSON. If you export data from Excel, Google Sheets, or a database, it comes out as CSV. Converting to JSON lets you directly use that data in a Node.js script, a POST request body, or a JavaScript application without writing a parser."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Instant CSV → JSON conversion in browser",
                    "Handles header rows, quoted fields, commas inside values",
                    "Output is formatted and readable",
                    "No data leaves your browser",
                    "Supports large files"
                ]
            },
            {
                heading: "How to Use CSV to JSON Converter",
                steps: [
                    "Paste your CSV data or upload a .csv file",
                    "Check that the first row is headers (toggle if needed)",
                    "View the JSON output instantly",
                    "Copy or download the result"
                ]
            },
            {
                heading: "Example Use Case",
                body: "You exported a list of users from a MySQL database as CSV. You need to seed a new MongoDB collection with that data. Paste the CSV, get a JSON array of objects, paste into your Node.js seed script — done in under a minute."
            },
            {
                heading: "Tips",
                list: [
                    "Ensure your CSV has a header row for meaningful JSON keys",
                    "Quoted fields with commas are handled correctly",
                    "Empty cells become null or empty string in JSON",
                    "Use the YAML/JSON converter after if you need YAML output"
                ]
            }
        ],
        cta: { label: "Try CSV to JSON Converter →", toolRoute: "/csv-json" },
        relatedSlugs: ["json-viewer", "yaml-to-json-converter", "text-diff-checker"],
        faq: [
            { q: "Is CSV to JSON Converter free?", a: "Yes, completely free." },
            { q: "Does it store my data?", a: "No. All processing is client-side in your browser." },
            { q: "Can it handle large CSV files?", a: "Yes. The converter uses PapaParse which handles large files efficiently." }
        ]
    },

    "hash-generator": {
        slug: "hash-generator",
        title: "Hash Generator — MD5, SHA-256, SHA-512 Online",
        metaDescription: "Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text. Runs entirely in browser. Free on DevDeck.",
        metaKeywords: "hash generator, md5 hash, sha256 online, sha512 generator, checksum tool, cryptographic hash",
        intro: "Cryptographic hashes are one-way fingerprints of data. Use them to verify file integrity, store passwords safely, generate checksums, or debug HMAC signatures — all without sending data to any server.",
        sections: [
            {
                heading: "What is a Hash Generator?",
                body: "A hash generator applies a cryptographic hash function to any input and produces a fixed-length hexadecimal digest. The same input always produces the same hash; any change to the input produces a completely different hash."
            },
            {
                heading: "Why Use Cryptographic Hashes?",
                body: "Hashes are used everywhere in software: passwords stored in databases are hashed (never stored in plain text), file integrity checks compare SHA-256 hashes, digital signatures rely on hash functions, and Git commit IDs are SHA-1 hashes."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes",
                    "All algorithms computed simultaneously",
                    "Real-time hashing as you type",
                    "100% client-side — your data never leaves the browser",
                    "Copy any hash with one click"
                ]
            },
            {
                heading: "How to Use Hash Generator",
                steps: [
                    "Type or paste any text into the input",
                    "All four hash outputs update instantly",
                    "Select the algorithm you need",
                    "Click to copy the hash"
                ]
            },
            {
                heading: "Example Use Case",
                body: "A developer needs to verify a downloaded file's integrity. The file host publishes a SHA-256 checksum. Paste the file contents (or the canonical string) into the hash generator, compare the SHA-256 output to the published checksum — if they match, the file is unmodified."
            },
            {
                heading: "Tips",
                list: [
                    "MD5 and SHA-1 are broken for security — use SHA-256 or SHA-512 for cryptographic purposes",
                    "MD5 is still fine for non-security checksums and deduplication",
                    "Hash output is always the same length regardless of input size",
                    "Hashing is deterministic but irreversible — you cannot recover the original from the hash"
                ]
            }
        ],
        cta: { label: "Try Hash Generator →", toolRoute: "/hash-generator" },
        relatedSlugs: ["base64-text-encoder", "jwt-decoder", "password-generator"],
        faq: [
            { q: "Is Hash Generator free?", a: "Yes, completely free." },
            { q: "Does it store my data?", a: "No. All hashing runs locally in your browser using the Web Crypto API." },
            {
                q: "Which hash algorithm should I use?",
                a: "Use SHA-256 or SHA-512 for security-sensitive purposes. MD5/SHA-1 are acceptable for checksums and deduplication only."
            }
        ]
    },

    "image-resizer": {
        slug: "image-resizer",
        title: "Image Resizer & Cropper — Resize Images Online",
        metaDescription:
            "Crop, scale, and rotate images with live canvas preview. Download resized images as PNG. No upload to server. Free on DevDeck.",
        metaKeywords: "image resizer, crop image online, resize image, scale photo, rotate image, image editor online",
        intro: "Resizing images for different contexts — web thumbnails, social media posts, email banners — usually requires Photoshop or similar software. Image Resizer lets you do it directly in your browser with a live preview.",
        sections: [
            {
                heading: "What is an Image Resizer?",
                body: "An image resizer changes the pixel dimensions of an image. You can scale it to a specific width/height, crop to a region, or rotate it. The output is a new image file at the target dimensions."
            },
            {
                heading: "Why Use a Browser-Based Image Resizer?",
                body: "Traditional image editors require installation and a learning curve. For quick resizing tasks — thumbnail for a blog post, avatar for a profile, banner for an email — a browser tool is faster. And because it runs locally, your images never leave your device."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Drag and drop or select any image",
                    "Live canvas preview while you resize",
                    "Set exact pixel dimensions",
                    "Crop, scale, and rotate in one place",
                    "Download resized PNG — no server upload"
                ]
            },
            {
                heading: "How to Use Image Resizer",
                steps: [
                    "Drop an image onto the canvas or click to select",
                    "Set target width and height",
                    "Drag to crop or use controls to rotate",
                    "Click Download to save the resized PNG"
                ]
            },
            {
                heading: "Example Use Case",
                body: "You need a 200×200 avatar image from a 2000×1500 landscape photo. Open Image Resizer, drop the photo, set width and height to 200, drag to center on the face, download — finished in 30 seconds."
            },
            {
                heading: "Tips",
                list: [
                    "Lock aspect ratio when scaling to avoid distortion",
                    "Use PNG output for images with transparency",
                    "For web use, aim for files under 200KB for fast loading",
                    "Combine with Base64 Image tool to embed the resized image directly"
                ]
            }
        ],
        cta: { label: "Try Image Resizer →", toolRoute: "/image-resizer" },
        relatedSlugs: ["base64-image-converter", "aspect-ratio-calculator", "qr-code-generator"],
        faq: [
            { q: "Is Image Resizer free?", a: "Yes, completely free." },
            { q: "Does it upload my images?", a: "No. All processing happens in your browser via HTML5 Canvas. Nothing is uploaded." },
            { q: "What formats can I input?", a: "PNG, JPG, GIF, WebP, and most other browser-renderable image formats." }
        ]
    },

    "json-viewer": {
        slug: "json-viewer",
        title: "JSON Viewer & Formatter — Validate and Pretty Print JSON",
        metaDescription: "Format, validate, and browse JSON data in your browser. Supports tree view and error highlighting. Free on DevDeck.",
        metaKeywords: "json viewer, json formatter, json validator, pretty print json, json tree viewer, format json online",
        intro: "Raw JSON from APIs is often a single unreadable line. JSON Viewer formats it instantly, validates the syntax, and lets you browse the structure as an expandable tree — no IDE required.",
        sections: [
            {
                heading: "What is a JSON Viewer?",
                body: "A JSON viewer parses a JSON string and presents it in a structured, readable format. It shows indentation, highlights keys and values, detects syntax errors, and often provides a collapsible tree view for nested objects."
            },
            {
                heading: "Why Use a JSON Viewer?",
                body: "When debugging API responses, config files, or log entries, raw JSON is hard to read. A viewer formats it with correct indentation, makes errors obvious with highlighting, and lets you navigate nested structures by expanding/collapsing nodes."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Instant JSON formatting and pretty-printing",
                    "Syntax error detection with line numbers",
                    "Collapsible tree view for nested JSON",
                    "Supports large payloads",
                    "Copy formatted JSON with one click"
                ]
            },
            {
                heading: "How to Use JSON Viewer",
                steps: [
                    "Paste raw JSON into the input area",
                    "The formatted and validated output appears instantly",
                    "Expand/collapse nodes in the tree view",
                    "Copy the formatted JSON or fix errors highlighted in red"
                ]
            },
            {
                heading: "Example Use Case",
                body: "You're debugging a REST API response. The server returns a minified JSON blob. Paste it into JSON Viewer — you instantly see the formatted structure, find the missing `user.address` field that's causing a null error, and understand the response shape."
            },
            {
                heading: "Tips",
                list: [
                    "Use Ctrl+A to select all in the input before pasting new content",
                    "JSON keys must be double-quoted — single quotes cause parse errors",
                    "Trailing commas are not valid JSON",
                    "Use YAML/JSON converter if you need YAML output of your JSON"
                ]
            }
        ],
        cta: { label: "Try JSON Viewer →", toolRoute: "/json-viewer" },
        relatedSlugs: ["csv-to-json-converter", "yaml-to-json-converter", "jwt-decoder"],
        faq: [
            { q: "Is JSON Viewer free?", a: "Yes, completely free." },
            { q: "Does it store my JSON data?", a: "No. All processing is local in your browser." },
            {
                q: "What is the difference between JSON and YAML?",
                a: "JSON uses braces and brackets; YAML uses indentation. YAML is more human-readable. The YAML/JSON Converter tool on DevDeck converts between them."
            }
        ]
    },

    "jwt-decoder": {
        slug: "jwt-decoder",
        title: "JWT Decoder — Decode JSON Web Tokens Online",
        metaDescription: "Decode and inspect JWT token header and payload instantly. No server-side processing. Free on DevDeck.",
        metaKeywords: "jwt decoder, json web token decoder, decode jwt, jwt inspector, jwt online, jwt debugger",
        intro: "JWTs (JSON Web Tokens) are the standard for auth in modern apps. But reading them is tricky — they're Base64URL-encoded and split into three parts. JWT Decoder splits, decodes, and formats all three sections instantly.",
        sections: [
            {
                heading: "What is a JWT?",
                body: "A JSON Web Token is a compact, URL-safe token used for authentication and authorization. It has three parts separated by dots: Header (algorithm), Payload (claims like user ID and expiry), and Signature (used for verification). Format: `xxxxx.yyyyy.zzzzz`"
            },
            {
                heading: "Why Decode JWTs?",
                body: "During development, you often need to inspect what's inside a JWT — check the expiry (exp), see the user ID (sub), verify the issuer (iss), or debug unexpected claims. JWT Decoder shows all of this formatted as readable JSON without any server-side calls."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Decodes header and payload to readable JSON",
                    "Shows expiry time in human-readable format",
                    "Highlights expired tokens",
                    "100% client-side — your token never leaves your browser",
                    "Copy decoded sections individually"
                ]
            },
            {
                heading: "How to Use JWT Decoder",
                steps: [
                    "Paste the full JWT (three dot-separated parts)",
                    "Header and payload decode automatically",
                    "Check expiry and claims",
                    "Note: signature is shown but NOT verified — you need the secret for that"
                ]
            },
            {
                heading: "Example Use Case",
                body: "A user reports being logged out unexpectedly. You grab their JWT from browser DevTools → Network tab → Authorization header. Paste it into JWT Decoder: the `exp` claim shows the token expired 2 hours ago. The session timeout is confirmed — not a bug."
            },
            {
                heading: "Tips",
                list: [
                    "Never paste production JWTs into external tools — this tool is local only",
                    "The 'exp' claim is a Unix timestamp — decoder shows it as a readable date",
                    "JWT Decoder cannot verify the signature without the secret",
                    "Use JWT for stateless auth, not for storing sensitive data in the payload"
                ]
            }
        ],
        cta: { label: "Try JWT Decoder →", toolRoute: "/jwt-decoder" },
        relatedSlugs: ["hash-generator", "json-viewer", "base64-text-encoder"],
        faq: [
            { q: "Is JWT Decoder free?", a: "Yes, completely free." },
            { q: "Does it send my token to a server?", a: "No. All decoding happens locally in your browser. Your token is never sent anywhere." },
            {
                q: "Can it verify the JWT signature?",
                a: "No. Signature verification requires the secret key. This tool only decodes the header and payload."
            }
        ]
    },

    "lorem-ipsum-generator": {
        slug: "lorem-ipsum-generator",
        title: "Lorem Ipsum Generator — Placeholder Text Online",
        metaDescription: "Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Free browser-based tool on DevDeck.",
        metaKeywords: "lorem ipsum generator, placeholder text, dummy text generator, lorem ipsum online, filler text",
        intro: "Lorem ipsum is the industry-standard placeholder text used in design mockups, wireframes, and prototypes. Generate exactly the amount you need — by paragraphs, sentences, or words — instantly.",
        sections: [
            {
                heading: "What is Lorem Ipsum?",
                body: "Lorem ipsum is dummy text derived from a passage of Cicero's De Finibus Bonorum et Malorum from 45 BC. It has been the standard placeholder text for typesetting since the 1500s. It looks natural because it has similar word length distribution to real Latin text, without meaningful content distracting reviewers."
            },
            {
                heading: "Why Use Lorem Ipsum?",
                body: "Using real content in mockups causes reviewers to focus on the words rather than the layout. Lorem ipsum shifts attention to design: typography, spacing, alignment, and visual hierarchy. It's a communication tool between designers and developers."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Generate text by paragraphs, sentences, or words",
                    "Configurable output length",
                    "Copy to clipboard with one click",
                    "Instant — no waiting",
                    "Free with no account needed"
                ]
            },
            {
                heading: "How to Use Lorem Ipsum Generator",
                steps: [
                    "Choose output type: paragraphs, sentences, or words",
                    "Set the quantity you need",
                    "Click Generate",
                    "Copy and paste into your design or prototype"
                ]
            },
            {
                heading: "Example Use Case",
                body: "You're building a blog template and need content to test how long paragraphs look in the design. Generate 3 paragraphs of lorem ipsum, paste into the template, and adjust line-height and font-size until the reading experience is comfortable."
            },
            {
                heading: "Tips",
                list: [
                    "Use sentence-level generation for UI labels and button text mockups",
                    "Use paragraph-level for blog post and article layout testing",
                    "Word-level is good for short placeholder labels",
                    "Never ship lorem ipsum text to production — replace before launch"
                ]
            }
        ],
        cta: { label: "Try Lorem Ipsum Generator →", toolRoute: "/lorem-ipsum" },
        relatedSlugs: ["word-counter", "text-case-converter", "text-diff-checker"],
        faq: [
            { q: "Is Lorem Ipsum Generator free?", a: "Yes, completely free." },
            {
                q: "Where does lorem ipsum come from?",
                a: "It's derived from Cicero's philosophical work De Finibus Bonorum et Malorum, scrambled to be meaningless."
            },
            {
                q: "Can I customize the generated text?",
                a: "You can set the quantity (paragraphs/sentences/words). Custom vocabulary is not supported."
            }
        ]
    },

    "number-base-converter": {
        slug: "number-base-converter",
        title: "Number Base Converter — Binary, Hex, Octal, Decimal",
        metaDescription: "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Supports large numbers. Free on DevDeck.",
        metaKeywords: "number base converter, binary to decimal, hex to decimal, octal converter, base conversion, binary hex octal",
        intro: "Computers think in binary. Programmers read hex. Humans use decimal. Number Base Converter instantly translates between binary (base-2), octal (base-8), decimal (base-10), and hexadecimal (base-16) — all at once.",
        sections: [
            {
                heading: "What is Number Base Conversion?",
                body: "Number base conversion changes how a number is represented without changing its value. The number 255 in decimal is FF in hex, 11111111 in binary, and 377 in octal. They're all the same value, just written in different numeral systems."
            },
            {
                heading: "Why Use a Number Base Converter?",
                body: "Low-level programming, networking, and computer science require working across multiple bases. IP addresses and subnet masks are often shown in decimal and binary simultaneously. Color codes use hex. Assembly and bitwise operations require binary. Having instant cross-base conversion saves mental effort."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Convert between binary, octal, decimal, and hex simultaneously",
                    "All representations update as you type",
                    "Supports large numbers",
                    "No installation needed",
                    "Copy any base representation instantly"
                ]
            },
            {
                heading: "How to Use Number Base Converter",
                steps: [
                    "Enter a number in any base field",
                    "All other bases update instantly",
                    "Copy the representation you need",
                    "Clear and enter a new number"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Working on a bitwise permissions system where flags are stored as integers. The value 45 in decimal needs to be checked as bits. Enter 45 → binary shows `101101` → bits 0, 2, 3, 5 are set → permissions map confirmed."
            },
            {
                heading: "Tips",
                list: [
                    "Hex values are often prefixed with 0x in code (0xFF = 255)",
                    "Binary values can be prefixed with 0b (0b11111111 = 255)",
                    "Octal is less common today but used in Unix file permissions (chmod 755)",
                    "All conversions are integers — this tool does not handle fractional bases"
                ]
            }
        ],
        cta: { label: "Try Number Base Converter →", toolRoute: "/number-base" },
        relatedSlugs: ["hash-generator", "timestamp-converter", "regex-tester"],
        faq: [
            { q: "Is Number Base Converter free?", a: "Yes, completely free." },
            { q: "Does it support floating point numbers?", a: "No. The converter handles integers only." },
            {
                q: "What is hexadecimal used for?",
                a: "Hex is used for color codes (#FF0000), memory addresses, binary file inspection, and network packets."
            }
        ]
    },

    "password-generator": {
        slug: "password-generator",
        title: "Password Generator & Strength Meter",
        metaDescription:
            "Generate secure random passwords with custom length and character sets. Analyze password strength with crack-time estimation. Free on DevDeck.",
        metaKeywords: "password generator, strong password, random password, password strength meter, secure password, password creator",
        intro: "Weak passwords are the leading cause of account breaches. Password Generator creates cryptographically random passwords with configurable complexity, and the built-in strength meter tells you exactly how secure each password is.",
        sections: [
            {
                heading: "What is a Password Generator?",
                body: "A password generator creates random character sequences using a cryptographically secure random number generator. You configure the length and which character sets to include (uppercase, lowercase, numbers, symbols), and it produces a password that's practically impossible to brute-force."
            },
            {
                heading: "Why Generate Passwords Instead of Creating Your Own?",
                body: "Humans are terrible at creating truly random passwords. We reuse patterns, use dictionary words, and avoid symbols. A generator produces genuinely unpredictable passwords, making dictionary attacks and pattern-based brute-force ineffective."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Cryptographically secure random generation",
                    "Configurable length (8–128+ characters)",
                    "Toggle uppercase, lowercase, numbers, symbols",
                    "Built-in strength meter with crack-time estimation",
                    "Copy to clipboard — nothing stored anywhere"
                ]
            },
            {
                heading: "How to Use Password Generator",
                steps: [
                    "Set desired password length",
                    "Toggle character sets (uppercase, lowercase, numbers, symbols)",
                    "Click Generate (or it updates as you adjust)",
                    "Check strength meter",
                    "Copy and store in a password manager"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Setting up a new server database user. Requirements: 20+ characters, must include symbols. Set length to 24, enable all character sets, generate, check strength meter (should show 'Very Strong'), copy into your password manager."
            },
            {
                heading: "Tips",
                list: [
                    "Use a password manager (1Password, Bitwarden) to store generated passwords",
                    "Never reuse passwords across sites",
                    "16+ characters with mixed types is effectively uncrackable with current hardware",
                    "For passphrases, use 4+ random words instead (diceware method)"
                ]
            }
        ],
        cta: { label: "Try Password Generator →", toolRoute: "/password-tools" },
        relatedSlugs: ["hash-generator", "uuid-generator", "base64-text-encoder"],
        faq: [
            { q: "Is Password Generator free?", a: "Yes, completely free." },
            { q: "Are generated passwords stored?", a: "No. Passwords are generated client-side and never sent to any server." },
            { q: "How long should my password be?", a: "At minimum 12 characters. 16+ with mixed character types is recommended for most accounts." }
        ]
    },

    "qr-code-generator": {
        slug: "qr-code-generator",
        title: "QR Code Generator — Free Online QR Creator",
        metaDescription: "Generate QR codes from any text or URL. Add custom logo overlay. Download as PNG. Free browser-based tool on DevDeck.",
        metaKeywords: "qr code generator, free qr code, qr creator, qr code online, generate qr, qr from url",
        intro: "QR codes bridge the physical and digital world. Generate a QR code for any URL, contact, WiFi credentials, or text — instantly, with optional logo overlay and downloadable PNG.",
        sections: [
            {
                heading: "What is a QR Code?",
                body: "A QR (Quick Response) code is a 2D barcode that smartphones can scan with their camera to instantly access a URL, read text, connect to WiFi, or open contact info. They encode data as a grid of black and white squares."
            },
            {
                heading: "Why Use a QR Code Generator?",
                body: "QR codes appear on business cards, product packaging, event posters, restaurant menus, and marketing materials. Generating one requires no app — just a browser. You can customize the content and download a high-resolution PNG for print or digital use."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Generate QR codes from any text, URL, or data string",
                    "Add a logo or icon overlay to the center",
                    "Download as PNG at multiple resolutions",
                    "Instant generation — no server required",
                    "Free with no account"
                ]
            },
            {
                heading: "How to Use QR Code Generator",
                steps: [
                    "Type or paste the URL or text to encode",
                    "QR code generates instantly",
                    "Optionally upload a logo for the center overlay",
                    "Adjust size if needed",
                    "Click Download to save as PNG"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Printing flyers for an event. You want attendees to scan to register. Enter the registration URL → generate QR code → download PNG → drop into your design file. Add the QR to the flyer and print."
            },
            {
                heading: "Tips",
                list: [
                    "Shorter URLs produce simpler, more scannable QR codes",
                    "Use URL shortener to simplify long links before encoding",
                    "Test scan quality before mass printing",
                    "Minimum print size is about 2cm × 2cm for reliable scanning"
                ]
            }
        ],
        cta: { label: "Try QR Code Generator →", toolRoute: "/qr-generator" },
        relatedSlugs: ["url-shortener", "base64-image-converter", "image-resizer"],
        faq: [
            { q: "Is QR Code Generator free?", a: "Yes, completely free." },
            {
                q: "What can I encode in a QR code?",
                a: "Any text or URL. Common uses: website links, WiFi passwords, contact vCards, plain text messages."
            },
            {
                q: "Does adding a logo reduce scannability?",
                a: "QR codes have built-in error correction. A centered logo covering up to ~30% of the code still scans correctly."
            }
        ]
    },

    "regex-tester": {
        slug: "regex-tester",
        title: "Regex Tester — Test Regular Expressions Online",
        metaDescription: "Test regular expressions with live match highlighting. Supports JavaScript regex flags. Free on DevDeck.",
        metaKeywords: "regex tester, regular expression tester, regex online, test regex, regexp validator, regex debugger",
        intro: "Regular expressions are powerful but notoriously hard to write and debug. Regex Tester shows live match highlighting as you type the pattern, so you instantly see what your regex does — and catches mistakes before they hit production.",
        sections: [
            {
                heading: "What is a Regex Tester?",
                body: "A regex tester provides an interactive environment where you enter a regular expression pattern and a test string, and it highlights all matches in real time. It shows captured groups, match positions, and whether the pattern compiles without errors."
            },
            {
                heading: "Why Use a Regex Tester?",
                body: "Regex syntax is dense and error-prone. A small typo creates a pattern that matches nothing — or worse, matches everything. Real-time visual feedback shows exactly what your pattern captures, catches syntax errors immediately, and lets you iterate without rerunning code."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Live match highlighting as you type",
                    "Shows all captures and groups",
                    "Supports flags: g, i, m, s",
                    "Syntax error messages shown immediately",
                    "No page reload — instant feedback"
                ]
            },
            {
                heading: "How to Use Regex Tester",
                steps: [
                    "Enter your regex pattern (without slashes)",
                    "Set flags (global, case-insensitive, multiline, etc.)",
                    "Paste test text",
                    "Matches highlight in real time",
                    "Adjust pattern until you get the expected matches"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Writing a validation regex for email addresses. Enter the pattern, paste a list of test emails (valid and invalid), and the highlighter shows which ones match. Adjust the pattern until valid emails highlight and invalid ones don't."
            },
            {
                heading: "Tips",
                list: [
                    "Use ^ and $ anchors to match full string, not just a substring",
                    "The g flag finds all matches, not just the first",
                    "Use (?:...) for non-capturing groups",
                    "Escape special characters like . * + ? with backslash"
                ]
            }
        ],
        cta: { label: "Try Regex Tester →", toolRoute: "/regex-tester" },
        relatedSlugs: ["text-diff-checker", "json-viewer", "text-case-converter"],
        faq: [
            { q: "Is Regex Tester free?", a: "Yes, completely free." },
            {
                q: "Which regex flavor does it use?",
                a: "JavaScript regex (ECMAScript). Most patterns are compatible with other languages with minor adjustments."
            },
            {
                q: "Does it support lookahead and lookbehind?",
                a: "Yes. JavaScript regex supports (?=...) lookahead and (?<=...) lookbehind in modern browsers."
            }
        ]
    },

    "text-case-converter": {
        slug: "text-case-converter",
        title: "Text Case Converter — UPPER, lower, camelCase",
        metaDescription:
            "Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, PascalCase, and kebab-case. Free on DevDeck.",
        metaKeywords: "text case converter, camelcase converter, snake case, uppercase lowercase, title case, kebab case, pascal case",
        intro: "Different coding conventions demand different text cases: API fields use camelCase, Python uses snake_case, CSS uses kebab-case, constants use UPPER_CASE. Text Case Converter transforms any text between all these formats instantly.",
        sections: [
            {
                heading: "What is Text Case Conversion?",
                body: "Text case conversion changes the capitalization format of a string. The same phrase 'hello world' becomes HELLO WORLD, Hello World, helloWorld, hello_world, or hello-world depending on the target convention."
            },
            {
                heading: "Why Use a Text Case Converter?",
                body: "Renaming variables, formatting database column names, preparing API field names, or transforming user input — case conversion is a constant developer task. Doing it manually is error-prone especially for multi-word identifiers. The converter handles it instantly."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Converts to UPPER, lower, Title, camelCase, PascalCase, snake_case, kebab-case",
                    "Processes multi-word strings correctly",
                    "Copy each format independently",
                    "Handles special characters and numbers",
                    "Instant — no page reload"
                ]
            },
            {
                heading: "How to Use Text Case Converter",
                steps: [
                    "Paste or type your text",
                    "All case variants appear immediately",
                    "Click to copy the format you need",
                    "Use for variable names, column names, labels, etc."
                ]
            },
            {
                heading: "Example Use Case",
                body: "You have a CSV column named `First Name` and need to map it to a JavaScript object key. Enter `First Name` → camelCase gives `firstName`, snake_case gives `first_name`, PascalCase gives `FirstName`. Pick the one matching your codebase convention."
            },
            {
                heading: "Tips",
                list: [
                    "camelCase: JavaScript object keys, JSON fields",
                    "PascalCase: React components, class names",
                    "snake_case: Python variables, SQL columns",
                    "kebab-case: CSS class names, URL slugs, HTML attributes",
                    "UPPER_CASE: constants in most languages"
                ]
            }
        ],
        cta: { label: "Try Text Case Converter →", toolRoute: "/text-case" },
        relatedSlugs: ["word-counter", "text-diff-checker", "lorem-ipsum-generator"],
        faq: [
            { q: "Is Text Case Converter free?", a: "Yes, completely free." },
            {
                q: "Does it handle numbers and special characters?",
                a: "Yes. Numbers are kept in place. Special characters are handled per each format's rules."
            },
            {
                q: "What is the difference between camelCase and PascalCase?",
                a: "camelCase starts lowercase (helloWorld), PascalCase starts uppercase (HelloWorld)."
            }
        ]
    },

    "text-diff-checker": {
        slug: "text-diff-checker",
        title: "Text Diff Tool — Compare Two Texts Online",
        metaDescription: "Compare two text blocks with word-level diff highlighting. See additions and deletions at a glance. Free on DevDeck.",
        metaKeywords: "text diff, compare text online, diff tool, text compare, find differences in text, text comparison",
        intro: "Spotting differences between two versions of text — code, config, documents — is tedious without tooling. Text Diff highlights exactly what changed between two inputs, word by word.",
        sections: [
            {
                heading: "What is a Text Diff Tool?",
                body: "A diff tool compares two text inputs and highlights what's been added, removed, or changed. Added content appears in green, removed content in red. This makes it immediately clear what changed without reading both versions line by line."
            },
            {
                heading: "Why Use a Text Diff Tool?",
                body: "Code reviews, document version comparison, config file auditing, and debugging copy-paste errors all benefit from diff tooling. Without it, you read both versions manually and miss subtle differences. A visual diff spots them instantly."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Word-level diff highlighting",
                    "Added text in green, removed in red",
                    "Handles multi-line text blocks",
                    "Instant comparison — no page reload",
                    "100% client-side"
                ]
            },
            {
                heading: "How to Use Text Diff",
                steps: [
                    "Paste the original text in the left panel",
                    "Paste the modified text in the right panel",
                    "Differences highlight automatically",
                    "Green = added, Red = removed"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Two developers edited the same config file in different branches. Paste both versions into Text Diff — the changes are highlighted immediately: a changed API URL in one line, a new environment variable added, a comment removed. No manual line-by-line reading needed."
            },
            {
                heading: "Tips",
                list: [
                    "For code diffs, Git is more appropriate — this tool is best for plain text",
                    "Remove extra whitespace before comparing if formatting varies",
                    "Useful for comparing AI-generated outputs with originals",
                    "Good for catching typos between draft and final document versions"
                ]
            }
        ],
        cta: { label: "Try Text Diff →", toolRoute: "/text-diff" },
        relatedSlugs: ["text-case-converter", "word-counter", "regex-tester"],
        faq: [
            { q: "Is Text Diff free?", a: "Yes, completely free." },
            { q: "Does it support line-level diff?", a: "Yes. The diff shows both word-level and line-level differences." },
            { q: "Can I compare code with this tool?", a: "Yes for small snippets. For large codebases, use Git diff instead." }
        ]
    },

    "timestamp-converter": {
        slug: "timestamp-converter",
        title: "Unix Timestamp Converter — Epoch to Date & Time",
        metaDescription:
            "Convert Unix timestamps to human-readable dates and dates back to Unix epoch time. Supports seconds and milliseconds. Free on DevDeck.",
        metaKeywords: "unix timestamp converter, epoch to date, timestamp to date, date to unix timestamp, epoch time, unix time",
        intro: "Unix timestamps are the number of seconds (or milliseconds) since January 1, 1970 UTC. They appear in logs, databases, and APIs everywhere — but `1714492800` is unreadable to humans. Timestamp Converter translates instantly.",
        sections: [
            {
                heading: "What is a Unix Timestamp?",
                body: "A Unix timestamp (epoch time) is the number of seconds elapsed since 00:00:00 UTC on January 1, 1970 (the Unix epoch). It's a universal, timezone-independent way to represent a moment in time used across databases, APIs, file systems, and logs."
            },
            {
                heading: "Why Convert Timestamps?",
                body: "Debugging logs, validating JWT expiry times (the `exp` claim is a Unix timestamp), reading database records with datetime columns stored as integers, or working with APIs that return epoch time — all require converting back to human-readable dates."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Convert epoch timestamp → UTC date and local time",
                    "Convert date/time → Unix timestamp",
                    "Supports seconds and milliseconds",
                    "Shows both UTC and local timezone",
                    "Current timestamp displayed in real time"
                ]
            },
            {
                heading: "How to Use Timestamp Converter",
                steps: [
                    "Enter a Unix timestamp (seconds or milliseconds)",
                    "See the human-readable date and time instantly",
                    "Or enter a date to get the Unix timestamp",
                    "Copy the result"
                ]
            },
            {
                heading: "Example Use Case",
                body: "A JWT's `exp` field shows `1714492800`. Is the token still valid? Enter the value into Timestamp Converter → it shows April 30, 2024, 16:00:00 UTC. Compare with now — if past, the token is expired."
            },
            {
                heading: "Tips",
                list: [
                    "JavaScript Date.now() returns milliseconds since epoch",
                    "Most Unix tools use seconds",
                    "MySQL UNIX_TIMESTAMP() returns seconds",
                    "Year 2038 problem: 32-bit signed timestamps overflow on Jan 19, 2038"
                ]
            }
        ],
        cta: { label: "Try Timestamp Converter →", toolRoute: "/timestamp" },
        relatedSlugs: ["number-base-converter", "hash-generator", "uuid-generator"],
        faq: [
            { q: "Is Timestamp Converter free?", a: "Yes, completely free." },
            { q: "What is the Unix epoch?", a: "January 1, 1970, 00:00:00 UTC. All Unix timestamps count from this moment." },
            {
                q: "How do I get the current Unix timestamp in JavaScript?",
                a: "Use Math.floor(Date.now() / 1000) for seconds, or Date.now() for milliseconds."
            }
        ]
    },

    "url-parser": {
        slug: "url-parser",
        title: "URL Validator & Parser — Check URL Structure Online",
        metaDescription: "Validate URL structure, check HTTP status codes, strip UTM parameters, and inspect URL components. Free on DevDeck.",
        metaKeywords: "url validator, url parser, http status checker, check url, url structure, url components, utm stripper",
        intro: "A URL contains protocol, domain, path, query parameters, and fragments — each with its own rules. URL Validator breaks any URL into its components and checks whether it's well-formed and reachable.",
        sections: [
            {
                heading: "What is a URL Validator?",
                body: "A URL validator checks whether a URL is syntactically correct and optionally tests whether the server responds. It also parses the URL into its parts: protocol (https), host (example.com), path (/blog/post), query (?id=1), and fragment (#section)."
            },
            {
                heading: "Why Validate and Parse URLs?",
                body: "Broken links, malformed URLs with encoding issues, URLs with UTM parameters that need stripping, or redirect chains — these are everyday problems. Parsing lets you inspect each URL component, strip tracking parameters, or validate user-submitted links before storing them."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Parse any URL into its components",
                    "Validate URL structure",
                    "Check HTTP status code",
                    "Strip UTM and tracking parameters",
                    "Detect redirects"
                ]
            },
            {
                heading: "How to Use URL Validator",
                steps: [
                    "Paste the URL",
                    "View parsed components (protocol, host, path, params, fragment)",
                    "Optionally check HTTP status",
                    "Copy cleaned URL with tracking params removed"
                ]
            },
            {
                heading: "Example Use Case",
                body: "An affiliate link has 15 query parameters including UTM tags. You want the clean URL for documentation. Paste into URL Validator → view all parameters → copy the base URL without UTM parameters."
            },
            {
                heading: "Tips",
                list: [
                    "Always encode special characters in URLs (%20 for spaces)",
                    "Fragment (#section) is client-side only — not sent to server",
                    "UTM parameters are for analytics tracking — safe to strip for clean links",
                    "HTTPS is required for modern web security (HSTS)"
                ]
            }
        ],
        cta: { label: "Try URL Validator →", toolRoute: "/url-validator" },
        relatedSlugs: ["url-shortener", "regex-tester", "json-viewer"],
        faq: [
            { q: "Is URL Validator free?", a: "Yes, completely free." },
            { q: "Does it make HTTP requests?", a: "Status checking makes an HTTP request to the URL. URL parsing is purely client-side." },
            {
                q: "What are UTM parameters?",
                a: "UTM parameters (utm_source, utm_medium, utm_campaign, etc.) are tracking tags added to URLs for analytics. They don't affect the destination page."
            }
        ]
    },

    "url-shortener": {
        slug: "url-shortener",
        title: "URL Shortener — Shorten Long Links Free",
        metaDescription: "Shorten any long URL into a compact shareable link. Powered by Short.io. Free on DevDeck.",
        metaKeywords: "url shortener, shorten url, short link, short.io, link shortener, compact url",
        intro: "Long URLs are awkward in messages, tweets, and printed materials. URL Shortener converts any URL into a short, shareable link instantly — useful for social media, SMS, QR codes, and anywhere character count matters.",
        sections: [
            {
                heading: "What is a URL Shortener?",
                body: "A URL shortener takes a long URL and maps it to a short redirect URL. When someone visits the short URL, they're immediately redirected to the original destination. The short URL takes up less space and is easier to share."
            },
            {
                heading: "Why Shorten URLs?",
                body: "Twitter has a character limit. SMS messages cost per character segment. QR codes become harder to scan as content gets longer. Printed URLs in brochures need to be memorable. Short links solve all these problems and can also be tracked for click analytics."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Shorten any URL to a compact link",
                    "Powered by Short.io for reliability",
                    "Copy short link with one click",
                    "Works for any public URL",
                    "Free to use"
                ]
            },
            {
                heading: "How to Use URL Shortener",
                steps: ["Paste your long URL", "Click Shorten", "Get the short link instantly", "Copy and share"]
            },
            {
                heading: "Example Use Case",
                body: "Sharing a GitHub PR review link in a Slack message. The URL is 180 characters. Shorten it → get a compact link → paste in Slack. Cleaner message, same destination."
            },
            {
                heading: "Tips",
                list: [
                    "Combine with QR Generator to create a scannable short link",
                    "Short links can be used in print where long URLs are impractical",
                    "Use URL Validator to clean UTM params from the long URL before shortening",
                    "Short links from third-party services depend on the service staying up"
                ]
            }
        ],
        cta: { label: "Try URL Shortener →", toolRoute: "/url-shortener" },
        relatedSlugs: ["url-parser", "qr-code-generator", "hash-generator"],
        faq: [
            { q: "Is URL Shortener free?", a: "Yes, completely free." },
            { q: "What service powers the shortening?", a: "DevDeck uses Short.io for URL shortening." },
            { q: "Do shortened links expire?", a: "Link expiry depends on the Short.io service configuration." }
        ]
    },

    "uuid-generator": {
        slug: "uuid-generator",
        title: "UUID Generator — Generate UUID v4 Online",
        metaDescription: "Generate one or multiple UUID v4 values with a single click. Copy to clipboard instantly. Free on DevDeck.",
        metaKeywords: "uuid generator, guid generator, uuid v4, random uuid, unique id generator online, universally unique identifier",
        intro: "UUIDs are the standard way to generate unique identifiers without a central authority. UUID v4 is randomly generated, making collisions practically impossible — perfect for database primary keys, file names, session IDs, and API resources.",
        sections: [
            {
                heading: "What is a UUID?",
                body: "A UUID (Universally Unique Identifier) is a 128-bit number represented as a 32-character hexadecimal string in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. UUID v4 is generated using random or pseudo-random numbers. There are 5.3 × 10³⁶ possible UUIDs — making collisions astronomically unlikely."
            },
            {
                heading: "Why Use UUIDs?",
                body: "Sequential integer IDs expose information (how many records exist, the order they were created). They also create challenges in distributed systems where multiple nodes insert records simultaneously. UUIDs solve both: they're opaque and can be generated independently on any client without coordination."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Generate single or bulk UUIDs (up to 100 at once)",
                    "RFC 4122 compliant UUID v4",
                    "Uses browser's native crypto.randomUUID()",
                    "Copy individually or all at once",
                    "Free with no account"
                ]
            },
            {
                heading: "How to Use UUID Generator",
                steps: [
                    "Click Generate for one UUID",
                    "Set count for bulk generation",
                    "Copy individual UUIDs or click Copy All",
                    "Paste into your code, database, or config"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Seeding a database with test records. Each record needs a unique ID before insert (so foreign keys can be set up ahead of time). Generate 50 UUIDs at once, copy all, paste into the seed script."
            },
            {
                heading: "Tips",
                list: [
                    "UUID v4 is the most common — use it unless you have a specific reason for v1 or v5",
                    "UUIDs are case-insensitive — both uppercase and lowercase are valid",
                    "Storing UUIDs in databases: use a UUID type column or CHAR(36)",
                    "UUID v1 includes timestamp and MAC address — UUID v4 is preferable for privacy"
                ]
            }
        ],
        cta: { label: "Try UUID Generator →", toolRoute: "/uuid-generator" },
        relatedSlugs: ["hash-generator", "password-generator", "timestamp-converter"],
        faq: [
            { q: "Is UUID Generator free?", a: "Yes, completely free." },
            {
                q: "Are generated UUIDs truly unique?",
                a: "UUID v4 collision probability is negligible (1 in 2¹²² for any two UUIDs). For practical purposes, they are unique."
            },
            {
                q: "What is the difference between UUID and GUID?",
                a: "They are the same thing. GUID (Globally Unique Identifier) is Microsoft's term for UUID."
            }
        ]
    },

    "word-counter": {
        slug: "word-counter",
        title: "Word Counter & Character Counter — Online Tool",
        metaDescription: "Count words, characters, lines, sentences, and paragraphs. Get reading time estimate. Free browser-based tool on DevDeck.",
        metaKeywords: "word counter, character counter, word count online, reading time calculator, text analyzer, character count",
        intro: "Whether you're writing a tweet (280 chars), a cover letter (400 words), or a blog post (800 words), knowing your word and character count is essential. Word Counter gives you complete text statistics in real time.",
        sections: [
            {
                heading: "What is a Word Counter?",
                body: "A word counter analyzes a text input and returns statistics: total words, characters (with and without spaces), sentences, paragraphs, lines, and estimated reading time. It updates in real time as you type or paste."
            },
            {
                heading: "Why Count Words and Characters?",
                body: "Platform limits require knowing character counts: Twitter (280), LinkedIn headline (220), SMS (160 per segment), meta descriptions (155). Editors set word count targets for articles. SEO requires hitting content length minimums. Reading time helps set reader expectations."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Real-time word, character, sentence, paragraph count",
                    "Reading time estimate",
                    "Character count with and without spaces",
                    "Instant — no typing submit button",
                    "Free with no account"
                ]
            },
            {
                heading: "How to Use Word Counter",
                steps: [
                    "Paste or type your text",
                    "All statistics update instantly",
                    "Check the count you need (words, chars, reading time)",
                    "Clear and paste new content anytime"
                ]
            },
            {
                heading: "Example Use Case",
                body: "Writing a meta description for an SEO page. It must be 150–160 characters. Paste your draft → character count shows 183 → trim to 158 → just right. No guessing."
            },
            {
                heading: "Tips",
                list: [
                    "Average reading speed is 200–250 words per minute",
                    "Blog posts perform well at 1,000–2,000 words for SEO",
                    "Twitter: 280 chars max (URLs count as 23 chars regardless of length)",
                    "Meta description: 150–160 chars for full display in Google search results"
                ]
            }
        ],
        cta: { label: "Try Word Counter →", toolRoute: "/word-counter" },
        relatedSlugs: ["text-case-converter", "text-diff-checker", "lorem-ipsum-generator"],
        faq: [
            { q: "Is Word Counter free?", a: "Yes, completely free." },
            { q: "Does it store my text?", a: "No. Everything runs locally in your browser." },
            { q: "How is reading time calculated?", a: "Based on average adult reading speed of 225 words per minute." }
        ]
    },

    "yaml-to-json-converter": {
        slug: "yaml-to-json-converter",
        title: "YAML to JSON Converter — Online YAML Parser",
        metaDescription: "Convert YAML to JSON and JSON to YAML with syntax error feedback. Handles nested structures. Free on DevDeck.",
        metaKeywords: "yaml to json, json to yaml, yaml converter, yaml parser online, yaml formatter, yaml json",
        intro: "YAML is the language of configuration files — Kubernetes, Docker Compose, GitHub Actions, Ansible all use it. But APIs speak JSON. Convert between both formats instantly with syntax validation and error highlighting.",
        sections: [
            {
                heading: "What is YAML?",
                body: "YAML (YAML Ain't Markup Language) is a human-readable data serialization format that uses indentation to represent structure. It's more readable than JSON — no braces, quotes are optional for strings, and comments are supported. It's the standard format for DevOps configuration files."
            },
            {
                heading: "Why Convert Between YAML and JSON?",
                body: "Tools like Kubernetes, Helm, and GitHub Actions use YAML. REST APIs and JavaScript apps use JSON. You often need to convert between them: turning a YAML config into JSON for an API call, or converting a JSON API response into YAML for a config template."
            },
            {
                heading: "Key Benefits",
                list: [
                    "Convert YAML → JSON and JSON → YAML",
                    "Live syntax error highlighting",
                    "Handles nested objects and arrays",
                    "Formatted output with proper indentation",
                    "100% client-side — nothing sent to server"
                ]
            },
            {
                heading: "How to Use YAML/JSON Converter",
                steps: [
                    "Paste your YAML or JSON in the input",
                    "Select conversion direction",
                    "Converted output appears instantly",
                    "Fix any syntax errors shown in the error panel",
                    "Copy the result"
                ]
            },
            {
                heading: "Example Use Case",
                body: "You have a Kubernetes deployment manifest in YAML. A tool you're using only accepts JSON input. Paste the YAML → convert to JSON → paste into the tool. Or reverse: take a JSON API schema and convert to YAML for a Helm chart values file."
            },
            {
                heading: "Tips",
                list: [
                    "YAML is indentation-sensitive — use consistent 2 or 4 spaces (not tabs)",
                    "YAML supports comments (#), JSON does not",
                    "YAML strings don't need quotes unless they contain special characters",
                    "Boolean values in YAML: true/false (lowercase) — not True or TRUE"
                ]
            }
        ],
        cta: { label: "Try YAML/JSON Converter →", toolRoute: "/yaml-json" },
        relatedSlugs: ["json-viewer", "csv-to-json-converter", "regex-tester"],
        faq: [
            { q: "Is YAML/JSON Converter free?", a: "Yes, completely free." },
            { q: "Does it store my data?", a: "No. All conversion happens locally in your browser." },
            { q: "Can YAML represent everything JSON can?", a: "Yes. YAML is a superset of JSON — valid JSON is also valid YAML." }
        ]
    },

    "api-request-builder": {
        slug: "api-request-builder",
        title: "API Request Builder — Test HTTP Endpoints in Your Browser",
        metaDescription:
            "Build and fire HTTP requests directly from your browser — no Postman, no curl. Test REST APIs with custom headers, JSON body, and real-time response inspection.",
        metaKeywords: "api request builder, http client online, test api online, rest client browser, api tester, http request tool, postman alternative",
        intro: "Testing an API endpoint usually means firing up Postman, writing a curl command, or switching to a terminal. DevDeck's API Request Builder lets you do it all in one tab — pick a method, enter a URL, add headers, send the request, and inspect the response without leaving your browser.",
        sections: [
            {
                heading: "What is an API Request Builder?",
                body: "An API request builder is a tool that lets you construct and send HTTP requests without writing code or installing a desktop app. You choose a method (GET, POST, PUT, DELETE, PATCH), enter a URL, optionally add request headers and a body, and then fire the request. The response — status code, timing, headers, and body — is displayed immediately."
            },
            {
                heading: "Why Use a Browser-Based API Tester?",
                body: "Desktop tools like Postman are powerful but heavy. curl is fast but requires a terminal and remembering flag syntax. A browser-based builder gives you a clean UI with zero installation. It's perfect for quick endpoint checks, debugging webhook payloads, exploring public APIs, or sharing a reproducible request with a colleague — just copy the URL."
            },
            {
                heading: "Key Features",
                list: [
                    "GET, POST, PUT, DELETE, and PATCH method support",
                    "Custom request headers with key/value editor",
                    "JSON and form-encoded request body",
                    "Real-time response with status code and timing",
                    "Colour-coded JSON response viewer with syntax highlighting",
                    "Response headers tab with all returned header values",
                    "Paste a cURL command directly into the URL field — it auto-parses",
                    "Code snippet export in 12 languages: cURL, fetch, axios, XHR, Node.js, Python, Go, PHP, Ruby, Swift, C#, and Java",
                    "Send response body directly to JSON Viewer for deeper inspection",
                    "No data leaves your device — requests are sent directly from your browser"
                ]
            },
            {
                heading: "How to Use the API Request Builder",
                steps: [
                    "Select an HTTP method (GET, POST, PUT, DELETE, or PATCH)",
                    "Enter the full URL of the endpoint you want to test",
                    "Add any required headers in the Headers tab (e.g. Authorization, Content-Type)",
                    "For POST/PUT/PATCH, switch to the Body tab and enter your JSON payload",
                    "Click SEND — the response appears instantly in the right panel",
                    "Use the Body / Headers tabs in the response panel to inspect the result",
                    "Click the </> button to export the request as runnable code in any language"
                ]
            },
            {
                heading: "Paste a cURL Command and It Just Works",
                body: "One of the most useful features: paste any curl command directly into the URL field and the builder automatically parses it — extracting the method, URL, headers, and body. This means you can copy a curl snippet from API documentation or a terminal and immediately have it loaded in the visual editor, ready to tweak and re-send."
            },
            {
                heading: "Export as Code Snippets",
                body: "Once you've built your request, click the </> icon next to the URL bar to open the Code Snippet panel. Choose from 12 languages and runtimes — cURL, JavaScript (fetch), JavaScript (axios), XHR, Node.js (http), Python (requests), Go, PHP, Ruby, Swift, C# (HttpClient), and Java (OkHttp). The snippet updates live as you change the method, URL, headers, or body, so you always have ready-to-paste code."
            },
            {
                heading: "Understanding CORS Limitations",
                body: "Because requests are sent from your browser rather than a server, you may encounter CORS (Cross-Origin Resource Sharing) errors when testing APIs that don't allow browser-based requests. This is a browser security restriction, not a bug in the tool. Public APIs and APIs you control will generally work fine. For restricted APIs, use the exported code snippet to run the request from a server-side environment like Node.js or Python instead."
            },
            {
                heading: "Tips",
                list: [
                    "Set Content-Type: application/json when sending a JSON body — many APIs require it",
                    "Use the Authorization header with Bearer <token> for protected endpoints",
                    "Paste a cURL command directly into the command palette to jump to the API Request Builder with it preloaded",
                    "Use the Prettify button in the response panel to auto-format minified JSON",
                    "Forward a JSON response to the JSON Viewer using the Send To button for tree browsing",
                    "The timing shown (e.g. 142ms) is round-trip time from your browser to the server",
                    "cURL snippets generated by the tool include all headers and body, ready to run in a terminal"
                ]
            }
        ],
        cta: { label: "Try API Request Builder →", toolRoute: "/api-builder" },
        relatedSlugs: ["json-viewer", "jwt-decoder", "url-parser"],
        faq: [
            { q: "Is the API Request Builder free?", a: "Yes, completely free with no signup required." },
            { q: "Does it store my requests or responses?", a: "No. All requests are sent directly from your browser and nothing is stored on any server." },
            { q: "Why am I getting a CORS error?", a: "Requests run from your browser, so APIs that don't set permissive CORS headers will block them. This is a browser security policy. Use the exported code snippet to make the same request from a server-side environment." },
            { q: "Can I test authenticated APIs?", a: "Yes. Add an Authorization header with your token (e.g. Bearer eyJ...) in the Headers tab." },
            { q: "What is the request timeout?", a: "Requests time out after 10 seconds. If a server doesn't respond within that window you'll see a timeout error." },
            { q: "How do I test a POST request with a JSON body?", a: "Select POST, enter the URL, add a Content-Type: application/json header, switch to the Body tab, enter your JSON, and click SEND." },
            { q: "Can I import a cURL command?", a: "Yes. Paste any curl command directly into the URL input and the builder will automatically parse the method, URL, headers, and body." }
        ]
    }
};

export default blogData;

// Ordered list for the blog index page
export const blogList = [
    blogData["api-request-builder"],
    blogData["json-viewer"],
    blogData["jwt-decoder"],
    blogData["base64-text-encoder"],
    blogData["base64-image-converter"],
    blogData["hash-generator"],
    blogData["password-generator"],
    blogData["uuid-generator"],
    blogData["regex-tester"],
    blogData["timestamp-converter"],
    blogData["number-base-converter"],
    blogData["csv-to-json-converter"],
    blogData["yaml-to-json-converter"],
    blogData["text-diff-checker"],
    blogData["text-case-converter"],
    blogData["word-counter"],
    blogData["lorem-ipsum-generator"],
    blogData["qr-code-generator"],
    blogData["url-shortener"],
    blogData["url-parser"],
    blogData["image-resizer"],
    blogData["color-converter"],
    blogData["aspect-ratio-calculator"]
];
