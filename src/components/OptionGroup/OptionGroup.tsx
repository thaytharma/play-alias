import classNames from 'classnames';
import styles from './OptionGroup.module.scss';

interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A labelled segmented control: a row of pill buttons with one active option.
 * Used for every settings row (language, timer, and future options) so they
 * stay visually consistent. */
function OptionGroup<T extends string | number>({ label, options, value, onChange }: Props<T>) {
  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      <div className={styles.options} role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={classNames(styles.option, { [styles.active]: option.value === value })}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OptionGroup;
