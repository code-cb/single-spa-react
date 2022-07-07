import { createContext } from 'react';
import { LifeCycles } from 'single-spa';
import { createMount } from './mount';
import {
  SingleSpaContext,
  SingleSpaContextValue,
  SingleSpaReactConfig,
  SingleSpaReactOptions,
} from './types';
import { createUnmount } from './unmount';
import { createUpdate } from './update';

let SingleSpaContext: SingleSpaContext | null = null;

const validateOptions = (opts: SingleSpaReactOptions<any>) => {
  if (typeof opts !== 'object')
    throw new Error(`singleSpaReact requires a configuration object`);
  if (!opts.RootComponent)
    throw new Error(`singleSpaReact must be passed opts.RootComponent`);
  if (typeof opts.errorBoundary !== 'function')
    throw new Error(
      `singleSpaReact must be passed opts.errorBoundary as a function that returns a ReactElement`,
    );
};

export const singleSpaReact = <RootComponentProps>({
  parcelCanUpdate,
  ...rest
}: SingleSpaReactOptions<RootComponentProps>): LifeCycles<RootComponentProps> => {
  validateOptions(rest);

  const config: SingleSpaReactConfig<RootComponentProps> = {
    ...rest,
    SingleSpaContext: (SingleSpaContext ??= createContext<
      SingleSpaContextValue | undefined
    >(undefined)),
    roots: new Map(),
    unmountFinished: () => {},
    updateResolves: new Map(),
  };

  return {
    bootstrap: async () => {}, // Do nothing
    mount: createMount(config),
    unmount: createUnmount(config),
    update: parcelCanUpdate ? createUpdate(config) : undefined,
  };
};

export default singleSpaReact;
