import { Search } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useRef, useState, cloneElement } from "react";
import { bool, func } from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import localization from "localization";
import storage from "utils/storage";
import { fuzzyFilterWithPositions } from "utils/fuzzySearch";
import { detectInputType } from "utils/inputDetector";
import { useToolChain } from "context/ToolChainContext";
import { isMac } from "utils/helperFunctions";
import { buildActions, buildCommands, CATEGORY_EMOJI, ENRICHED_TOOLS, getRecentToolEntries, getRelatedToolEntries, SUGGESTED_TOOLS } from "./paletteData";
import {
    Backdrop,
    CategoryBadge,
    CategoryFilterChip,
    ChipX,
    EmptyMessage,
    Footer,
    ItemContent,
    ItemDescription,
    ItemIconWrap,
    ItemLabel,
    KbdHint,
    MatchChar,
    PaletteBox,
    ResultItem,
    ResultsList,
    SearchBar,
    SearchIconWrap,
    SearchInput,
    SectionHeader,
    SmartBanner,
    SmartBannerArrow,
    SmartBannerText
} from "./styles";

const PLACEHOLDER_HINTS = [
    "Search tools, paste a JWT, URL, or JSON…",
    "Type # to filter by category…",
    "Type > to run commands…",
    "Paste a UUID, hash, or Base64…",
    "Press Tab to autocomplete…"
];

function usePlaceholder(active) {
    const [idx, setIdx] = useState(0);
    const [fading, setFading] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!active) {
            setIdx(0);
            setFading(false);
            return undefined;
        }
        const interval = setInterval(() => {
            setFading(true);
            timeoutRef.current = setTimeout(() => {
                setIdx((i) => (i + 1) % PLACEHOLDER_HINTS.length);
                setFading(false);
            }, 250);
        }, 3000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeoutRef.current);
        };
    }, [active]);

    return { text: PLACEHOLDER_HINTS[idx], fading };
}

