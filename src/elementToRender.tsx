import { Component, ErrorInfo, ReactNode } from 'react';
import { AppProps } from 'single-spa';
import { SingleSpaRoot } from './SingleSpaRoot';
import { SingleSpaReactConfig } from './types';

interface ErrorBoundaryProps {
  children: ReactNode;
}

type ErrorBoundaryState =
  | { caughtError: Error; caughtErrorInfo: ErrorInfo }
  | { caughtError: null; caughtErrorInfo: null };

const createErrorBoundary = <RootComponentProps,>(
  { errorBoundary }: SingleSpaReactConfig<RootComponentProps>,
  props: AppProps & RootComponentProps,
) =>
  class extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static displayName = `SingleSpaReactErrorBoundary(${props.name})`;

    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { caughtError: null, caughtErrorInfo: null };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      this.setState({ caughtError: error, caughtErrorInfo: errorInfo });
    }

    override render() {
      const { caughtError, caughtErrorInfo } = this.state;
      const { children } = this.props;
      return caughtError
        ? errorBoundary(caughtError, caughtErrorInfo, props)
        : children;
    }
  };

export const getElementToRender = <RootComponentProps,>(
  config: SingleSpaReactConfig<RootComponentProps>,
  props: AppProps & RootComponentProps,
  mountFinished: VoidFunction | null,
) => {
  const { RootComponent, SingleSpaContext, unmountFinished, updateResolves } =
    config;
  const { name } = props;
  const ErrorBoundary = createErrorBoundary(config, props);
  const updateFinished = () => {
    updateResolves.get(name)?.forEach(resolve => resolve());
    updateResolves.delete(name);
  };

  return (
    <SingleSpaRoot
      {...props}
      mountFinished={mountFinished}
      unmountFinished={unmountFinished}
      updateFinished={updateFinished}
    >
      <ErrorBoundary>
        <SingleSpaContext.Provider value={props}>
          <RootComponent {...props} />
        </SingleSpaContext.Provider>
      </ErrorBoundary>
    </SingleSpaRoot>
  );
};
