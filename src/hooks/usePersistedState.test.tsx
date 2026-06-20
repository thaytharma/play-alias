import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { usePersistedState } from './usePersistedState';

function Probe({ load, save }: { load: () => string; save: (value: string) => void }) {
  const [value, setValue] = usePersistedState(load, save);
  return (
    <button type="button" onClick={() => setValue('next')}>
      {value}
    </button>
  );
}

describe('usePersistedState', () => {
  it('loads the initial value once and persists every change', async () => {
    const load = vi.fn(() => 'initial');
    const save = vi.fn();
    render(<Probe load={load} save={save} />);

    // Loaded lazily once; saved once on mount with the loaded value.
    expect(screen.getByRole('button')).toHaveTextContent('initial');
    expect(load).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenLastCalledWith('initial');

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('next');
    expect(save).toHaveBeenLastCalledWith('next');
  });

  it('exposes a setter that updates the value', () => {
    let setter: (value: string) => void = () => {};
    function Capture() {
      const [value, setValue] = usePersistedState(
        () => 'a',
        () => {},
      );
      setter = setValue;
      return <span>{value}</span>;
    }
    render(<Capture />);

    act(() => setter('b'));

    expect(screen.getByText('b')).toBeInTheDocument();
  });
});
