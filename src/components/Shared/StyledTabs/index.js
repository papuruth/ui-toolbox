import { styled } from "@mui/material/styles";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { TabPanel as BaseTabPanel } from "@mui/base/TabPanel";
import { buttonClasses } from "@mui/base/Button";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import colors from "styles/colors";

export const StyledTab = styled(BaseTab)`
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 14px;
    height: 26px;
    padding: 2px 8px;
    transition: all 0.3s ease;
    user-select: none;
    align-items: center;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    border: none;
    background: transparent;

    &.${tabClasses.selected} {
        background-color: var(--bg-card);
        box-shadow: 0 2px 5px 2px rgba(33, 33, 33, 0.102);
        color: ${colors.primary};
        font-weight: 500;
    }

    &.${buttonClasses.disabled} {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const StyledTabPanel = styled(BaseTabPanel)(
    () => `
  width: 100%;
  `
);

export const StyledTabsList = styled(BaseTabsList)(
    () => `
  min-width: 135px;
  background-color: var(--bg-surface);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 4px;
  place-content: space-between center;
  `
);
