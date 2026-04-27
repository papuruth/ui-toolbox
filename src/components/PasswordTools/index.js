import PasswordGenerator from "components/PasswordGenerator";
import PasswordStrengthMeter from "components/PasswordStrengthMeter";
import { TabBtn, TabStrip } from "components/Shared/ToolKit";
import localization from "localization";
import React, { useState } from "react";

const { passwordTools: L } = localization;

export default function PasswordTools() {
    const [tab, setTab] = useState("generator");
    return (
        <>
            <TabStrip>
                <TabBtn $active={tab === "generator"} onClick={() => setTab("generator")}>
                    {L.generatorTab}
                </TabBtn>
                <TabBtn $active={tab === "strength"} onClick={() => setTab("strength")}>
                    {L.strengthMeterTab}
                </TabBtn>
            </TabStrip>
            {tab === "generator" ? <PasswordGenerator /> : <PasswordStrengthMeter />}
        </>
    );
}
