/** Shared page-level UI state for layout and generated page metadata. */
import React, { useState } from 'react';

const Context = React.createContext({});

export const ContextProvider = (props) => {
  const [state, setStateBase] = useState({});

  /** Merge partial context updates from page-level helpers such as table of contents. */
  const setState = (nextState) => {
    setStateBase((previousState) => {
      const partialState = typeof nextState === 'function'
        ? nextState(previousState)
        : nextState;

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
