import _ from 'lodash';
import { takeLatest, call, put } from 'redux-saga/effects';
import { createAsyncAction } from './actions';
import { mapping as apiMapping } from 'apis';

const delay = ms => new Promise(res => setTimeout(res, ms));

export default function* resourceSagas() {
  yield takeLatest(
    action => {
      return (
        action.resource &&
        action.resource.stage === 'start' &&
        apiMapping[action.resource.name]
      );
    },
    function*({ payload: params, meta = {}, resource }) {
      const API = _.get(apiMapping, [resource.name, resource.method]);

      const completeAction = createAsyncAction(
        resource.name,
        resource.method,
        'complete'
      );

      try {
        const ajaxResponse = yield call(API, params);
        yield put(completeAction({ ...ajaxResponse, params }, meta));
      } catch (e) {
        yield put(completeAction(new Error(e)));
      }
    }
  );

  yield takeLatest(
    action => {
      return (
        action.resource &&
        action.resource.stage === 'complete' &&
        apiMapping[action.resource.name]
      );
    },
    function*({ payload, meta = {}, resource }) {
      const resetAction = createAsyncAction(
        resource.name,
        resource.method,
        'reset'
      );
      yield delay(500);
      yield put(resetAction(payload, meta));
    }
  );
}
