import airPLS from 'ml-airpls';
import equallySpaced from 'ml-array-xy-equally-spaced';
import baselineRegression from 'ml-baseline-correction-regression';
import PolynomialRegression from 'ml-regression-polynomial';
// import PolynomialRegression from 'ml-regression-polynomial';

export const id = 'baselineCorrection';
export const name = 'baseline correction';

/**
 *
 * @param {Datum1d} datum1d
 */

export const baselineAlgorithms = {
  airpls: 'airPLS',
  polynomial: 'Polynomial',
};

export function apply(datum1D, options = {}) {
  if (!isApplicable(datum1D)) {
    throw new Error('baselineCorrection not applicable on this data');
  }
  const { algorithm, zones } = options;
  let { x, re } = datum1D.data;

  let corrected;
  switch (algorithm) {
    case 'airpls':
      corrected = airPLS(x, re, options).corrected;
      break;
    case 'polynomial':
      {
        let reduced = equallySpaced(
          { x, y: re },
          { numberOfPoints: 4096, zones },
        );
        if (zones.length === 0) {
          let { regression } = baselineRegression(
            reduced.x,
            reduced.y,
            options,
          );
          corrected = new Float64Array(x.length);
          for (let i = 0; i < re.length; i++) {
            corrected[i] = re[i] - regression.predict(x[i]);
          }
        } else {
          let polynomialRegression = new PolynomialRegression(
            x,
            re,
            options.degree,
          );
          corrected = new Float64Array(x.length);
          for (let i = 0; i < re.length; i++) {
            corrected[i] = re[i] - polynomialRegression.predict(x[i]);
          }
        }
      }

      break;
    default:
      throw new Error(`baselineCorrection: algorithm unknown: ${algorithm}`);
  }

  Object.assign(datum1D.data, { re: corrected });
}

export function isApplicable(datum1D) {
  if (!datum1D.info.isFid) return true;
  return false;
}

export function reduce() {
  return {
    once: false,
    reduce: null,
  };
}

/**
 * Will extract x/y points based on zones
 * @param {*} x
 * @param {*} re
 * @param {*} zones
 */
// eslint-disable-next-line no-unused-vars
function getZones(x, re, zones = []) {}
