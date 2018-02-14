import {
  toggleEditDay,
  toggleEditRole,
  setSelectedData,
  defaultState,
  selectedDataReducer,
} from './redux';
import moment from 'moment';

describe('index', () => {
  describe('selectedDataReducer', () => {
    const initState = defaultState.meta.selectedData; // null
    const mockState = {
      day: moment('2018-02-13'),
      role: 'P&W',
      member: 'Jenny Hsu',
      names: ['Aaron Goh']
    };

    it('should have initial state', () => {
      const result = selectedDataReducer(undefined, { type: '...' });
      expect(result).toBe(initState);
    });

    it('should be updated by #setSelectedData', () => {
      const result = selectedDataReducer(initState, setSelectedData(mockState));
      expect(result).toEqual(mockState);
      expect(result).toHaveProperty('day');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('member');
      expect(result).toHaveProperty('names');
    });

    it('should be updated by toggleEditDay', () => {
      let result = selectedDataReducer(mockState, toggleEditDay(false));
      expect(result).toBeNull();

      result = selectedDataReducer(mockState, toggleEditDay(true));
      expect(result).toEqual(mockState);
    });

    it('should be updated by toggleEditRole', () => {
      let result = selectedDataReducer(mockState, toggleEditRole(false));
      expect(result).toBeNull();

      result = selectedDataReducer(mockState, toggleEditDay(true));
      expect(result).toEqual(mockState);
    });
  });
});
