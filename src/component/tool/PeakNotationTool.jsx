import React, {
  useEffect,
  useRef,
  useState,
  Fragment,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import '../css/peak-notification-tool.css';
import { ChartContext } from '../context/ChartContext';
import { FaMinus } from 'react-icons/fa';
import {getPeakLabelNumberDecimals} from '../../data/default';

export const NotationTemplate = ({
  id,
  spectrumID,
  x,
  y,
  value,
  color,
  isActive,
  decimalFraction,
  onPeakValueChange,
  onSelected,
  onDeleteNotation,
}) => {
  const refText = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const [_value, setValue] = useState(value);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isOver, setIsOver] = useState({ id: null, flag: false });

  useEffect(() => {
    const textBox = refText.current.getBBox();
    setContainerSize({ width: textBox.width, height: textBox.height });
  }, [isSelected]);



  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const newValue = parseFloat(event.target.value);
      const oldValue = parseFloat(value);
      const shiftValue = parseFloat(event.target.value) - parseFloat(value);
      onPeakValueChange({
        id: id,
        value: newValue,
        oldValue: oldValue,
        shiftValue: shiftValue,
      });

      event.target.blur();
      setIsSelected(false);
    } else if (event.keyCode === 27) {
      setValue(value);
      event.target.blur();
      setIsSelected(false);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSelectPeakNotation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelected(id);
    setIsSelected(true);
  };
  const handleMouseOutPeakNotation = (e) => {};

  const handleOnOverNotation = (id) => {
    setIsOver({ id: id, flag: true });
  };

  const handleOnMouseLeaveNotation = () => {
    setTimeout(() => {
      setIsOver({ id: null, flag: false });
    }, 300);
  };

  const handleDeleteNotation = (e, data) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteNotation(data);
  };

  return (
    <Fragment>
      <g
        id={id}
        transform={`translate(${x}, ${y})`}
        onMouseOver={() => {
          handleOnOverNotation(id);
        }}
        onMouseLeave={handleOnMouseLeaveNotation}
      >
        {/* <rect
        x="0"
        y="-30"
        width={containerSize.width + 10}
        height={containerSize.height}
      /> */}

        <line x1="0" x2="0" y1="-5" y2={-30} stroke={color} strokeWidth="1" />
        <text
          ref={refText}
          x="0"
          y={-20}
          dy="0.1em"
          dx="0.35em"
          fill="transparent"
        >
          {isSelected?value:parseFloat(value).toFixed(decimalFraction)}
        </text>

        {/* <circle cx="0" cy="0" r="1" fill="red" /> */}

        <foreignObject
          onMouseOut={handleMouseOutPeakNotation}
          x="0"
          y="-30"
          width={containerSize.width + 20}
          height={containerSize.height + 30}
        >
          <div
            style={{
              width: containerSize.width + 20,
              height: containerSize.height + 30,
              paddingRight: 5,
            }}
            xmlns="http://www.w3.org/1999/xhtml"
          >
            <input
              onClick={handleSelectPeakNotation}
              className={
                isSelected
                  ? 'notification-input input-over'
                  : 'notification-input-normal'
              }
              style={{
                width:"inherit",
                border: isSelected ? `1px solid ${color}` : `0`,
                opacity: isActive ? 1 : 0.2,
              }}
              value={isSelected?_value:parseFloat(_value).toFixed(decimalFraction)}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              type="number"
              disabled={!isActive}
            />
            {isOver.id && isOver.flag === true && (
              <button
                onClick={(e) =>
                  handleDeleteNotation(e, { xIndex: id, id: spectrumID })
                }
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 0,
                  padding: 0,
                  width: 15,
                  height: 15,
                  borderRadius: 15,
                  position: 'absolute',
                  left: containerSize.width,
                  top: containerSize.height + 7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaMinus />
              </button>
            )}
          </div>
        </foreignObject>
        {/* 
      <rect
        x="0"
        y="0"
        width={containerSize.width + 10}
        height={containerSize.height + 30}
        onMouseEnter={handleMouseOverPeakNotation}
        onMouseOut={handleMouseOutPeakNotation}
        className="notifcate-selected"
      /> */}
      </g>
    </Fragment>
  );
};

const PeakNotationTool = ({
  notationData,
  position,
  showCursorLabel,
  onPeakValueChange,
  onDeleteNotation,
}) => {
  const { getScale, data, activeSpectrum, verticalAlign } = useContext(
    ChartContext,
  );

  // const [notationId, setNotationId] = useState();
  useEffect(() => {}, []);

  const handelOnSelected = (id) => {
    console.log(id);
    // setNotationId(id);
  };

  const reSortData = () => {
    const _data = [...data];

    return activeSpectrum
      ? _data.sort(function(x, y) {
          return x.id === activeSpectrum.id
            ? 1
            : y.id === activeSpectrum.id
            ? -1
            : 0;
        })
      : _data;
  };

  const reSortNotificationLabel = (xIndex, notificationsData) => {
    return notificationsData
      ? notificationsData.sort(function(x, y) {
          return x.xIndex === xIndex ? 1 : y.xIndex === xIndex ? -1 : 0;
        })
      : notificationsData;
  };

  const getVerticalAlign = (id) => {
    return data.findIndex((d) => d.id === id) * verticalAlign;
  };

  return (
    <Fragment>
      <g key="peakNotification">
        {data &&
          reSortData().map((d, i) => {
            return (
              <g key={i} transform={`translate(0,${getVerticalAlign(d.id)})`}>
                {notationData &&
                  notationData[d.id] &&
                  d.isVisible &&
                  d.isPeaksMarkersVisible &&
                  notationData[d.id].map(({ xIndex }, i) => (
                    <NotationTemplate
                      key={i}
                      x={getScale(d.id).x(d.x[xIndex])}
                      y={getScale(d.id).y(d.y[xIndex])}
                      id={xIndex}
                      spectrumID={d.id}
                      value={d.x[xIndex]}
                      onPeakValueChange={onPeakValueChange}
                      onSelected={handelOnSelected}
                      onDeleteNotation={onDeleteNotation}
                      color={d.color}
                      decimalFraction={getPeakLabelNumberDecimals(d.nucleus)}
                      isActive={
                        activeSpectrum == null
                          ? false
                          : activeSpectrum.id === d.id
                          ? true
                          : false
                      }
                    />
                  ))}
              </g>
            );
          })}
      </g>
      {showCursorLabel && (
        <g>
          <text x={position.x} y={position.y} dy="0em" dx="0.35em">
            {getScale().x.invert(position.x)}
          </text>
        </g>
      )}
    </Fragment>
  );
};

export default PeakNotationTool;

PeakNotationTool.contextTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  onPeakValueChange: PropTypes.func,
  onDeleteNotation: PropTypes.func,
};

PeakNotationTool.defaultProps = {
  onPeakValueChange: () => {
    return null;
  },
  onDeleteNotation: () => {
    return null;
  },
};