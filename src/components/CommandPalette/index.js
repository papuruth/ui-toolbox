import { Search } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bool, func } from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import localization from "localization";
import storage from "utils/storage";
import { fuzzyFilter } from "utils/fuzzySearch";
import { detectInputType } from "utils/inputDetector";
import { buildActions, CATEGORY_EMOJI, ENRICHED_TOOLS, getRecentToolEntries } from "./paletteData";
import {
    Backdrop,
    CategoryBadge,
    EmptyMessage,
    Footer,
    ItemContent,
    ItemDescription,
    ItemIconWrap,
    ItemLabel,
    KbdHint,
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

const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);

export default function CommandPalette({ open, onClose }) {
    const dispatch = useDispatch();
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

    // Smart detection fires when query looks like data, not a search phrase
    const smartDetection = useMemo(() => {
        if (query.length < 8) return null;
        return detectInputType(query);
    }, [query]);

    // Build sections and flat selectable list
    const { sections, selectables } = useMemo(() => {
        const secs = [];

        if (!query.trim()) {
            // Empty query: recent first, then all tools
            const recent = getRecentToolEntries();
            if (recent.length > 0) {
                secs.push({ id: "recent", label: "Recent", items: recent });
            }
            secs.push({ id: "tools", label: "Tools", items: ENRICHED_TOOLS });
        } else {
            // Search: fuzzy across tools + actions
            const allItems = [...ENRICHED_TOOLS, ...actions];
            const matched = fuzzyFilter(allItems, query, (item) => [item.label, item.description || "", ...(item.keywords || [])]);

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
    }, [query, actions, smartDetection]);

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
                navigateTo(item.detection.route);
            } else if (item.kind === "action") {
                item.run();
            } else {
                navigateTo(item.route);
            }
        },
        [navigateTo]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, selectables.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
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

    if (!open) return null;

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
                    <SearchInput
                        ref={inputRef}
                        value={query}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        placeholder={L.placeholder}
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
                            onMouseDown={() => navigateTo(smartDetection.route)}
                        >
                            <span style={{ fontSize: "1.1rem" }}>🧠</span>
                            <SmartBannerText>
                                <strong>{smartDetection.label}</strong> detected — open in{" "}
                                <strong>{ENRICHED_TOOLS.find((t) => t.route === smartDetection.route)?.label}</strong>
                            </SmartBannerText>
                            <SmartBannerArrow>Open →</SmartBannerArrow>
                        </SmartBanner>
                    )}

                    {/* Sections */}
                    {renderedSections.map((sec) => (
                        <div key={sec.id}>
                            <SectionHeader>{sec.label}</SectionHeader>
                            {sec.items.map((item, i) => {
                                const globalIdx = sec.startIndex + i;
                                const isActive = globalIdx === activeIndex;
                                let emoji = CATEGORY_EMOJI[item.category] || "🛠️";
                                if (item.kind === "recent") emoji = CATEGORY_EMOJI.recent;
                                else if (item.kind === "action") emoji = CATEGORY_EMOJI[item.category] || CATEGORY_EMOJI.action;

                                return (
                                    <ResultItem
                                        key={item.id || item.route}
                                        $active={isActive}
                                        data-active={isActive}
                                        onMouseEnter={() => setActiveIndex(globalIdx)}
                                        onMouseDown={() => executeItem(item)}
                                    >
                                        <ItemIconWrap $kind={item.kind}>{emoji}</ItemIconWrap>
                                        <ItemContent>
                                            <ItemLabel>{item.label}</ItemLabel>
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
