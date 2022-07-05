import { LifeCycleFn } from 'single-spa';
import { SingleSpaReactConfig } from './types';

export const createUnmount =
  <RootComponentProps>(
    config: SingleSpaReactConfig<RootComponentProps>,
  ): LifeCycleFn<RootComponentProps> =>
  ({ name }) =>
    new Promise<void>(resolve => {
      config.unmountFinished = resolve;
      config.roots.get(name)?.unmount();
      config.roots.delete(name);
    });
