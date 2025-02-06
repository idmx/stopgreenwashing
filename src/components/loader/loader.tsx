import { FC } from 'react';
import cn from 'classnames';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import styles from './loader.module.css';

type LoaderSize = 'm' | 'l';

type LoaderProps = {
  size?: LoaderSize;
};

export const Loader: FC<LoaderProps> = ({ size = 'm' }) => {
  return (
    <AiOutlineLoading3Quarters className={cn(styles.loading, styles[size])} />
  );
};
