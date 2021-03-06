import { ReIm } from 'ml-spectra-processing';

export const id = 'digitalFilter';
export const name = 'Digital Filter';

/**
 * Move points from the beginning to the end of FID and performs a first order phase correction
 * @param {Datum1d} datum1d
 */

export function apply(datum1D, options = {}) {
  if (!isApplicable(datum1D)) {
    throw new Error('Digital Filter is not applicable on this data');
  }

  let { grpdly = 0, dspfvs, decim } = options;

  let re = new Float64Array(datum1D.data.re);
  let im = new Float64Array(datum1D.data.im);
  let ph1;
  let pointsToShift;
  if (grpdly > 0) {
    pointsToShift = Math.floor(Number(grpdly));
  } else {
    if (dspfvs > 14) {
      pointsToShift = 0;
    } else {
      if (!brukerDspTable[dspfvs]) {
        throw new Error('dspfvs not in lookup table');
      } else {
        const dspfvsList = brukerDspTable[dspfvs];
        if (!dspfvsList[decim]) throw new Error('decim not in lookup table');
        pointsToShift = dspfvsList[decim];
      }
    }
  }

  const skip = 0;
  pointsToShift += 0;

  const newRe = new Float64Array(re.length);
  const newIm = new Float64Array(im.length);
  newRe.set(re.slice(pointsToShift));
  newRe.set(re.slice(skip, pointsToShift), re.length - pointsToShift);
  newIm.set(im.slice(pointsToShift));
  newIm.set(im.slice(skip, pointsToShift), im.length - pointsToShift);

  datum1D.data.re = newRe;
  datum1D.data.im = newIm;

  ph1 = grpdly - pointsToShift;

  ph1 *= Math.PI * 2;
  Object.assign(datum1D.data, ReIm.phaseCorrection(datum1D.data, 0, ph1));
}

export function isApplicable(datum1D) {
  if (datum1D.info.isComplex && datum1D.info.isFid) return true;
  return false;
}

export function reduce() {
  return {
    once: true,
    reduce: undefined,
  };
}

const brukerDspTable = {
  10: {
    2: 44.75,
    3: 33.5,
    4: 66.625,
    6: 59.083333333333333,
    8: 68.5625,
    12: 60.375,
    16: 69.53125,
    24: 61.020833333333333,
    32: 70.015625,
    48: 61.34375,
    64: 70.2578125,
    96: 61.505208333333333,
    128: 70.37890625,
    192: 61.5859375,
    256: 70.439453125,
    384: 61.626302083333333,
    512: 70.4697265625,
    768: 61.646484375,
    1024: 70.48486328125,
    1536: 61.656575520833333,
    2048: 70.492431640625,
  },
  11: {
    2: 46,
    3: 36.5,
    4: 48,
    6: 50.166666666666667,
    8: 53.25,
    12: 69.5,
    16: 72.25,
    24: 70.166666666666667,
    32: 72.75,
    48: 70.5,
    64: 73,
    96: 70.666666666666667,
    128: 72.5,
    192: 71.333333333333333,
    256: 72.25,
    384: 71.666666666666667,
    512: 72.125,
    768: 71.833333333333333,
    1024: 72.0625,
    1536: 71.916666666666667,
    2048: 72.03125,
  },
  12: {
    2: 46,
    3: 36.5,
    4: 48,
    6: 50.166666666666667,
    8: 53.25,
    12: 69.5,
    16: 71.625,
    24: 70.166666666666667,
    32: 72.125,
    48: 70.5,
    64: 72.375,
    96: 70.666666666666667,
    128: 72.5,
    192: 71.333333333333333,
    256: 72.25,
    384: 71.666666666666667,
    512: 72.125,
    768: 71.833333333333333,
    1024: 72.0625,
    1536: 71.916666666666667,
    2048: 72.03125,
  },
  13: {
    2: 2.75,
    3: 2.8333333333333333,
    4: 2.875,
    6: 2.9166666666666667,
    8: 2.9375,
    12: 2.9583333333333333,
    16: 2.96875,
    24: 2.9791666666666667,
    32: 2.984375,
    48: 2.9895833333333333,
    64: 2.9921875,
    96: 2.9947916666666667,
  },
};
