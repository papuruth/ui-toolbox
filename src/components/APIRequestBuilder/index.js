import { Add, Close, Code, ContentCopy, Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import localization from "localization";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToolChain } from "context/ToolChainContext";
import { useToolHistory } from "utils/hooks/useToolHistory.hooks";
import SendToButton from "components/Shared/SendToButton";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    CodeArea,
    EmptyState,
    Panel,
    PanelHeader,
    PanelLabel,
    TabBtn,
    TabStrip,
    ToolLayout
} from "components/Shared/ToolKit";

const { apiRequestBuilder: L, common: C } = localization;

// ─── cURL parser ──────────────────────────────────────────────────────────────

function tokenizeCurl(str) {
    const tokens = [];
    let current = "";
    let inSingle = false;
    let inDouble = false;
    let i = 0;
    while (i < str.length) {
        const ch = str[i];
        let advance = true;
        if (inSingle) {
            if (ch === "'") inSingle = false;
            else current += ch;
        } else if (inDouble) {
            if (ch === "\"") inDouble = false;
            else if (ch === "\\" && i + 1 < str.length) {
                i += 1;
                current += str[i];
            } else current += ch;
        } else if (ch === "'") {
            inSingle = true;
        } else if (ch === "\"") {
            inDouble = true;
        } else if (ch === "\\" && i + 1 < str.length && str[i + 1] === "\n") {
            i += 2;
            advance = false;
        } else if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
            if (current) {
                tokens.push(current);
                current = "";
            }
        } else {
            current += ch;
        }
        if (advance) i += 1;
    }
    if (current) tokens.push(current);
    return tokens;
}

const CURL_IGNORE_FLAGS = new Set([
    "-L",
    "--location",
    "--compressed",
    "-s",
    "--silent",
    "-v",
    "--verbose",
    "-i",
    "--include",
    "-k",
    "--insecure",
    "-f",
    "--fail",
    "-g",
    "--globoff",
    "--no-keepalive",
    "--http1.1",
    "--http2"
]);

function parseCurl(input) {
    const trimmed = input.trim();
    if (!/^curl\s/i.test(trimmed)) return null;

    const tokens = tokenizeCurl(trimmed);
    let method = "";
    let url = "";
    const headers = [];
    let body = "";

    let i = 1; // skip "curl"
    while (i < tokens.length) {
        const t = tokens[i];
        if (t === "-X" || t === "--request") {
            i += 1;
            method = (tokens[i] || "GET").toUpperCase();
        } else if (t === "-H" || t === "--header") {
            i += 1;
            const h = tokens[i] || "";
            const colon = h.indexOf(":");
            if (colon !== -1) {
                headers.push({ key: h.slice(0, colon).trim(), value: h.slice(colon + 1).trim(), id: Date.now() + i });
            }
        } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary" || t === "--data-urlencode") {
            i += 1;
            body = tokens[i] || "";
        } else if (t === "-u" || t === "--user") {
            i += 1;
            const creds = tokens[i] || "";
            try {
                headers.push({ key: "Authorization", value: `Basic ${btoa(creds)}`, id: Date.now() + i });
            } catch (_err) {
                // invalid base64 credentials – skip
            }
        } else if (t === "-b" || t === "--cookie") {
            i += 1;
            const cookieVal = tokens[i] || "";
            headers.push({ key: "Cookie", value: cookieVal, id: Date.now() + i });
        } else if (t === "--url") {
            i += 1;
            url = tokens[i] || "";
        } else if (t === "-A" || t === "--user-agent") {
            i += 1;
            const ua = tokens[i] || "";
            headers.push({ key: "User-Agent", value: ua, id: Date.now() + i });
        } else if (CURL_IGNORE_FLAGS.has(t)) {
            // boolean flags — consume nothing
        } else if (/^--(connect-timeout|max-time|retry|output|write-out)$/.test(t)) {
            i += 1; // value-consuming flags we don't need
        } else if (t === "\\") {
            // line-continuation backslash — <input> strips \n so it lands as a lone token
        } else if (!t.startsWith("-")) {
            url = t;
        }
        i += 1;
    }

    if (!url) return null;
    if (!method) method = body ? "POST" : "GET";

    return { method, url, headers, body };
}

// ─── Method colors ────────────────────────────────────────────────────────────

const METHOD_COLORS = {
    GET: { bg: "rgba(34,204,153,0.12)", color: "#22cc99", border: "rgba(34,204,153,0.35)" },
    POST: { bg: "rgba(34,153,255,0.12)", color: "#2299ff", border: "rgba(34,153,255,0.35)" },
    PUT: { bg: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.35)" },
    DELETE: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.35)" },
    PATCH: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.35)" }
};

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

// ─── Status badge colors ──────────────────────────────────────────────────────

