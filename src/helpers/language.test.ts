import { Language } from '../types/Language';
import { isEnglish, isFrench, isNorwegian } from './language';

describe('language helpers', () => {
  it('identifies French only for Language.FR', () => {
    expect(isFrench(Language.FR)).toBe(true);
    expect(isFrench(Language.EN)).toBe(false);
    expect(isFrench(Language.NO)).toBe(false);
  });

  it('keeps the existing English and Norwegian checks intact', () => {
    expect(isEnglish(Language.EN)).toBe(true);
    expect(isEnglish(Language.FR)).toBe(false);
    expect(isNorwegian(Language.NO)).toBe(true);
    expect(isNorwegian(Language.FR)).toBe(false);
  });
});
