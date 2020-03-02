import { produce } from 'immer';

import { AnalysisObj } from '../core/Analysis';

import { setDomain, setMode } from './DomainActions';

const handleSpectrumVisibility = (state, data) => {
  return produce(state, (draft) => {
    for (let datum of draft.data) {
      if (data.some((sData) => sData.id === datum.id)) {
        datum.isVisible = true;
      } else {
        datum.isVisible = false;
      }
    }
  });
};

const handleChangePeaksMarkersVisibility = (state, data) => {
  return produce(state, (draft) => {
    for (let datum of draft.data) {
      if (data.some((activeData) => activeData.id === datum.id)) {
        AnalysisObj.getDatum(datum.id).isPeaksMarkersVisible = true;
        datum.isPeaksMarkersVisible = true;
      } else {
        AnalysisObj.getDatum(datum.id).isPeaksMarkersVisible = false;
        datum.isPeaksMarkersVisible = false;
      }
    }
  });
};

const handleChangeActiveSpectrum = (state, activeSpectrum) => {
  return produce(state, (draft) => {
    let refreshDomain = false;

    if (activeSpectrum) {
      AnalysisObj.getDatum(activeSpectrum.id).isVisible = true;
      const newIndex = draft.data.findIndex((d) => d.id === activeSpectrum.id);
      const oldIndex = draft.data.findIndex(
        (d) => d.id === draft.activeSpectrum?.id,
      );
      if (newIndex !== -1) {
        draft.data[newIndex].isVisible = true;
      }
      if (oldIndex !== -1) {
        refreshDomain =
          draft.data[oldIndex].info.isFid === draft.data[newIndex].info.isFid
            ? false
            : true;
      } else {
        refreshDomain = draft.data[newIndex].info.isFid;
      }
      activeSpectrum = { ...activeSpectrum, index: newIndex };
      draft.activeSpectrum = activeSpectrum;
    } else {
      draft.activeSpectrum = null;
      refreshDomain = false;
    }
    /**
     * if the active spectrum not is FID then dont refresh the domain and the mode when the first time you activate soectrum
     * if the new active spectrum different than the previous active spectrum fid then refresh the domain andf the mode.
     */
    //
    if (refreshDomain) {
      setDomain(draft);
      setMode(draft);
    }
  });
};

const handleChangeSpectrumColor = (state, { id, color }) => {
  return produce(state, (draft) => {
    const index = draft.data.findIndex((d) => d.id === id);
    if (index !== -1) {
      draft.data[index].color = color;
      AnalysisObj.getDatum(id).display.color = color;
    }
  });
};

const handleDeleteSpectra = (state, action) => {
  return produce(state, (draft) => {
    const { activeSpectrum } = draft;
    if (activeSpectrum && activeSpectrum.id) {
      AnalysisObj.deleteDatumByIDs([activeSpectrum.id]);
      draft.activeSpectrum = null;
      draft.data = AnalysisObj.getSpectraData();
      setDomain(draft);
      setMode(draft);
    } else {
      const { IDs } = action;
      AnalysisObj.deleteDatumByIDs(IDs);
      draft.data = AnalysisObj.getSpectraData();
    }
  });
};

export {
  handleSpectrumVisibility,
  handleChangePeaksMarkersVisibility,
  handleChangeActiveSpectrum,
  handleChangeSpectrumColor,
  handleDeleteSpectra,
};