function getStatusStyle(code) {
    if (!code) return { bg: "rgba(99,102,241,0.12)", color: "#818cf8" };
    if (code >= 200 && code < 300) return { bg: "rgba(34,204,153,0.12)", color: "#22cc99" };
    if (code >= 300 && code < 400) return { bg: "rgba(34,153,255,0.12)", color: "#2299ff" };
    if (code >= 400 && code < 500) return { bg: "rgba(251,146,60,0.12)", color: "#fb923c" };
    return { bg: "rgba(239,68,68,0.12)", color: "#ef4444" };
}

// ─── Styled components ────────────────────────────────────────────────────────

const MethodStrip = styled.div`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
`;

const MethodChip = styled.button`
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.$active ? p.$border : "var(--border-color)")};
    background: ${(p) => (p.$active ? p.$bg : "transparent")};
    color: ${(p) => (p.$active ? p.$color : "var(--text-secondary)")};
    font-size: 11px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover {
        background: ${(p) => p.$bg};
        color: ${(p) => p.$color};
        border-color: ${(p) => p.$border};
    }
`;

const UrlRow = styled.div`
    display: flex;
    gap: 0;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    margin: 12px 16px;
    &:focus-within {
        border-color: rgba(34, 204, 153, 0.5);
        box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.08);
    }
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
`;

const UrlInput = styled.input`
    flex: 1;
    background: var(--bg-input);
    color: var(--text-primary);
    border: none;
    outline: none;
    padding: 10px 14px;
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.45;
    }
`;

const SendBtn = styled.button`
    background: #22cc99;
    color: #0b1220;
    border: none;
    padding: 0 20px;
    font-size: 12px;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.15s ease;
    &:hover {
        opacity: 0.88;
    }
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const HeaderRow = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 4px 16px;
`;

const HeaderInput = styled.input`
    flex: 1;
    background: var(--bg-input);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    outline: none;
    &:focus {
        border-color: rgba(34, 204, 153, 0.5);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.45;
    }
`;

const StatusRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
    flex-wrap: wrap;
`;

const StatusBadge = styled.span`
    font-size: 12px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    padding: 3px 10px;
    border-radius: 4px;
    background: ${(p) => p.$bg};
    color: ${(p) => p.$color};
`;

const TimeBadge = styled.span`
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-secondary);
    opacity: 0.7;
`;

const PrettifyBtn = styled.button`
    padding: 3px 10px;
    border-radius: 4px;
    border: 1px solid rgba(34, 204, 153, 0.3);
    background: rgba(34, 204, 153, 0.07);
    color: #22cc99;
    font-size: 10px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: background 0.15s ease;
    &:hover {
        background: rgba(34, 204, 153, 0.15);
    }
    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
`;

const PrettifyError = styled.div`
    padding: 2px 16px 6px;
    font-size: 10px;
    font-family: "JetBrains Mono", monospace;
    color: #ef4444;
`;

const RequestTabRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    border-top: 1px solid var(--border-color);
`;

const CountBadge = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    background: rgba(34, 204, 153, 0.2);
    color: #22cc99;
    font-size: 9px;
    font-weight: 700;
    margin-left: 5px;
    font-family: "JetBrains Mono", monospace;
`;

const CurlBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    margin: 0 16px 6px;
    background: rgba(34, 153, 255, 0.1);
    border: 1px solid rgba(34, 153, 255, 0.25);
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.06em;
    color: #2299ff;
    animation: fadeIn 0.2s ease;
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }
`;

const CorsNotice = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: 11px;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.07);
    border-top: 1px solid rgba(251, 191, 36, 0.2);
    font-family: "Inter", sans-serif;
`;


const ResponseHeadersTable = styled.div`
    background: var(--bg-input);
    padding: 8px 0;
`;

const ResponseHeaderEntry = styled.div`
    display: flex;
    gap: 12px;
    padding: 4px 16px;
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    border-bottom: 1px solid var(--border-color);
    &:last-child {
        border-bottom: none;
    }
`;

const RHKey = styled.span`
    color: #818cf8;
    min-width: 160px;
    flex-shrink: 0;
    word-break: break-all;
`;

const RHVal = styled.span`
    color: var(--text-primary);
    opacity: 0.8;
    word-break: break-all;
`;

const ErrorBox = styled.div`
    padding: 20px 16px;
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
    border-top: 1px solid rgba(239, 68, 68, 0.15);
    line-height: 1.6;
