import { noop } from 'lodash';
import { bool, func, node, object, oneOfType } from 'prop-types';
import React from 'react';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import sizeMe from 'react-sizeme';

const COLS_CONFIG = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 1 };
const BREAKPOINTS_CONFIG = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };

function ResponsiveGridLayout({ gridLayouts, children, isResizable = false, onLayoutChange, onBreakpointChange, size, isDraggable = false }) {
  let columnWidth = size?.width;
  const is12GridLayout = columnWidth > 1200;
  const is10GridLayout = columnWidth < 1200;
  const is6GridLayout = columnWidth < 996;
  const is4GridLayout = columnWidth < 768;
  let layoutWidth = 2;
  if (is12GridLayout) {
    layoutWidth = 12;
  }
  if (is10GridLayout) {
    layoutWidth = 10;
  }
  if (is6GridLayout) {
    layoutWidth = 6;
  }
  if (is4GridLayout) {
    layoutWidth = 4;
  }
  columnWidth = columnWidth / layoutWidth - 20;
  const rowHeight = columnWidth * 1;
  return (
    <Responsive
      className="layout"
      cols={COLS_CONFIG}
      breakpoints={BREAKPOINTS_CONFIG}
      layouts={gridLayouts}
      isResizable={isResizable}
      margin={[20, 20]}
      onLayoutChange={onLayoutChange}
      onBreakpointChange={onBreakpointChange}
      width={Math.floor(size.width)}
      isDraggable={isDraggable}
      rowHeight={rowHeight}
    >
      {children}
    </Responsive>
  );
}

ResponsiveGridLayout.defaultProps = {
  isResizable: false,
  onLayoutChange: noop,
  onBreakpointChange: noop,
  isDraggable: false,
};

ResponsiveGridLayout.propTypes = {
  gridLayouts: oneOfType([object]).isRequired,
  children: node.isRequired,
  isResizable: bool,
  onLayoutChange: func,
  onBreakpointChange: func,
  size: oneOfType([object]).isRequired,
  isDraggable: bool,
};

export default sizeMe({ monitorWidth: true, refreshRate: 300 })(ResponsiveGridLayout);
