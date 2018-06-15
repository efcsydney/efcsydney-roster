import _ from 'lodash';
import { defaultSingleResourceState, asyncStatusReducer } from './reducer';
import { createApiActions } from './actions';

const {
  createServices,
  createServicesComplete,
  createServicesReset,
  deleteServices,
  deleteServicesComplete,
  deleteServicesReset,
  modifyServices,
  modifyServicesComplete,
  modifyServicesReset,
  retrieveServices,
  retrieveServicesComplete,
  retrieveServicesReset
} = createApiActions('services');

describe('#asyncStatusReducer', () => {
  const defaultState = {
    services: defaultSingleResourceState
  };

  it('should have default state', () => {
    const action = { type: 'UNMATCHED_ACTION' };
    const state = asyncStatusReducer(defaultState, action);
    expect(state).toHaveProperty('services');
  });

  describe('#create', () => {
    it('should set isLoading when #createService', () => {
      const state = asyncStatusReducer(defaultState, createServices());
      const result = _.get(state, 'services.create', {});
      expect(result.isLoading).toBeTruthy();
    });

    it('should reset isLoading and set completedIds when #createServiceComplete', () => {
      const state = asyncStatusReducer(
        defaultState,
        createServicesComplete({ data: { id: 1 } })
      );
      const result = _.get(state, 'services.create', {});
      expect(result.isLoading).toBeFalsy();
      expect(result.completedIds['1']).toBeTruthy();
    });

    it('should reset completeIds when #createServiceReset', () => {
      const state = asyncStatusReducer(
        defaultState,
        createServicesReset({ data: { id: 1 } })
      );
      const result = _.get(state, 'services.create.1');
      expect(result).toBeUndefined();
    });
  });

  describe('#delete', () => {
    it('should set isLoading/loadingIds when #deleteService', () => {
      const state = asyncStatusReducer(defaultState, deleteServices({ id: 1 }));
      const result = _.get(state, 'services.delete', {});
      expect(result.isLoading).toBeTruthy();
      expect(result.loadingIds).toHaveProperty('1');
    });

    it('should reset isLoading/loadingIds and set completedIds when #deleteServiceComplete', () => {
      const state = asyncStatusReducer(
        defaultState,
        deleteServicesComplete({ data: { id: 1 } })
      );
      const result = _.get(state, 'services.delete', {});
      expect(result.isLoading).toBeFalsy();
      expect(result.completedIds['1']).toBeTruthy();
      expect(result.loadingIds).toEqual({});
    });

    it('should reset completeIds when #deleteServiceReset', () => {
      const state = asyncStatusReducer(
        defaultState,
        deleteServicesReset({ data: { id: 1 } })
      );
      const result = _.get(state, 'services.delete.1');
      expect(result).toBeUndefined();
    });
  });

  describe('#modify', () => {
    it('should set isLoading and loadingIs when #modifyService', () => {
      const state = asyncStatusReducer(defaultState, modifyServices({ id: 1 }));
      const result = _.get(state, 'services.modify', {});
      expect(result.isLoading).toBeTruthy();
      expect(result.loadingIds).toHaveProperty('1');
    });

    it('should reset isLoading/loadingIds and set completedIds when #modifyServiceComplete', () => {
      const state = asyncStatusReducer(
        defaultState,
        modifyServicesComplete({ data: { id: 1 } })
      );
      const result = _.get(state, 'services.modify', {});
      expect(result.isLoading).toBeFalsy();
      expect(result.loadingIds).toEqual({});
      expect(result.completedIds['1']).toBeTruthy();
    });

    it('should reset completeIds when #modifyServiceReset', () => {
      const state = asyncStatusReducer(
        defaultState,
        modifyServicesReset({ data: { id: 1 } })
      );
      const result = _.get(state, 'services.modify.1');
      expect(result).toBeUndefined();
    });
  });

  describe('#retrieve', () => {
    it('should set isLoading when #retriveService', () => {
      const nextState = asyncStatusReducer(defaultState, retrieveServices());
      const isLoading = _.get(nextState, 'services.retrieve.isLoading');
      expect(isLoading).toBeTruthy();
    });

    it('should reset isLoading and set hasInitialized when #retrieveServiceComplete', () => {
      const state = asyncStatusReducer(
        defaultState,
        retrieveServicesComplete({ data: [] })
      );
      const isLoading = _.get(state, 'services.retrieve.isLoading');
      const hasInitialized = _.get(state, 'services.retrieve.hasInitialized');
      expect(isLoading).toBeFalsy();
      expect(hasInitialized).toBeTruthy();
    });

    it('should do nothing when #retrieveServicesReset', () => {
      const state = asyncStatusReducer(defaultState, retrieveServicesReset());
      const result = _.get(state, 'services.retrieve');
      expect(result).toEqual({
        hasInitialized: false,
        isLoading: false
      });
    });
  });
});
