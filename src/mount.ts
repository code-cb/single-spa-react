import { ReactElement } from 'react';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { LifeCycleFn } from 'single-spa';
import { getElementToRender } from './elementToRender';
import { chooseDomElementGetter } from './getDomElement';
import { DomHandlingType, SingleSpaReactConfig } from './types';

const domHandlingMap: Record<
  DomHandlingType,
  (elementToRender: ReactElement, domElement: HTMLElement) => Root
> = {
  createRoot: (elementToRender, domElement) => {
    const root = createRoot(domElement);
    root.render(elementToRender);
    return root;
  },
  hydrateRoot: (elementToRender, domElement) =>
    hydrateRoot(domElement, elementToRender),
};

const handleDom = (
  { domHandlingType }: SingleSpaReactConfig<any>,
  elementToRender: ReactElement,
  domElement: HTMLElement,
) => {
  const handlingType =
    typeof domHandlingType === 'function'
      ? domHandlingType()
      : domHandlingType ?? 'createRoot';
  return domHandlingMap[handlingType](elementToRender, domElement);
};

export const createMount =
  <RootComponentProps>(
    config: SingleSpaReactConfig<RootComponentProps>,
  ): LifeCycleFn<RootComponentProps> =>
  props =>
    new Promise<void>(resolve => {
      const elementToRender = getElementToRender(config, props, resolve);
      const domElement = chooseDomElementGetter(config)(props);
      const root = handleDom(config, elementToRender, domElement);
      config.roots.set(props.name, root);
    });