`;

// ─── JSON pretty-printer with token coloring ──────────────────────────────────

/* eslint-disable react/prop-types */
function JsonTokenizer({ json }) {
    if (!json) return null;
    const lines = json.split("\n");
    return (
        <pre
            style={{
                margin: 0,
                padding: "16px",
                fontFamily: `"JetBrains Mono", "Fira Code", monospace`,
                fontSize: 12,
                lineHeight: 1.75,
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                minHeight: 260,
                maxHeight: "calc(100vh - 400px)",
                overflowY: "auto"
            }}
        >
            {lines.map((line, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}>{tokenizeLine(line)}</div>
            ))}
        </pre>
    );
}
/* eslint-enable react/prop-types */

function tokenizeLine(line) {
    const keyMatch = line.match(/^(\s*)("(?:[^"\\]|\\.)*")(\s*:\s*)(.*)/);
    if (keyMatch) {
        const [, indent, key, colon, rest] = keyMatch;
        return (
            <>
                {indent}
                <span style={{ color: "#818cf8" }}>{key}</span>
                <span style={{ color: "var(--text-secondary)", opacity: 0.6 }}>{colon}</span>
                {colorValue(rest)}
            </>
        );
    }
    return <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>{line}</span>;
}

function colorValue(v) {
    const s = v.trimEnd();
    if (s === "null" || s === "null,") return <span style={{ color: "#ef4444" }}>{v}</span>;
    if (s === "true" || s === "true,") return <span style={{ color: "#22cc99" }}>{v}</span>;
    if (s === "false" || s === "false,") return <span style={{ color: "#fb923c" }}>{v}</span>;
    if (/^-?\d/.test(s)) return <span style={{ color: "#fbbf24" }}>{v}</span>;
    if (s.startsWith("\"")) return <span style={{ color: "#86efac" }}>{v}</span>;
    return <span style={{ color: "var(--text-primary)" }}>{v}</span>;
}

// ─── Code snippet generator ───────────────────────────────────────────────────

const SNIPPET_TYPES = [
    { value: "curl", label: "cURL" },
    { value: "fetch", label: "JavaScript (fetch)" },
    { value: "axios", label: "JavaScript (axios)" },
    { value: "xhr", label: "JavaScript (XHR)" },
    { value: "node-http", label: "Node.js (http)" },
    { value: "python", label: "Python (requests)" },
    { value: "go", label: "Go (net/http)" },
    { value: "php", label: "PHP (cURL)" },
    { value: "ruby", label: "Ruby (Net::HTTP)" },
    { value: "swift", label: "Swift (URLSession)" },
    { value: "csharp", label: "C# (HttpClient)" },
    { value: "java", label: "Java (OkHttp)" }
];

function generateSnippet(type, { method, url, headers, body }) {
    const h = headers.filter((hdr) => hdr.key.trim());
    const escSQ = (s) => String(s).replace(/'/g, "'\\''");

    switch (type) {
        case "curl": {
            const lines = [`curl -X ${method} '${escSQ(url)}'`];
            h.forEach((hdr) => lines.push(`     -H '${escSQ(hdr.key)}: ${escSQ(hdr.value)}'`));
            if (body) lines.push(`     --data-raw '${escSQ(body)}'`);
            return lines.join(" \\\n");
        }
        case "fetch": {
            const headersObj = h.reduce((acc, hdr) => { acc[hdr.key] = hdr.value; return acc; }, {});
            const opts = { method };
            if (h.length) opts.headers = headersObj;
            if (body) opts.body = body;
            return [`const response = await fetch('${url}', ${JSON.stringify(opts, null, 2)});`, `const data = await response.json();`, `console.log(data);`].join("\n");
        }
        case "axios": {
            const headersObj = h.reduce((acc, hdr) => { acc[hdr.key] = hdr.value; return acc; }, {});
            const cfg = { method: method.toLowerCase(), url };
            if (h.length) cfg.headers = headersObj;
            if (body) { try { cfg.data = JSON.parse(body); } catch { cfg.data = body; } }
            return [`import axios from 'axios';`, ``, `const response = await axios(${JSON.stringify(cfg, null, 2)});`, `console.log(response.data);`].join("\n");
        }
        case "xhr": {
            const lines = [`const xhr = new XMLHttpRequest();`, `xhr.open('${method}', '${url}');`];
            h.forEach((hdr) => lines.push(`xhr.setRequestHeader('${hdr.key}', '${hdr.value}');`));
            lines.push(`xhr.onload = () => console.log(xhr.responseText);`);
            lines.push(body ? `xhr.send(${JSON.stringify(body)});` : `xhr.send();`);
            return lines.join("\n");
        }
        case "node-http": {
            const isHttps = url.startsWith("https");
            const stripped = url.replace(/^https?:\/\//, "");
            const [hostPart, ...pathParts] = stripped.split("/");
            const [host, portStr] = hostPart.split(":");
            const defaultPort = isHttps ? 443 : 80;
            const port = portStr ? parseInt(portStr, 10) : defaultPort;
            const path = `/${pathParts.join("/")}` || "/";
            const headersObj = h.reduce((acc, hdr) => { acc[hdr.key] = hdr.value; return acc; }, {});
            const optsObj = { hostname: host, port, path, method };
            if (h.length) optsObj.headers = headersObj;
            const mod = isHttps ? "https" : "http";
            const lines = [
                `const ${mod} = require('${mod}');`, ``,
                `const options = ${JSON.stringify(optsObj, null, 2)};`, ``,
                `const req = ${mod}.request(options, (res) => {`,
                `  let data = '';`,
                `  res.on('data', chunk => { data += chunk; });`,
                `  res.on('end', () => { console.log(JSON.parse(data)); });`,
                `});`
            ];
            if (body) lines.push(``, `req.write(${JSON.stringify(body)});`);
            lines.push(`req.end();`);
            return lines.join("\n");
        }
        case "python": {
            const headersObj = h.reduce((acc, hdr) => { acc[hdr.key] = hdr.value; return acc; }, {});
            const lines = [`import requests`, ``];
            if (h.length) lines.push(`headers = ${JSON.stringify(headersObj, null, 4)}`, ``);
            const bodyLines = [];
            if (body) {
                try { lines.push(`payload = ${JSON.stringify(JSON.parse(body), null, 4)}`, ``); bodyLines.push(`    json=payload,`); }
                catch { lines.push(`payload = '${body.replace(/'/g, "\\'")}'`, ``); bodyLines.push(`    data=payload,`); }
            }
            lines.push(
                `response = requests.${method.toLowerCase()}(`,
                `    '${url}',`,
                ...(h.length ? [`    headers=headers,`] : []),
                ...bodyLines,
                `)`,
                ``, `print(response.json())`
            );
            return lines.join("\n");
        }
        case "go": {
            const hasBody = !!body;
            const lines = [
                `package main`, ``,
                `import (`, `\t"fmt"`, `\t"io"`, `\t"net/http"`,
                ...(hasBody ? [`\t"strings"`] : []),
                `)`, ``, `func main() {`
            ];
            if (hasBody) { lines.push(`\tbody := strings.NewReader(\`${body}\`)`); lines.push(`\treq, _ := http.NewRequest("${method}", "${url}", body)`); }
            else lines.push(`\treq, _ := http.NewRequest("${method}", "${url}", nil)`);
            h.forEach((hdr) => lines.push(`\treq.Header.Set("${hdr.key}", "${hdr.value}")`));
            lines.push(``, `\tclient := &http.Client{}`, `\tresp, _ := client.Do(req)`, `\tdefer resp.Body.Close()`, `\tbody2, _ := io.ReadAll(resp.Body)`, `\tfmt.Println(string(body2))`, `}`);
            return lines.join("\n");
        }
        case "php": {
            const lines = [`<?php`, ``, `$curl = curl_init();`, ``, `curl_setopt_array($curl, [`, `  CURLOPT_URL => '${url}',`, `  CURLOPT_RETURNTRANSFER => true,`, `  CURLOPT_CUSTOMREQUEST => '${method}',`];
            if (h.length) { lines.push(`  CURLOPT_HTTPHEADER => [`); h.forEach((hdr) => lines.push(`    '${hdr.key}: ${hdr.value}',`)); lines.push(`  ],`); }
            if (body) lines.push(`  CURLOPT_POSTFIELDS => '${body.replace(/'/g, "\\'")}',`);
            lines.push(`]);`, ``, `$response = curl_exec($curl);`, `curl_close($curl);`, ``, `echo $response;`, `?>`);
            return lines.join("\n");
        }
        case "ruby": {
            const isHttps = url.startsWith("https");
            const methodPascal = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
            const lines = [`require 'net/http'`, `require 'uri'`, ``, `uri = URI.parse('${url}')`, `http = Net::HTTP.new(uri.host, uri.port)`];
            if (isHttps) lines.push(`http.use_ssl = true`);
            lines.push(``, `request = Net::HTTP::${methodPascal}.new(uri.request_uri)`);
            h.forEach((hdr) => lines.push(`request['${hdr.key}'] = '${hdr.value}'`));
            if (body) lines.push(`request.body = '${body.replace(/'/g, "\\'")}'`);
            lines.push(``, `response = http.request(request)`, `puts response.body`);
            return lines.join("\n");
        }
        case "swift": {
            const lines = [`import Foundation`, ``, `let url = URL(string: "${url}")!`, `var request = URLRequest(url: url)`, `request.httpMethod = "${method}"`];
            h.forEach((hdr) => lines.push(`request.setValue("${hdr.value}", forHTTPHeaderField: "${hdr.key}")`));
            if (body) lines.push(`request.httpBody = Data("""\n${body}\n""".utf8)`);
            lines.push(``, `let task = URLSession.shared.dataTask(with: request) { data, response, error in`, `    if let data = data {`, `        print(String(data: data, encoding: .utf8) ?? "")`, `    }`, `}`, `task.resume()`);
            return lines.join("\n");
        }
        case "csharp": {
            const methodPascal = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
            const lines = [`using System.Net.Http;`, ``, `var client = new HttpClient();`, `var request = new HttpRequestMessage(HttpMethod.${methodPascal}, "${url}");`];
            h.forEach((hdr) => lines.push(`request.Headers.TryAddWithoutValidation("${hdr.key}", "${hdr.value}");`));
            if (body) lines.push(`request.Content = new StringContent(`, `    ${JSON.stringify(body)},`, `    System.Text.Encoding.UTF8,`, `    "application/json");`);
            lines.push(``, `var response = await client.SendAsync(request);`, `var content = await response.Content.ReadAsStringAsync();`, `Console.WriteLine(content);`);
            return lines.join("\n");
        }
        case "java": {
            const lines = [`// Requires OkHttp: implementation("com.squareup.okhttp3:okhttp:4.12.0")`, `import okhttp3.*;`, ``, `OkHttpClient client = new OkHttpClient();`, ``, `Request request = new Request.Builder()`, `    .url("${url}")`];
            h.forEach((hdr) => lines.push(`    .header("${hdr.key}", "${hdr.value}")`));
            if (body) lines.push(`    .method("${method}", RequestBody.create(`, `        ${JSON.stringify(body)},`, `        MediaType.parse("application/json")))`);
            else lines.push(`    .${method.toLowerCase()}()`);
            lines.push(`    .build();`, ``, `try (Response response = client.newCall(request).execute()) {`, `    System.out.println(response.body().string());`, `}`);
            return lines.join("\n");
        }
        default:
            return "";
    }
}

