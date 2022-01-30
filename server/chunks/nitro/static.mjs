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
  "/_nuxt/0-cf340efd.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-f6FexfzsCTLEt+Oy7Db43IMeL70\"",
    "mtime": "2022-01-30T11:59:15.502Z",
    "path": "../public/_nuxt/0-cf340efd.mjs"
  },
  "/_nuxt/1-1193d1d2.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-7YMUYgdYjgmwc6GQUj7D3WE7/hw\"",
    "mtime": "2022-01-30T11:59:15.498Z",
    "path": "../public/_nuxt/1-1193d1d2.mjs"
  },
  "/_nuxt/1-2c3d23b3.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-1+Y2c7ArQt0D/AcOCfv5kuW9X6o\"",
    "mtime": "2022-01-30T11:59:15.494Z",
    "path": "../public/_nuxt/1-2c3d23b3.mjs"
  },
  "/_nuxt/1-9cba1744.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-CxBIpw3DYDGdZFPAiFvz6hK3Oaw\"",
    "mtime": "2022-01-30T11:59:15.486Z",
    "path": "../public/_nuxt/1-9cba1744.mjs"
  },
  "/_nuxt/1-9e29d2f0.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-CkeVqDiKgWla3NpedBjbcjJ01eI\"",
    "mtime": "2022-01-30T11:59:15.482Z",
    "path": "../public/_nuxt/1-9e29d2f0.mjs"
  },
  "/_nuxt/2-09277723.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-Rgf5hJa2zbHOPotz+flMni+pvcg\"",
    "mtime": "2022-01-30T11:59:15.482Z",
    "path": "../public/_nuxt/2-09277723.mjs"
  },
  "/_nuxt/2-3fee9fa6.mjs": {
    "type": "application/javascript",
    "etag": "\"471-xYCoPMJWO6wesqregQsa3xWhdms\"",
    "mtime": "2022-01-30T11:59:15.470Z",
    "path": "../public/_nuxt/2-3fee9fa6.mjs"
  },
  "/_nuxt/2-4d8d31f4.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-yIrmqxX0+4BPiGbXVoOl6bZWjYI\"",
    "mtime": "2022-01-30T11:59:15.462Z",
    "path": "../public/_nuxt/2-4d8d31f4.mjs"
  },
  "/_nuxt/2-d42b1c0a.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-dqvYkxMo5jafaSyvTCUhXZ4J0gc\"",
    "mtime": "2022-01-30T11:59:15.462Z",
    "path": "../public/_nuxt/2-d42b1c0a.mjs"
  },
  "/_nuxt/3-8aedcd5e.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-oiZSFVG3s+Wn7R5fweglyuzQ/G4\"",
    "mtime": "2022-01-30T11:59:15.458Z",
    "path": "../public/_nuxt/3-8aedcd5e.mjs"
  },
  "/_nuxt/3-ad753609.mjs": {
    "type": "application/javascript",
    "etag": "\"480-dRHvfmCie9bC+do+67/0ZP7SIhs\"",
    "mtime": "2022-01-30T11:59:15.454Z",
    "path": "../public/_nuxt/3-ad753609.mjs"
  },
  "/_nuxt/3-f6fc8894.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-DT4GcZUT6+lMfH6gFmRRP9X8Ns0\"",
    "mtime": "2022-01-30T11:59:15.446Z",
    "path": "../public/_nuxt/3-f6fc8894.mjs"
  },
  "/_nuxt/4-3e6ef44a.mjs": {
    "type": "application/javascript",
    "etag": "\"562-kOohsbkxN6OkuBG34sE2zHSE1Ts\"",
    "mtime": "2022-01-30T11:59:15.438Z",
    "path": "../public/_nuxt/4-3e6ef44a.mjs"
  },
  "/_nuxt/4-6d025adc.mjs": {
    "type": "application/javascript",
    "etag": "\"518-+FUzsyIMJ/X5t3yuHnTgNdF6OPk\"",
    "mtime": "2022-01-30T11:59:15.438Z",
    "path": "../public/_nuxt/4-6d025adc.mjs"
  },
  "/_nuxt/4-7537cd63.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-W1QlJFj5qXrptPdvRfcanFgTvu8\"",
    "mtime": "2022-01-30T11:59:15.434Z",
    "path": "../public/_nuxt/4-7537cd63.mjs"
  },
  "/_nuxt/5-9099ad52.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-RRsFuwlROCR4fTh+Q4f3CTDOK8A\"",
    "mtime": "2022-01-30T11:59:15.430Z",
    "path": "../public/_nuxt/5-9099ad52.mjs"
  },
  "/_nuxt/5-e6a4fee8.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-SwP5txeyz9db8w8LrCCjG9T1bFA\"",
    "mtime": "2022-01-30T11:59:15.430Z",
    "path": "../public/_nuxt/5-e6a4fee8.mjs"
  },
  "/_nuxt/5-fd2a6454.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-4OLXq7cPd9858euHTWgFBYlux14\"",
    "mtime": "2022-01-30T11:59:15.426Z",
    "path": "../public/_nuxt/5-fd2a6454.mjs"
  },
  "/_nuxt/6-5d2831e0.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-0r5Q61lBHfks+qKG2VR+Fq8PgCc\"",
    "mtime": "2022-01-30T11:59:15.418Z",
    "path": "../public/_nuxt/6-5d2831e0.mjs"
  },
  "/_nuxt/6-74de633f.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-T5C8CTgTd7tbaXWgwM0uVZvvZqI\"",
    "mtime": "2022-01-30T11:59:15.418Z",
    "path": "../public/_nuxt/6-74de633f.mjs"
  },
  "/_nuxt/7-21409614.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-BUNOs7zyTlwdrRXOFoaaGi/wzFE\"",
    "mtime": "2022-01-30T11:59:15.414Z",
    "path": "../public/_nuxt/7-21409614.mjs"
  },
  "/_nuxt/7-5c0490be.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-/AcHyHJCpvHoEgRRzpUhNdCCZOw\"",
    "mtime": "2022-01-30T11:59:15.414Z",
    "path": "../public/_nuxt/7-5c0490be.mjs"
  },
  "/_nuxt/8-95351b0a.mjs": {
    "type": "application/javascript",
    "etag": "\"692-HsNCeNpR2Bvy8aNN0Y3bBgDg2O0\"",
    "mtime": "2022-01-30T11:59:15.410Z",
    "path": "../public/_nuxt/8-95351b0a.mjs"
  },
  "/_nuxt/8-d4d9cd09.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-Wm/WJAQ6NAewgOeTgba/qLEdbyQ\"",
    "mtime": "2022-01-30T11:59:15.410Z",
    "path": "../public/_nuxt/8-d4d9cd09.mjs"
  },
  "/_nuxt/9-010ae69b.mjs": {
    "type": "application/javascript",
    "etag": "\"435-F6I+e1UyG+GCw1nWuMLf6kFkcIo\"",
    "mtime": "2022-01-30T11:59:15.410Z",
    "path": "../public/_nuxt/9-010ae69b.mjs"
  },
  "/_nuxt/bootstrap-86595c19.mjs": {
    "type": "application/javascript",
    "etag": "\"203ae-mQKj6adU5QyjgYI/jL+VLY1yE1Y\"",
    "mtime": "2022-01-30T11:59:15.406Z",
    "path": "../public/_nuxt/bootstrap-86595c19.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-01-30T11:59:15.406Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-f9e38997.mjs": {
    "type": "application/javascript",
    "etag": "\"65-haCYnMgo8YYwm+uRCbgW1Y4vMHI\"",
    "mtime": "2022-01-30T11:59:15.406Z",
    "path": "../public/_nuxt/entry-f9e38997.mjs"
  },
  "/_nuxt/index-405fb460.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-j/qz7Rqy5vnXrJKEEkOxibtqwVA\"",
    "mtime": "2022-01-30T11:59:15.402Z",
    "path": "../public/_nuxt/index-405fb460.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1811-wI1GkjDLs91NtnoGDT7VGxzF8bo\"",
    "mtime": "2022-01-30T11:59:15.402Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-044c198c.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-7qe8wvDf0jA5b7Ox8ohdP2GLTkc\"",
    "mtime": "2022-01-30T11:59:15.402Z",
    "path": "../public/_nuxt/welcome-044c198c.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643543950";
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
