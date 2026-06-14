import classnames from 'classnames';
import React from 'react';
import { isFrench, isNorwegian } from '../../helpers/language';
import { Language } from '../../types/Language';
import AmericanFlag from './flags/AmericanFlag';
import FrenchFlag from './flags/FrenchFlag';
import NorwegianFlag from './flags/NorwegianFlag';
import styles from './Flag.module.scss';

interface Props {
  language: Language;
  isCurrent: boolean;
}

const Flag: React.FC<Props> = ({ language, isCurrent }: Props) => {
  const className = classnames(styles.flag, {
    [styles.current]: isCurrent,
  });

  if (isNorwegian(language)) {
    return <NorwegianFlag className={className} />;
  }

  if (isFrench(language)) {
    return <FrenchFlag className={className} />;
  }

  return <AmericanFlag className={className} />;
};

export default Flag;
