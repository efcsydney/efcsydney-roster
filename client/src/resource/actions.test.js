import _ from 'lodash';
import { createAsyncAction, createApiActions } from './actions';

describe('Factory for action creators', () => {
  describe('#createApiActions', () => {
    it('should create 12 actions', () => {
      const actions = createApiActions('foo');
      expect(_.size(actions)).toBe(12);
      expect(actions).toHaveProperty('createFoo');
      expect(actions).toHaveProperty('createFooComplete');
      expect(actions).toHaveProperty('createFooReset');
      expect(actions).toHaveProperty('deleteFoo');
      expect(actions).toHaveProperty('deleteFooComplete');
      expect(actions).toHaveProperty('deleteFooReset');
      expect(actions).toHaveProperty('modifyFoo');
      expect(actions).toHaveProperty('modifyFooComplete');
      expect(actions).toHaveProperty('modifyFooReset');
      expect(actions).toHaveProperty('retrieveFoo');
      expect(actions).toHaveProperty('retrieveFooComplete');
      expect(actions).toHaveProperty('retrieveFooReset');
    });
  });

  describe('#createAsyncAction', () => {
    it('should create an action creator with corresponded function name', () => {
      const actionCreator1 = createAsyncAction('foo', 'retrieve');
      expect(actionCreator1.toString()).toBe('RETRIEVE_FOO');

      const actionCreator2 = createAsyncAction('foo', 'retrieve', 'stage');
      expect(actionCreator2.toString()).toBe('RETRIEVE_FOO_STAGE');
    });

    it('should return an action object when executing the created action creator', () => {
      const actionCreator = createAsyncAction('name', 'method');
      const action = actionCreator('payload', 'meta');
      expect(action).toEqual({
        type: 'METHOD_NAME',
        payload: 'payload',
        meta: 'meta',
        resource: {
          name: 'name',
          method: 'method',
          stage: 'start'
        }
      });
    });
  });
});
