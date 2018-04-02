import { all, call } from 'redux-saga/effects';
import coreSagas from 'modules/core/sagas';

export default function* rootSaga() {
  yield all([call(coreSagas)]);
}
