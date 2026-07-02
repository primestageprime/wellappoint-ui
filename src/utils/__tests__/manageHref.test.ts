import { test } from 'node:test';
import assert from 'node:assert';
import { manageHref } from '../manageHref.ts';

test('returns the manage path for a token', () => {
  assert.equal(manageHref('abc.def.ghi'), '/manage/abc.def.ghi');
});

test('returns undefined when token is absent', () => {
  assert.equal(manageHref(undefined), undefined);
});

test('returns undefined for an empty token', () => {
  assert.equal(manageHref(''), undefined);
});

test('URL-encodes unexpected characters', () => {
  assert.equal(manageHref('a/b'), '/manage/a%2Fb');
});
