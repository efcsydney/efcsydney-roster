import _ from 'lodash';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import {
  retrieveServices,
  retrieveServicesComplete,
  setMeta,
  switchCategory
} from './redux';
import ServicesAPI from 'apis/services';
import Cookies from 'js-cookie';
import moment from 'moment';
import 'moment/locale/en-au';
import 'moment/locale/zh-tw';
import i18n from 'i18n';

export default function* coreSagas() {
  yield takeEvery(retrieveServices.toString(), function*() {
    try {
      const data = yield call(ServicesAPI.retrieve);
      const services = data.data;
      yield put(retrieveServicesComplete(services));

      const state = yield select();
      const category = _.get(state, 'core.meta.category');
      const selectedService = _.find(services, { name: category });

      if (selectedService) {
        const { locale } = selectedService;
        moment.locale(locale);
        i18n.changeLanguage(locale);
        yield put(setMeta({ lang: locale }));
      }
    } catch (error) {
      yield put(retrieveServicesComplete(error));
    }
  });

  yield takeEvery(switchCategory.toString(), function*({ payload }) {
    const state = yield select();
    const services = _.get(state, 'core.data.services', []);
    const selectedService = _.find(services, { name: payload });

    if (selectedService) {
      const { locale } = selectedService;
      moment.locale(locale);
      i18n.changeLanguage(locale);

      console.log(locale);

      yield put(setMeta({ lang: locale }));
    }

    Cookies.set('selectedService', payload);
    yield put(setMeta({ category: payload }));
  });
}
