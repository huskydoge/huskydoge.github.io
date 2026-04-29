/** Shared page-level UI state for layout and generated page metadata. */
import React, { useEffect, useState } from 'react';

const Context = React.createContext({});
const PAGE_LAYOUT_MODE_KEY = 'page-layout-mode';

/** Read the saved content layout preference in the browser. */
const getSavedPageLayoutMode = () => {
  if (typeof window === 'undefined') {
    return 'single';
  }

  try {
    const savedLayoutMode = window.localStorage.getItem(PAGE_LAYOUT_MODE_KEY);
    return savedLayoutMode === 'double' || savedLayoutMode === 'single'
      ? savedLayoutMode
      : 'single';
  } catch (error) {
    return 'single';
  }
};

export const ContextProvider = (props) => {
  const [state, setStateBase] = useState({ pageLayoutMode: getSavedPageLayoutMode() });

  useEffect(() => {
    const nextLayoutMode = getSavedPageLayoutMode();
    setStateBase((previousState) => ({
      ...previousState,
      pageLayoutMode: nextLayoutMode,
    }));
  }, []);

  /** Merge partial context updates so page metadata does not reset layout state. */
  const setState = (nextState) => {
    setStateBase((previousState) => {
      const partialState = typeof nextState === 'function'
        ? nextState(previousState)
        : nextState;
      if (partialState?.pageLayoutMode && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(PAGE_LAYOUT_MODE_KEY, partialState.pageLayoutMode);
        } catch (error) {
          // Ignore storage failures; layout still updates for the current session.
        }
      }

      return {
        ...previousState,
        ...partialState,
      };
    });
  };
  return (
    <Context.Provider value={{ state, setState }}>
      {props.children}
    </Context.Provider>
  );
};

export const ContextConsumer = Context.Consumer;

export default Context;
