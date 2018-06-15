import _ from 'lodash';
import { takeEvery, put, select } from 'redux-saga/effects';
import { setMeta, switchCategory } from './redux';
import { createApiActions } from 'resource';
import Cookies from 'js-cookie';
import moment from 'moment';
import 'moment/locale/en-au';
import 'moment/locale/zh-tw';
import i18n from 'i18n';
const { retrieveServicesComplete } = createApiActions('services');

function* setLocale(locale) {
  moment.locale(locale);
  i18n.changeLanguage(locale);
  yield put(setMeta({ lang: locale }));
}

export default function* coreSagas() {
  yield setLocale('en-AU');
  yield takeEvery(retrieveServicesComplete.toString(), function*({ payload }) {
    const services = payload.data;
    const state = yield select();
    const category = _.get(state, 'core.meta.category');
    const selectedService = _.find(services, { name: category });
    if (selectedService) {
      const locale = selectedService.locale;
      yield setLocale(locale);
    }
  });

  yield takeEvery(switchCategory.toString(), function*({ payload }) {
    const state = yield select();
    const services = _.get(state, 'resource.data.services', {});
    const selectedService = _.find(services, { name: payload });

    if (selectedService) {
      const { locale } = selectedService;
      yield setLocale(locale);
    }

    Cookies.set('selectedService', payload);
    yield put(setMeta({ category: payload }));
  });
}
