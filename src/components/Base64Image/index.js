import Base64ToImage from "components/Base64ToImage";
import ImageToBase64 from "components/ImageToBase64";
import { TabBtn, TabStrip } from "components/Shared/ToolKit";
import localization from "localization";
import React, { useState } from "react";

const { base64Image: L } = localization;

export default function Base64Image() {
    const [tab, setTab] = useState(0);

    return (
        <>
            <TabStrip>
                <TabBtn $active={tab === 0} onClick={() => setTab(0)}>
                    {L.imageToBase64Tab}
                </TabBtn>
                <TabBtn $active={tab === 1} onClick={() => setTab(1)}>
                    {L.base64ToImageTab}
                </TabBtn>
            </TabStrip>
            {tab === 0 ? <ImageToBase64 /> : <Base64ToImage />}
        </>
    );
}
