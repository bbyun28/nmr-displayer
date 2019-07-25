import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import '../css/cross-line-tool.css';
import {ChartContext} from '../context/chart-context';

const CrossLineCursorTool = ({ position }) => {
  const { height,width,margin } = useContext(ChartContext); 

  return (
   position.x !=0 && position.y !=0 &&  <g key="crossLine">
      <line
        className="vertical_line"
        x1={position.x}
        y1="0"
        x2={position.x}
        y2={`${height - margin.top}`}
        key="vertical_line"
      />
      <line className="vertical_line" x1="0" y1={position.y} x2={`${width}`} y2={position.y}   key="horizental_line" />
    </g>
  
  );
};

export default CrossLineCursorTool;

CrossLineCursorTool.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
};