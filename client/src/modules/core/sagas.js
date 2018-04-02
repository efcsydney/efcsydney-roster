import _ from 'lodash';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import {
  retrieveServices,
  retrieveServicesComplete,
  setMeta,
  switchCategory
} from './redux';
import ServicesAPI from 'apis/services';
import moment from 'moment';
import Cookies from 'js-cookie';
import 'moment/locale/en-au';
import 'moment/locale/zh-tw';
import i18n from 'i18n';

export default function* coreSagas() {
  yield takeEvery(retrieveServices.toString(), function*(action) {
    try {
      const data = yield call(ServicesAPI.retrieve);
      yield put(retrieveServicesComplete(data.data));
    } catch (error) {
      yield put(retrieveServicesComplete(error));
    }
  });

  yield takeEvery(switchCategory.toString(), function*({ payload }) {
    const state = yield select();
    const services = _.get(state, 'core.data.services', []);
    const selectedService = _.find(services, { name: payload });

    if (selectedService) {
      const { lang } = selectedService;
      moment.locale(lang);
      i18n.changeLanguage(lang);
      yield put(setMeta({ lang }));
    }

    Cookies.set('selectedService', payload);
    yield put(setMeta({ category: payload }));
  });
}