export default function CommandPalette({ open, onClose }) {
    const dispatch = useDispatch();
    const { sendTo } = useToolChain();
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Navigate and record usage
    const navigateTo = useCallback(
        (route) => {
            storage.setRecentTool(route);
            dispatch(push(route));
            onClose();
        },
        [dispatch, onClose]
    );

    // Inline actions (rebuilt when callbacks change)
    const actions = useMemo(() => buildActions({ onClose, navigateTo }), [onClose, navigateTo]);

    // Command-mode items (rebuilt when onClose changes)
    const commands = useMemo(() => buildCommands({ onClose }), [onClose]);

    // Derived mode flags — computed from query prefix, available to useMemo and JSX alike
    const isCategoryMode = query.startsWith("#");
    const isCommandMode = query.startsWith(">");
    const categorySlug = isCategoryMode ? query.slice(1).trim().toLowerCase() : null;

    // Smart detection fires when query looks like structured data, not a search phrase
    const smartDetection = useMemo(() => detectInputType(query), [query]);

    // Build sections and flat selectable list
    const { sections, selectables } = useMemo(() => {
        const secs = [];

        if (isCategoryMode) {
            // "#encoding", "#url", etc. — filter tools by category prefix
            const filtered = categorySlug
                ? ENRICHED_TOOLS.filter((t) => t.category.startsWith(categorySlug))
                : ENRICHED_TOOLS;
            const sectionLabel = categorySlug
                ? `${categorySlug.charAt(0).toUpperCase()}${categorySlug.slice(1)} tools`
                : "All tools";
            if (filtered.length > 0) {
                secs.push({ id: "category-filter", label: sectionLabel, items: filtered });
            }
        } else if (isCommandMode) {
            // ">" or ">clear" — fuzzy-search within command list
            const cmdQuery = query.slice(1).trim();
            const matched = cmdQuery
                ? fuzzyFilterWithPositions(commands, cmdQuery, (c) => [c.label, c.description || "", ...(c.keywords || [])])
                      .map(({ item, score, positions }) => ({ ...item, _score: score, _positions: positions }))
                : commands;
            if (matched.length > 0) {
                secs.push({ id: "commands", label: "Commands", items: matched });
            }
        } else if (!query.trim()) {
            const recent = getRecentToolEntries();
            if (recent.length > 0) {
                secs.push({ id: "recent", label: "Recent", items: recent });
            }

            const shownRoutes = new Set(recent.map((t) => t.route));

            // Related tools based on current page context
            const related = getRelatedToolEntries(window.location.pathname).filter(
                (t) => !shownRoutes.has(t.route)
            );
            if (related.length > 0) {
                related.forEach((t) => shownRoutes.add(t.route));
                secs.push({ id: "related", label: "Related", items: related });
            }

            // Fill remaining slots with suggested tools, cap total at 8
            const suggested = SUGGESTED_TOOLS.filter((t) => !shownRoutes.has(t.route));
            const remaining = Math.max(0, 8 - recent.length - related.length);
            if (suggested.length > 0 && remaining > 0) {
                secs.push({ id: "suggested", label: "Suggested", items: suggested.slice(0, remaining) });
            }
        } else {
            // Search: fuzzy across tools + actions, with per-item score + highlight positions
            const allItems = [...ENRICHED_TOOLS, ...actions];
            const matched = fuzzyFilterWithPositions(
                allItems,
                query,
                (item) => [item.label, item.description || "", ...(item.keywords || [])]
            ).map(({ item, score, positions }) => ({ ...item, _score: score, _positions: positions }));

            const matchedActions = matched.filter((i) => i.kind === "action");
            const matchedTools = matched.filter((i) => i.kind !== "action");

            if (matchedActions.length > 0) {
                secs.push({ id: "actions", label: "Actions", items: matchedActions });
            }
            if (matchedTools.length > 0) {
                secs.push({ id: "tools", label: "Tools", items: matchedTools });
            }
        }

        // Smart detection item at index 0 (if active)
        const smartItem = smartDetection ? [{ kind: "smart", detection: smartDetection }] : [];
        const all = [...smartItem, ...secs.flatMap((s) => s.items)];
        return { sections: secs, selectables: all };
    }, [query, isCategoryMode, isCommandMode, categorySlug, actions, commands, smartDetection]);

    // Reset on open
    useEffect(() => {
        if (open) {
            setQuery("");
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open]);

    // Clamp activeIndex when results change
    useEffect(() => {
        setActiveIndex((i) => Math.min(i, Math.max(0, selectables.length - 1)));
    }, [selectables.length]);

    // Keep active row in view
    useEffect(() => {
        if (!listRef.current) return;
        const active = listRef.current.querySelector("[data-active='true']");
        active?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    const executeItem = useCallback(
        (item) => {
            if (!item) return;
            if (item.kind === "smart") {
                sendTo(query, item.detection.route);
                navigateTo(item.detection.route);
            } else if (item.kind === "action" || item.kind === "command") {
                item.run();
            } else {
                navigateTo(item.route);
            }
        },
        [navigateTo, sendTo, query]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, selectables.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Tab") {
                e.preventDefault();
                if (e.shiftKey) {
                    setActiveIndex((i) => Math.max(i - 1, 0));
                } else {
                    const active = selectables[activeIndex];
                    if (active && active.kind !== "smart" && active.label) {
                        setQuery(active.label);
                    }
                }
            } else if (e.key === "Enter") {
                executeItem(selectables[activeIndex]);
            } else if (e.key === "Escape") {
                onClose();
            }
        },
        [selectables, activeIndex, executeItem, onClose]
    );

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        setActiveIndex(0);
    };

    const { text: placeholderText, fading: placeholderFading } = usePlaceholder(open && !query);

    if (!open) return null;

    // Split label into highlighted/plain segments; key each by its start position in the string
    const highlightLabel = (label, positions) => {
        if (!positions || positions.length === 0) return label;
        const posSet = new Set(positions);
        const segments = [];
        let i = 0;
        while (i < label.length) {
            const highlighted = posSet.has(i);
            const startIdx = i;
            let text = "";
            while (i < label.length && posSet.has(i) === highlighted) {
                text += label[i];
                i += 1;
            }
            segments.push({ highlighted, text, key: `s${startIdx}` });
        }
        return segments.map((seg) =>
            seg.highlighted ? <MatchChar key={seg.key}>{seg.text}</MatchChar> : seg.text
        );
    };

    // Flatten smart detection offset for section items
    const smartOffset = smartDetection ? 1 : 0;

    // Build flat index map: section item → global selectable index
    let sectionItemIndex = smartOffset;
    const renderedSections = sections.map((sec) => ({
        ...sec,
        startIndex: (() => {
            const s = sectionItemIndex;
            sectionItemIndex += sec.items.length;
            return s;
        })()
    }));

    const noResults = !smartDetection && sections.length === 0 && query.trim().length > 0;

    const { commandPalette: L } = localization;

    return (
        <Backdrop onMouseDown={onClose}>
            <PaletteBox onMouseDown={(e) => e.stopPropagation()}>
                {/* Search bar */}
                <SearchBar>
                    <SearchIconWrap>
                        <Search sx={{ fontSize: "1.2rem" }} />
                    </SearchIconWrap>
                    {isCategoryMode && (
                        <CategoryFilterChip onMouseDown={() => setQuery("")}>
                            #{categorySlug || "filter"}
                            <ChipX aria-hidden>×</ChipX>
                        </CategoryFilterChip>
                    )}
                    <SearchInput
                        ref={inputRef}
                        value={query}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholderText}
                        $placeholderFading={placeholderFading}
                        aria-label="Search tools"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <KbdHint aria-hidden>
                        <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
                        <kbd>K</kbd>
                    </KbdHint>
                </SearchBar>

                {/* Results */}
                <ResultsList ref={listRef}>
                    {/* Smart detection banner */}
                    {smartDetection && (
                        <SmartBanner
                            $active={activeIndex === 0}
                            data-active={activeIndex === 0}
                            onMouseEnter={() => setActiveIndex(0)}
                            onMouseDown={() => executeItem({ kind: "smart", detection: smartDetection })}
                        >
                            <span style={{ fontSize: "1.1rem" }}>🧠</span>
                            <SmartBannerText>
                                <strong>{smartDetection.label}</strong> detected — open in{" "}
                                <strong>{ENRICHED_TOOLS.find((t) => t.route === smartDetection.route)?.label}</strong>
                            </SmartBannerText>
                            <SmartBannerArrow>{L.smartDetectionOpen}</SmartBannerArrow>
                        </SmartBanner>
                    )}

                    {/* Sections */}
                    {renderedSections.map((sec) => (
                        <div key={sec.id}>
                            <SectionHeader>{sec.label}</SectionHeader>
                            {sec.items.map((item, i) => {
                                const globalIdx = sec.startIndex + i;
                                const isActive = globalIdx === activeIndex;
                                const iconEl = item.icon
                                    ? cloneElement(item.icon, { sx: { fontSize: "1.1rem" }, fontSize: undefined })
                                    : (CATEGORY_EMOJI[item.category] || "🛠️");

                                return (
                                    <ResultItem
                                        key={item.id || item.route}
                                        $active={isActive}
                                        $delay={i * 18}
                                        data-active={isActive}
                                        onMouseEnter={() => setActiveIndex(globalIdx)}
                                        onMouseDown={() => executeItem(item)}
                                    >
                                        <ItemIconWrap $kind={item.kind} $category={item.category}>{iconEl}</ItemIconWrap>
                                        <ItemContent>
                                            <ItemLabel $dimmed={item._score > 0 && item._score < 15}>
                                                {highlightLabel(item.label, item._positions)}
                                            </ItemLabel>
                                            <ItemDescription>{item.description}</ItemDescription>
                                        </ItemContent>
                                        <CategoryBadge $cat={item.kind === "action" ? item.category : item.category}>
                                            {item.kind === "action" ? item.category : item.category}
                                        </CategoryBadge>
                                    </ResultItem>
                                );
                            })}
                        </div>
                    ))}

                    {noResults && <EmptyMessage>{L.noResults.replace("[QUERY]", query)}</EmptyMessage>}
                </ResultsList>

                {/* Footer hints */}
                <Footer>
                    <span>
                        <kbd>↑</kbd>
                        <kbd>↓</kbd> navigate
                    </span>
                    <span>
                        <kbd>↵</kbd> open
                    </span>
                    <span>
                        <kbd>Esc</kbd> close
                    </span>
                </Footer>
            </PaletteBox>
        </Backdrop>
    );
}

CommandPalette.propTypes = {
    open: bool.isRequired,
    onClose: func.isRequired
};
