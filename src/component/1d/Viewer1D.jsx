import React, {
  useCallback,
  Fragment,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { useSize, useDebounce } from 'react-use';

// import BrushX from '../tool/BrushX';
import { BrushTracker } from '../EventsTrackers/BrushTracker';
import { MouseTracker } from '../EventsTrackers/MouseTracker';
import { useChartData } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import { ScaleProvider } from '../context/ScaleContext';
import { useModal } from '../elements/Modal';
import Spinner from '../loader/Spinner';
import MultipletAnalysisModal from '../modal/MultipletAnalysisModal';
import { getXScale, getYScale } from '../reducer/core/scale';
import {
  ADD_INTEGRAL,
  ADD_PEAKS,
  ADD_BASE_LINE_ZONE,
  BRUSH_END,
  FULL_ZOOM_OUT,
  CHANGE_INTEGRAL_ZOOM,
  SET_ZOOM_FACTOR,
  ADD_PEAK,
  SET_VERTICAL_INDICATOR_X_POSITION,
  SET_DIMENSIONS,
  ADD_RANGE,
} from '../reducer/types/Types';
import BrushXY, { BRUSH_TYPE } from '../tool/BrushXY';
import CrossLinePointer from '../tool/CrossLinePointer';
import PeakPointer from '../tool/PeakPointer';
import VerticalIndicator from '../tool/VerticalIndicator';
import XLabelPointer from '../tool/XLabelPointer';
import { options } from '../toolbar/ToolTypes';

import Chart1D from './Chart1D';
import FooterBanner from './FooterBanner';

const Viewer1D = () => {
  //   const { selectedTool, isLoading, data } = useChartData();
  const state = useChartData();
  const {
    selectedTool,
    isLoading,
    data,
    mode,
    width: widthProp,
    height: heightProp,
    margin,
    activeSpectrum,
  } = state;

  const dispatch = useDispatch();
  const modal = useModal();

  const scaleX = useCallback(
    (spectrumId = null) => getXScale(spectrumId, state),
    [state],
  );

  const scaleY = useMemo(() => {
    return (spectrumId = null, heightProps = null, isReverse = false) =>
      getYScale(spectrumId, heightProps, isReverse, state);
  }, [state]);

  const handelBrushEnd = useCallback(
    (brushData) => {
      if (brushData.altKey) {
        switch (selectedTool) {
          case options.rangesPicking.id:
            modal.show(
              <MultipletAnalysisModal
                data={data}
                activeSpectrum={activeSpectrum}
                scaleX={scaleX}
                {...brushData}
              />,
              {
                onClose: () => {
                  modal.close();
                },
              },
            );
            break;
          default:
            break;
        }
      } else if (brushData.shiftKey) {
        switch (selectedTool) {
          case options.integral.id:
            dispatch({
              type: ADD_INTEGRAL,
              ...brushData,
            });
            break;
          case options.rangesPicking.id:
            dispatch({
              type: ADD_RANGE,
              ...brushData,
            });
            break;

          case options.peakPicking.id:
            dispatch({
              type: ADD_PEAKS,
              ...brushData,
            });
            break;
          default:
            break;
        }
      } else {
        switch (selectedTool) {
          case options.baseLineCorrection.id:
            dispatch({
              type: ADD_BASE_LINE_ZONE,
              zone: { from: brushData.startX, to: brushData.endX },
            });
            break;

          default:
            dispatch({ type: BRUSH_END, ...brushData });

            return;
        }
      }
    },
    [dispatch, selectedTool, data, modal, activeSpectrum, scaleX],
  );

  const handelOnDoubleClick = useCallback(() => {
    dispatch({ type: FULL_ZOOM_OUT });
  }, [dispatch]);

  const handleZoom = useCallback(
    (event) => {
      switch (selectedTool) {
        case options.integral.id:
          dispatch({ type: CHANGE_INTEGRAL_ZOOM, ...event });
          break;

        default:
          dispatch({ type: SET_ZOOM_FACTOR, ...event });

          return;
      }
    },
    [dispatch, selectedTool],
  );

  const mouseClick = useCallback(
    (position) => {
      if (selectedTool === options.peakPicking.id) {
        dispatch({
          type: ADD_PEAK,
          mouseCoordinates: position,
        });
      } else if (selectedTool === options.phaseCorrection.id) {
        dispatch({
          type: SET_VERTICAL_INDICATOR_X_POSITION,
          position: position.x,
        });
      }
    },
    [dispatch, selectedTool],
  );

  // const frequency = useMemo(() => {
  //   return activeSpectrum
  //     ? lodash.get(data[activeSpectrum.index], 'info.frequency')
  //     : 0;
  // }, [activeSpectrum, data]);
  // const currentSpectrum = useMemo(() => {
  //   console.log(activeSpectrum)
  //   return activeSpectrum ? data[activeSpectrum.index] : null;
  // }, [activeSpectrum, data]);

  const [sizedNMRChart, { width, height }] = useSize(() => {
    return (
      <Fragment>
        <Spinner isLoading={isLoading} />

        {data && data.length > 0 && (
          <BrushTracker
            onBrush={handelBrushEnd}
            onDoubleClick={handelOnDoubleClick}
            onClick={mouseClick}
            onZoom={handleZoom}
            style={{
              width: '100%',
              height: '100%',
              margin: 'auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <MouseTracker
              style={{ width: '100%', height: `100%`, position: 'absolute' }}
            >
              <CrossLinePointer />
              <BrushXY brushType={BRUSH_TYPE.X} />
              <XLabelPointer />
              <PeakPointer />
              <VerticalIndicator />
              <FooterBanner />
              <Chart1D
                width={widthProp}
                height={heightProp}
                margin={margin}
                mode={mode}
              />
            </MouseTracker>
          </BrushTracker>
        )}
      </Fragment>
    );
  }, []);

  const [finalSize, setFinalSize] = useState();
  useDebounce(() => setFinalSize({ width, height }), 400, [width, height]);
  useEffect(() => {
    if (
      finalSize &&
      finalSize.width !== Infinity &&
      finalSize.height !== Infinity
    ) {
      dispatch({
        type: SET_DIMENSIONS,
        ...finalSize,
      });
    }
  }, [dispatch, finalSize]);

  return (
    <ScaleProvider value={{ scaleX, scaleY }}>{sizedNMRChart}</ScaleProvider>
  );
};

export default Viewer1D;
