import { createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';
import { c as buildAssetsDir } from './server.mjs';
import 'unenv/runtime/polyfill/fetch.node';
import 'http';
import 'https';
import 'destr';
import 'ohmyfetch';
import 'unenv/runtime/fetch/index';
import 'defu';

const assets = {
  "/_nuxt/0-aacac7bd.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-vUtyhQlNJomBI705YqAL9Xg6bUU\"",
    "mtime": "2022-01-30T08:46:54.188Z",
    "path": "../public/_nuxt/0-aacac7bd.mjs"
  },
  "/_nuxt/1-453197be.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-cTyMUXedm+Cy9qlbmLiE1TjJnZY\"",
    "mtime": "2022-01-30T08:46:54.184Z",
    "path": "../public/_nuxt/1-453197be.mjs"
  },
  "/_nuxt/1-559f6642.mjs": {
    "type": "application/javascript",
    "etag": "\"449-dvGpt0FAg/B/F75K4mzBg0cjqhI\"",
    "mtime": "2022-01-30T08:46:54.184Z",
    "path": "../public/_nuxt/1-559f6642.mjs"
  },
  "/_nuxt/1-bd232cff.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-uPOqyAKHMKx1JbLyEeEZa0tOzTM\"",
    "mtime": "2022-01-30T08:46:54.180Z",
    "path": "../public/_nuxt/1-bd232cff.mjs"
  },
  "/_nuxt/2-36abec05.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-yTmiM0aQxrf/Y9lH4zkTW0JAnKk\"",
    "mtime": "2022-01-30T08:46:54.180Z",
    "path": "../public/_nuxt/2-36abec05.mjs"
  },
  "/_nuxt/2-639ec8d4.mjs": {
    "type": "application/javascript",
    "etag": "\"471-u7lWz53/QASjoRy4w+m6IpR7BPQ\"",
    "mtime": "2022-01-30T08:46:54.180Z",
    "path": "../public/_nuxt/2-639ec8d4.mjs"
  },
  "/_nuxt/3-ba7a5fef.mjs": {
    "type": "application/javascript",
    "etag": "\"480-/qrB4s0achoZwbhq8zt9ZzNaWTY\"",
    "mtime": "2022-01-30T08:46:54.176Z",
    "path": "../public/_nuxt/3-ba7a5fef.mjs"
  },
  "/_nuxt/4-b3242dae.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-Vq/ADEAgp522aV4voQiTNb88/DI\"",
    "mtime": "2022-01-30T08:46:54.176Z",
    "path": "../public/_nuxt/4-b3242dae.mjs"
  },
  "/_nuxt/5-5b65c3ea.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-UmfNb9FQYXcRil8XU4YC4h0Tfu4\"",
    "mtime": "2022-01-30T08:46:54.176Z",
    "path": "../public/_nuxt/5-5b65c3ea.mjs"
  },
  "/_nuxt/6-7a1ef387.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-GnBcbP5AAqKVVo79Wu88z9Bg22s\"",
    "mtime": "2022-01-30T08:46:54.176Z",
    "path": "../public/_nuxt/6-7a1ef387.mjs"
  },
  "/_nuxt/7-0a77928f.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-X7UZvpi0lMzVxiFnZdG00FdX1L8\"",
    "mtime": "2022-01-30T08:46:54.172Z",
    "path": "../public/_nuxt/7-0a77928f.mjs"
  },
  "/_nuxt/8-1dd5b4d8.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-HXWnFQ6vDuL9kv9HYgthzvgJM5c\"",
    "mtime": "2022-01-30T08:46:54.172Z",
    "path": "../public/_nuxt/8-1dd5b4d8.mjs"
  },
  "/_nuxt/9-728cac6b.mjs": {
    "type": "application/javascript",
    "etag": "\"435-lhBbKGiDydcxqmyWbaL0GlZo50M\"",
    "mtime": "2022-01-30T08:46:54.172Z",
    "path": "../public/_nuxt/9-728cac6b.mjs"
  },
  "/_nuxt/bootstrap-ab28dcca.mjs": {
    "type": "application/javascript",
    "etag": "\"1d3c4-RqtYAlmyPuEu83qCr09ySY5Vd/k\"",
    "mtime": "2022-01-30T08:46:54.168Z",
    "path": "../public/_nuxt/bootstrap-ab28dcca.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-01-30T08:46:54.168Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-d89554df.mjs": {
    "type": "application/javascript",
    "etag": "\"65-XqsLww3M5MTHFTyqR+hDIiQh39Q\"",
    "mtime": "2022-01-30T08:46:54.168Z",
    "path": "../public/_nuxt/entry-d89554df.mjs"
  },
  "/_nuxt/index-d331179d.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-WJgJwwcr1LphajcnEvVvmuFRF7I\"",
    "mtime": "2022-01-30T08:46:54.168Z",
    "path": "../public/_nuxt/index-d331179d.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"e09-q0DpeU82aqUdE8BeyxBl3syEQ6k\"",
    "mtime": "2022-01-30T08:46:54.168Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-ae0e2676.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-y9g0q6T0rlI8M6lpZuCmLVR/ts4\"",
    "mtime": "2022-01-30T08:46:54.168Z",
    "path": "../public/_nuxt/welcome-ae0e2676.mjs"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));

function readAsset (id) {
  return promises.readFile(resolve(mainDir, getAsset(id).path))
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const TWO_DAYS = 2 * 60 * 60 * 24;
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643532411";
async function serveStatic(req, res) {
  if (!METHODS.includes(req.method)) {
    return;
  }
  let id = withLeadingSlash(withoutTrailingSlash(parseURL(req.url).pathname));
  let asset = getAsset(id);
  if (!asset) {
    const _id = id + "/index.html";
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
    }
  }
  const isBuildAsset = id.startsWith(buildAssetsDir());
  if (!asset) {
    if (isBuildAsset && !id.startsWith(STATIC_ASSETS_BASE)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    res.statusCode = 304;
    return res.end("Not Modified (etag)");
  }
  const ifModifiedSinceH = req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      res.statusCode = 304;
      return res.end("Not Modified (mtime)");
    }
  }
  if (asset.type) {
    res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    res.setHeader("Last-Modified", asset.mtime);
  }
  if (isBuildAsset) {
    res.setHeader("Cache-Control", `max-age=${TWO_DAYS}, immutable`);
  }
  const contents = await readAsset(id);
  return res.end(contents);
}

export { serveStatic as default };
