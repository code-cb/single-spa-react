import { LifeCycleFn } from 'single-spa';
import { getElementToRender } from './elementToRender';
import { SingleSpaReactConfig } from './types';

const appendResolve = (
  resolveList: VoidFunction[] | undefined = [],
  resolve: VoidFunction,
) => (resolveList.push(resolve), resolveList);

export const createUpdate =
  <RootComponentProps>(
    config: SingleSpaReactConfig<RootComponentProps>,
  ): LifeCycleFn<RootComponentProps> =>
  props =>
    new Promise<void>(resolve => {
      const { roots, updateResolves } = config;
      const { name } = props;
      updateResolves.set(
        name,
        appendResolve(updateResolves.get(name), resolve),
      );
      const elementToRender = getElementToRender(config, props, null);
      roots.get(name)?.render(elementToRender);
    });
