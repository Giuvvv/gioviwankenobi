/**
 * The base path is the one thing production exercises in a shape localhost
 * never does. Serving from the domain root makes the base "/", where a missing
 * separator cannot show; serving from github.io/<repo>/ makes it
 * "/gioviwankenobi", where the same code shipped "/gioviwankenobiabout/" on
 * every link in the site. These cases are exactly the three shapes the build
 * actually runs in.
 *
 *   node --test --experimental-strip-types src/utils/paths.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { joinAsset, joinBase, normaliseBase } from './paths.ts';

test('normaliseBase gives every shape a trailing slash', () => {
  // What configure-pages reports for a project site.
  assert.equal(normaliseBase('/gioviwankenobi'), '/gioviwankenobi/');
  // Already normalised: must not gain a second slash.
  assert.equal(normaliseBase('/gioviwankenobi/'), '/gioviwankenobi/');
  // The custom domain.
  assert.equal(normaliseBase('/'), '/');
  // Defensive: a base with no leading slash, and an empty one.
  assert.equal(normaliseBase('gioviwankenobi'), '/gioviwankenobi/');
  assert.equal(normaliseBase(''), '/');
});

test('joinBase builds the same path under every base', () => {
  for (const base of ['/gioviwankenobi', '/gioviwankenobi/']) {
    assert.equal(joinBase(base), '/gioviwankenobi/');
    assert.equal(joinBase(base, 'about'), '/gioviwankenobi/about/');
    assert.equal(joinBase(base, '/apps', 'aspera'), '/gioviwankenobi/apps/aspera/');
  }

  assert.equal(joinBase('/'), '/');
  assert.equal(joinBase('/', 'about'), '/about/');
  assert.equal(joinBase('/', 'apps', 'aspera', 'it', 'privacy'), '/apps/aspera/it/privacy/');
});

test('joinBase ignores empty segments rather than doubling slashes', () => {
  assert.equal(joinBase('/', 'apps', undefined, 'aspera'), '/apps/aspera/');
  assert.equal(joinBase('/', '', null, 'about'), '/about/');
  // Segments arrive with slashes of their own from callers like url('/apps').
  assert.equal(joinBase('/gioviwankenobi', '/apps/', '/alba/'), '/gioviwankenobi/apps/alba/');
});

test('joinAsset keeps the extension and adds no trailing slash', () => {
  assert.equal(joinAsset('/', '/brand/favicon.svg'), '/brand/favicon.svg');
  assert.equal(
    joinAsset('/gioviwankenobi', '/brand/favicon.svg'),
    '/gioviwankenobi/brand/favicon.svg',
  );
  // The exact fault that shipped: base without a slash, path without one.
  assert.equal(
    joinAsset('/gioviwankenobi', 'sitemap-index.xml'),
    '/gioviwankenobi/sitemap-index.xml',
  );
});
