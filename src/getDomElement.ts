import { AppProps } from 'single-spa';
import { SingleSpaReactConfig } from './types';

const defaultDomElementGetter = ({ name }: AppProps) => {
  const domId = `single-spa-application:${name}`;
  let domElement = document.getElementById(domId);
  if (!domElement) {
    domElement = document.createElement('div');
    domElement.id = domId;
    document.body.appendChild(domElement);
  }
  return domElement;
};

export const chooseDomElementGetter = <RootComponentProps>({
  domElementGetter,
}: SingleSpaReactConfig<RootComponentProps>) =>
  domElementGetter ?? defaultDomElementGetter;
