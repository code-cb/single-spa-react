import {
  ComponentType,
  Context,
  ErrorInfo,
  ReactElement,
  ReactNode,
} from 'react';
import { Root } from 'react-dom/client';
import { AppProps, CustomProps } from 'single-spa';

export type DomHandlingType = 'createRoot' | 'hydrateRoot';

export interface SingleSpaReactOptions<RootComponentProps> {
  domElementGetter?: (props: AppProps) => HTMLElement;
  domHandlingType?: DomHandlingType | (() => DomHandlingType);
  errorBoundary: (
    err: Error,
    errInfo: ErrorInfo,
    props: RootComponentProps,
  ) => ReactElement;
  parcelCanUpdate?: boolean;
  RootComponent: ComponentType<RootComponentProps>;
}

export type SingleSpaContextValue = AppProps & CustomProps;

export type SingleSpaContext = Context<SingleSpaContextValue | undefined>;

export interface SingleSpaRootProps {
  children?: ReactNode;
  mountFinished: VoidFunction | null;
  name: string;
  unmountFinished: VoidFunction;
  updateFinished: VoidFunction;
}

type AppName = string;

export interface SingleSpaReactConfig<RootComponentProps>
  extends Omit<SingleSpaReactOptions<RootComponentProps>, 'parcelCanUpdate'> {
  roots: Map<AppName, Root>;
  SingleSpaContext: SingleSpaContext;
  unmountFinished: VoidFunction;
  updateResolves: Map<AppName, VoidFunction[]>;
}