// ─── Code icon button ─────────────────────────────────────────────────────────

const CodeIconBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid ${(p) => (p.$active ? "rgba(34,204,153,0.5)" : "var(--border-color)")};
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.12)" : "transparent")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover {
        background: rgba(34, 204, 153, 0.1);
        border-color: rgba(34, 204, 153, 0.4);
        color: #22cc99;
    }
`;

const SnippetSelect = styled.select`
    background: var(--bg-input);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 11px;
    font-family: "Inter", sans-serif;
    outline: none;
    cursor: pointer;
    max-width: 180px;
    &:focus {
        border-color: rgba(34, 204, 153, 0.5);
    }
`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function APIRequestBuilder() {
    const { consumeChain } = useToolChain();
    const { addHistory } = useToolHistory("api-builder");

    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("");
    const [headers, setHeaders] = useState([{ key: "Content-Type", value: "application/json", id: Date.now() }]);
    const [bodyTab, setBodyTab] = useState("json");
    const [jsonBody, setJsonBody] = useState("");
    const [formBody, setFormBody] = useState("");
    const [sending, setSending] = useState(false);
    const [response, setResponse] = useState(null);
    const [copied, setCopied] = useState(false);
    const [requestTab, setRequestTab] = useState("headers");
    const [responseTab, setResponseTab] = useState("body");
    const [curlParsed, setCurlParsed] = useState(false);
    const [bodyPrettifyError, setBodyPrettifyError] = useState(false);
    const [showSnippet, setShowSnippet] = useState(false);
    const [snippetType, setSnippetType] = useState("curl");
    const [snippetCopied, setSnippetCopied] = useState(false);
    const abortRef = useRef(null);

    // Consume a curl chain sent from the command palette
    useEffect(() => {
        const incoming = consumeChain("/api-builder");
        if (!incoming) return;
        const parsed = parseCurl(incoming);
        if (parsed) {
            setMethod(parsed.method);
            setUrl(parsed.url);
            if (parsed.headers.length) setHeaders(parsed.headers);
            if (parsed.body) { setJsonBody(parsed.body); setBodyTab("json"); }
            setCurlParsed(true);
            setTimeout(() => setCurlParsed(false), 2500);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUrlChange = (e) => {
        const val = e.target.value;
        const parsed = parseCurl(val);
        if (parsed) {
            setMethod(parsed.method);
            setUrl(parsed.url);
            if (parsed.headers.length) setHeaders(parsed.headers);
            if (parsed.body) {
                setJsonBody(parsed.body);
                setBodyTab("json");
            }
            setCurlParsed(true);
            setTimeout(() => setCurlParsed(false), 2500);
        } else {
            setUrl(val);
            setCurlParsed(false);
        }
    };

    const showBody = ["POST", "PUT", "PATCH"].includes(method);

    useEffect(() => {
        if (!showBody) return;
        setHeaders((prev) => {
            if (prev.find((h) => h.key.toLowerCase() === "content-type")) return prev;
            return [...prev, { key: "Content-Type", value: "application/json", id: Date.now() }];
        });
    }, [method, showBody]);

    const addHeader = () => setHeaders((prev) => [...prev, { key: "", value: "", id: Date.now() }]);

    const updateHeader = (id, field, val) => setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)));

    const removeHeader = (id) => setHeaders((prev) => prev.filter((h) => h.id !== id));

    const handleSend = useCallback(async () => {
        if (!url.trim()) return;
        setSending(true);
        setResponse(null);
        addHistory(url.trim());

        abortRef.current = new AbortController();
        const timeoutId = setTimeout(() => abortRef.current.abort(), 10000);
        const startTime = Date.now();

        try {
            const reqHeaders = {};
            headers.forEach((h) => {
                if (h.key.trim()) reqHeaders[h.key.trim()] = h.value;
            });

            const opts = {
                method,
                headers: reqHeaders,
                signal: abortRef.current.signal
            };

            const activeBody = bodyTab === "json" ? jsonBody : formBody;
            if (showBody && activeBody.trim()) {
                opts.body = activeBody;
            }

            const res = await fetch(url.trim(), opts);
            const elapsed = Date.now() - startTime;

            const respHeaders = {};
            res.headers.forEach((val, key) => {
                respHeaders[key] = val;
            });

            let responseText = await res.text();
            let parsedJson = null;
            let isJson = false;
            const ct = res.headers.get("content-type") || "";

            if (ct.includes("application/json") || ct.includes("text/json")) {
                try {
                    parsedJson = JSON.parse(responseText);
                    responseText = JSON.stringify(parsedJson, null, 2);
                    isJson = true;
                } catch {
                    isJson = false;
                }
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                elapsed,
                headers: respHeaders,
                body: responseText,
                isJson,
                raw: responseText
            });
        } catch (err) {
            const elapsed = Date.now() - startTime;
            if (err.name === "AbortError") {
                setResponse({ error: L.timeoutError, elapsed });
            } else if (!navigator.onLine) {
                setResponse({ error: L.offlineError, elapsed });
            } else {
                setResponse({ error: L.errorNetwork, elapsed, corsHint: true });
            }
        } finally {
            clearTimeout(timeoutId);
            setSending(false);
        }
    }, [url, method, headers, jsonBody, formBody, bodyTab, showBody, addHistory]);

    const handleCopy = () => {
        if (!response?.body) return;
        navigator.clipboard.writeText(response.body).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    };

    const handlePrettifyBody = () => {
        try {
            setJsonBody(JSON.stringify(JSON.parse(jsonBody), null, 2));
            setBodyPrettifyError(false);
        } catch {
            setBodyPrettifyError(true);
            setTimeout(() => setBodyPrettifyError(false), 2000);
        }
    };

    const handlePrettifyResponse = () => {
        if (!response?.body) return;
        try {
            const pretty = JSON.stringify(JSON.parse(response.body), null, 2);
            setResponse((prev) => ({ ...prev, body: pretty, isJson: true }));
        } catch (_err) {
            // non-JSON – leave body unchanged
        }
    };

    const snippetCode = useMemo(
        () => generateSnippet(snippetType, { method, url, headers, body: bodyTab === "json" ? jsonBody : formBody }),
        [snippetType, method, url, headers, bodyTab, jsonBody, formBody]
    );

    const handleCopySnippet = () => {
        if (!snippetCode) return;
        navigator.clipboard.writeText(snippetCode).then(() => {
            setSnippetCopied(true);
            setTimeout(() => setSnippetCopied(false), 1800);
        });
    };

    const handleClear = () => {
        setUrl("");
        setJsonBody("");
        setFormBody("");
        setResponse(null);
        setHeaders([{ key: "Content-Type", value: "application/json", id: Date.now() }]);
    };

    const statusStyle = response?.status ? getStatusStyle(response.status) : null;

    return (
        <ToolLayout>
            {/* ── REQUEST PANEL ─────────────────────────────────── */}
            <Panel style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
                <PanelHeader>
                    <PanelLabel>{L.requestLabel}</PanelLabel>
                </PanelHeader>

                {/* Method chips */}
                <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                    <MethodStrip>
                        {METHODS.map((m) => {
                            const mc = METHOD_COLORS[m];
                            return (
                                <MethodChip
                                    key={m}
                                    $active={method === m}
                                    $bg={mc.bg}
                                    $color={mc.color}
                                    $border={mc.border}
                                    onClick={() => setMethod(m)}
                                >
                                    {m}
                                </MethodChip>
                            );
                        })}
                    </MethodStrip>
                </Box>

                {/* URL input + code snippet toggle */}
                <Box sx={{ display: "flex", gap: "8px", alignItems: "center", mx: 2, my: "12px" }}>
                    <UrlRow style={{ margin: 0, flex: 1 }}>
                        <UrlInput
                            value={url}
                            onChange={handleUrlChange}
                            placeholder={`${L.urlPlaceholder} or paste a cURL command`}
                            onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
                            autoComplete="off"
                            spellCheck={false}
                        />
                        <SendBtn onClick={handleSend} disabled={sending || !url.trim()}>
                            {sending ? L.sendingLabel : L.sendBtn}
                        </SendBtn>
                    </UrlRow>
                    <Tooltip title="Code snippet" placement="top" arrow>
                        <CodeIconBtn $active={showSnippet} onClick={() => setShowSnippet((v) => !v)}>
                            <Code style={{ fontSize: 15 }} />
                        </CodeIconBtn>
                    </Tooltip>
                </Box>
                {curlParsed && <CurlBadge>✓ cURL parsed — method, headers &amp; body applied</CurlBadge>}

                {/* Request tabs: Headers | Body */}
                <RequestTabRow>
                    <TabStrip style={{ border: "none", borderBottom: "none" }}>
                        <TabBtn $active={requestTab === "headers"} onClick={() => setRequestTab("headers")}>
                            {L.headersLabel}
                            {headers.filter((h) => h.key.trim()).length > 0 && <CountBadge>{headers.filter((h) => h.key.trim()).length}</CountBadge>}
                        </TabBtn>
                        <TabBtn $active={requestTab === "body"} onClick={() => setRequestTab("body")}>
                            {L.bodyLabel}
                        </TabBtn>
                    </TabStrip>
                    {requestTab === "headers" && (
                        <Tooltip title={L.addHeaderBtn} placement="top" arrow>
                            <IconButton size="small" onClick={addHeader} sx={{ color: "#22cc99" }}>
                                <Add fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {requestTab === "body" && bodyTab === "json" && showBody && (
                        <PrettifyBtn onClick={handlePrettifyBody} disabled={!jsonBody.trim()}>
                            {L.prettifyBtn}
                        </PrettifyBtn>
                    )}
                </RequestTabRow>

                {/* Headers tab content */}
                {requestTab === "headers" && (
                    <Box sx={{ pb: 1, minHeight: 80, maxHeight: 220, overflowY: "auto" }}>
                        {headers.map((h) => (
                            <HeaderRow key={h.id}>
                                <HeaderInput placeholder="Key" value={h.key} onChange={(e) => updateHeader(h.id, "key", e.target.value)} autoComplete="off" />
                                <HeaderInput placeholder="Value" value={h.value} onChange={(e) => updateHeader(h.id, "value", e.target.value)} autoComplete="off" />
                                <Tooltip title="Remove" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => removeHeader(h.id)}
                                        sx={{ color: "var(--text-secondary)", "&:hover": { color: "#ef4444" } }}
                                    >
                                        <Delete style={{ fontSize: 15 }} />
                                    </IconButton>
                                </Tooltip>
                            </HeaderRow>
                        ))}
                    </Box>
                )}

                {/* Body tab content */}
                {requestTab === "body" &&
                    (showBody ? (
                        <>
                            <TabStrip>
                                <TabBtn $active={bodyTab === "json"} onClick={() => setBodyTab("json")}>
                                    {L.jsonTabLabel}
                                </TabBtn>
                                <TabBtn $active={bodyTab === "form"} onClick={() => setBodyTab("form")}>
                                    {L.formTabLabel}
                                </TabBtn>
                            </TabStrip>
                            <CodeArea
                                value={bodyTab === "json" ? jsonBody : formBody}
                                onChange={(e) => {
                                    if (bodyTab === "json") setJsonBody(e.target.value);
                                    else setFormBody(e.target.value);
                                    setBodyPrettifyError(false);
                                }}
                                placeholder={bodyTab === "json" ? `{\n  "key": "value"\n}` : "key=value&other=data"}
                                style={{ minHeight: 140 }}
                                spellCheck={false}
                            />
                            {bodyPrettifyError && <PrettifyError>{L.invalidJson}</PrettifyError>}
                        </>
                    ) : (
                        <Box
                            sx={{
                                p: 2.5,
                                color: "var(--text-secondary)",
                                fontSize: "0.75rem",
                                fontFamily: "JetBrains Mono, monospace",
                                opacity: 0.5
                            }}
                        >
                            {method} requests do not have a body
                        </Box>
                    ))}

                <ActionBar>
                    <ActionBtn $danger onClick={handleClear}>
                        {C.clearBtn}
                    </ActionBtn>
                </ActionBar>
            </Panel>

            {/* ── SNIPPET PANEL ─────────────────────────────────── */}
            {showSnippet && (
                <Panel style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
                    <PanelHeader>
                        <PanelLabel>&lt;/&gt; Code Snippet</PanelLabel>
                        <Box sx={{ display: "flex", gap: "4px", alignItems: "center", ml: "auto" }}>
                            <SnippetSelect value={snippetType} onChange={(e) => setSnippetType(e.target.value)}>
                                {SNIPPET_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </SnippetSelect>
                            <Tooltip title={snippetCopied ? "Copied!" : "Copy"} placement="top" arrow>
                                <IconButton size="small" onClick={handleCopySnippet} sx={{ color: snippetCopied ? "#22cc99" : "var(--text-secondary)" }}>
                                    <ContentCopy style={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close" placement="top" arrow>
                                <IconButton size="small" onClick={() => setShowSnippet(false)} sx={{ color: "var(--text-secondary)" }}>
                                    <Close style={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </PanelHeader>
                    <CodeArea
                        value={snippetCode}
                        readOnly
                        style={{ minHeight: 300, maxHeight: "calc(100vh - 400px)", overflowY: "auto", fontSize: 11 }}
                        spellCheck={false}
                    />
                </Panel>
            )}

            {/* ── RESPONSE PANEL ────────────────────────────────── */}
            {!showSnippet && <Panel style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
                <PanelHeader>
                    <PanelLabel>{L.responseLabel}</PanelLabel>
                </PanelHeader>

                {response ? (
                    <>
                        {/* Status row */}
                        {response.status && (
                            <StatusRow>
                                <StatusBadge $bg={statusStyle.bg} $color={statusStyle.color}>
                                    {response.status} {response.statusText}
                                </StatusBadge>
                                {response.elapsed !== undefined && <TimeBadge>{response.elapsed}ms</TimeBadge>}
                            </StatusRow>
                        )}

                        {/* Error */}
                        {response.error && (
                            <>
                                <ErrorBox>{response.error}</ErrorBox>
                                {response.corsHint && <CorsNotice>⚠ {L.corsNotice}</CorsNotice>}
                            </>
                        )}

                        {/* Body | Headers tab strip */}
                        {!response.error && (
                            <RequestTabRow>
                                <TabStrip style={{ border: "none", borderBottom: "none" }}>
                                    <TabBtn $active={responseTab === "body"} onClick={() => setResponseTab("body")}>
                                        {L.bodyLabel}
                                    </TabBtn>
                                    <TabBtn $active={responseTab === "headers"} onClick={() => setResponseTab("headers")}>
                                        {L.headersLabel}
                                        {response.headers && Object.keys(response.headers).length > 0 && (
                                            <CountBadge>{Object.keys(response.headers).length}</CountBadge>
                                        )}
                                    </TabBtn>
                                </TabStrip>
                                {responseTab === "body" && response.body && (
                                    <PrettifyBtn onClick={handlePrettifyResponse}>{L.prettifyBtn}</PrettifyBtn>
                                )}
                            </RequestTabRow>
                        )}

                        {/* Body tab */}
                        {!response.error && responseTab === "body" && response.body &&
                            (response.isJson ? (
                                <JsonTokenizer json={response.body} />
                            ) : (
                                <CodeArea value={response.body} readOnly style={{ minHeight: 260, maxHeight: "calc(100vh - 400px)", overflowY: "auto" }} />
                            ))}

                        {/* Headers tab */}
                        {!response.error && responseTab === "headers" && response.headers && (
                            <ResponseHeadersTable style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
                                {Object.entries(response.headers).map(([k, v]) => (
                                    <ResponseHeaderEntry key={k}>
                                        <RHKey>{k}</RHKey>
                                        <RHVal>{v}</RHVal>
                                    </ResponseHeaderEntry>
                                ))}
                            </ResponseHeadersTable>
                        )}

                        {/* Actions */}
                        {responseTab === "body" && (response.body || response.raw) && (
                            <ActionBar>
                                <ActionBtnGroup>
                                    <ActionBtn $success={copied} onClick={handleCopy}>
                                        <ContentCopy style={{ fontSize: 12 }} />
                                        {copied ? C.copiedLabel : L.copyResponseBtn}
                                    </ActionBtn>
                                    {response.isJson && response.body && (
                                        <SendToButton value={response.body} targets={[{ label: "JSON Viewer", route: "/json-viewer" }]} />
                                    )}
                                </ActionBtnGroup>
                            </ActionBar>
                        )}
                    </>
                ) : (
                    <EmptyState>
                        <Typography variant="caption" sx={{ fontFamily: "JetBrains Mono, monospace", opacity: 0.6 }}>
                            {sending ? L.sendingLabel : L.emptyStateMessage}
                        </Typography>
                    </EmptyState>
                )}

                {/* Always-visible CORS notice at bottom */}
                {!response && <CorsNotice style={{ marginTop: "auto" }}>ⓘ {L.corsNotice}</CorsNotice>}
            </Panel>}
        </ToolLayout>
    );
}
