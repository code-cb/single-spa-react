import { FC, useEffect } from 'react';
import { SingleSpaRootProps } from './types';

export const SingleSpaRoot: FC<SingleSpaRootProps> = ({
  children,
  mountFinished,
  unmountFinished,
  updateFinished,
}) => {
  useEffect(() => {
    setTimeout(mountFinished);
    return () => {
      setTimeout(unmountFinished);
    };
  }, []);
  setTimeout(updateFinished);
  return <>{children}</>;
};
