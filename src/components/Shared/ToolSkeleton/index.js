import { Box, Skeleton } from "@mui/material";
import React from "react";

/**
 * Generic skeleton loader for tool cards while async operations are running.
 * Shows a pulsing placeholder matching the typical tool output shape.
 */
export default function ToolSkeleton({ rows = 4 }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2 }}>
            <Skeleton variant="rounded" height={48} animation="wave" sx={{ background: "rgba(255,255,255,0.06)" }} />
            {Array.from({ length: rows }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton
                    key={i}
                    variant="rounded"
                    height={32}
                    animation="wave"
                    sx={{ background: "rgba(255,255,255,0.04)", width: `${90 - i * 8}%` }}
                />
            ))}
        </Box>
    );
}
