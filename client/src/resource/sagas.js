import _ from 'lodash';
import { takeEvery, call, put } from 'redux-saga/effects';
import { createAsyncAction } from './actions';
import { mapping as apiMapping } from 'apis';

export default function* requestSagas() {
  yield takeEvery(
    action => {
      return (
        action.resource &&
        action.resource.stage === 'start' &&
        apiMapping[action.resource.name]
      );
    },
    function*({ payload: params, meta = {}, resource }) {
      const API = _.get(apiMapping, [resource.name, resource.method]);
      const ajaxResponse = yield call(API, [params]);
      ajaxResponse.params = params;
      if (meta && meta.onComplete) {
        meta.onComplete();
      }

      const completeAction = createAsyncAction(
        resource.name,
        resource.method,
        'complete'
      );
      yield put(completeAction(ajaxResponse, meta));
    }
  );
}
