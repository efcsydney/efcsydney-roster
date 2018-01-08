/* global describe, expect, it */
import { buildQuery, sanitize } from './utils';

describe('utils', () => {
  describe('#sanitize', () => {
    it('should remove the properties of undefined, null, or empty string values', () => {
      const query = { a: undefined, b: null, c: 0, d: '' };
      const expected = { c: 0 };
      expect(sanitize(query)).toEqual(expected);
    });
  });

  describe('#buildQuery', () => {
    it('should build a query string from an object', () => {
      let query = { a: 1, b: '0', c: 'hello' };
      let expected = 'a=1&b=0&c=hello';
      expect(buildQuery(query)).toEqual(expected);
    });

    it('should build a query string from an object without falsy items except 0', () => {
      let query = { a: '', b: null, c: undefined, d: 'hello' };
      let expected = 'd=hello';
      expect(buildQuery(query)).toEqual(expected);
    });
  });

  describe('#findEvent', () => {});
  describe('#getCalData', () => {});
  describe('#getQuarterDays', () => {});
  describe('#getQueryParams', () => {});
  describe('#getRoles', () => {});
  describe('#getQuarterFirstMonth', () => {});
  describe('#getQuarterLastMonth', () => {});
  describe('#getMemberNames', () => {});
});
