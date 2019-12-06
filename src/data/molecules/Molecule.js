import { Molecule as OCLMolecule } from 'openchemlib';
import { MF } from 'mf-parser';

export class Molecule {
  /**
   * @param {object} [options={}]
   * @param {object} [options.molfile='']
   * @param {object} [options.key=Math.random()] Optional unique identifier
   */
  constructor(options = {}) {
    this.key =
      options.key ||
      Math.random()
        .toString(36)
        .replace('0.', '');
    this.molfile = options.molfile || '';
    const molecule = new OCLMolecule.fromMolfile(this.molfile);
    const mfInfo = molecule.getMolecularFormula();
    this.mf = mfInfo.formula;
    this.em = mfInfo.absoluteWeight;
    this.mw = mfInfo.relativeWeight;
    this.svg = molecule.toSVG(50, 50);

    const mf = new MF(this.mf);
    this.atoms = mf.getInfo().atoms;
  }

  toJSON() {
    return {
      molfile: this.molfile,
    };
  }
}