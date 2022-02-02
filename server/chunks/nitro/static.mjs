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
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3c2e-PPH1eszQAUmg39f47m3Z0AYCom0\"",
    "mtime": "2022-02-02T17:03:38.578Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/0-f2c9c394.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-56BdpFGpcjR6NOVvm/+GFNBcjJc\"",
    "mtime": "2022-02-02T17:03:38.738Z",
    "path": "../public/_nuxt/0-f2c9c394.mjs"
  },
  "/_nuxt/1-0438dbea.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-xFvmrUNAaV8pf7LU1VO4og/a6xQ\"",
    "mtime": "2022-02-02T17:03:38.730Z",
    "path": "../public/_nuxt/1-0438dbea.mjs"
  },
  "/_nuxt/1-28a74997.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-geV9krY68PNMglfn6S1QEo0gNCo\"",
    "mtime": "2022-02-02T17:03:38.718Z",
    "path": "../public/_nuxt/1-28a74997.mjs"
  },
  "/_nuxt/1-312b3708.mjs": {
    "type": "application/javascript",
    "etag": "\"539-GkJr1yW7auuxf9oCPHlUI6IN4EM\"",
    "mtime": "2022-02-02T17:03:38.714Z",
    "path": "../public/_nuxt/1-312b3708.mjs"
  },
  "/_nuxt/1-3566ac97.mjs": {
    "type": "application/javascript",
    "etag": "\"44d-aUbOzelDAfAeX/qN8X6WQ8uLnqc\"",
    "mtime": "2022-02-02T17:03:38.710Z",
    "path": "../public/_nuxt/1-3566ac97.mjs"
  },
  "/_nuxt/1-464b069e.mjs": {
    "type": "application/javascript",
    "etag": "\"6ee-Pw1bSGeyLTY3QCWnC7Z+F9Qe9k4\"",
    "mtime": "2022-02-02T17:03:38.710Z",
    "path": "../public/_nuxt/1-464b069e.mjs"
  },
  "/_nuxt/1-6d556a10.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-9MAi8ds1jIEsuxajDI48dGuu7dc\"",
    "mtime": "2022-02-02T17:03:38.706Z",
    "path": "../public/_nuxt/1-6d556a10.mjs"
  },
  "/_nuxt/1-725e2c28.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-N4FcsTFA3CO8oSyLz+8nxu7g5bs\"",
    "mtime": "2022-02-02T17:03:38.702Z",
    "path": "../public/_nuxt/1-725e2c28.mjs"
  },
  "/_nuxt/1-d894b87b.mjs": {
    "type": "application/javascript",
    "etag": "\"537-34v6nAik6Vtn0U8zTMZbarglMFY\"",
    "mtime": "2022-02-02T17:03:38.698Z",
    "path": "../public/_nuxt/1-d894b87b.mjs"
  },
  "/_nuxt/2-04021b04.mjs": {
    "type": "application/javascript",
    "etag": "\"5df-xqsEIs4aQF9KsuW6xz1flbOdYwY\"",
    "mtime": "2022-02-02T17:03:38.698Z",
    "path": "../public/_nuxt/2-04021b04.mjs"
  },
  "/_nuxt/2-0cf38578.mjs": {
    "type": "application/javascript",
    "etag": "\"471-pUkxRX/taCRTnkxqaeoBPr78IMM\"",
    "mtime": "2022-02-02T17:03:38.694Z",
    "path": "../public/_nuxt/2-0cf38578.mjs"
  },
  "/_nuxt/2-2dd02344.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-9bC5uEDCgt5lZfad5BQPw5ndico\"",
    "mtime": "2022-02-02T17:03:38.690Z",
    "path": "../public/_nuxt/2-2dd02344.mjs"
  },
  "/_nuxt/2-3d038c9b.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-WozKTqey201VDccmdVLgDZSZrC8\"",
    "mtime": "2022-02-02T17:03:38.686Z",
    "path": "../public/_nuxt/2-3d038c9b.mjs"
  },
  "/_nuxt/2-591b450c.mjs": {
    "type": "application/javascript",
    "etag": "\"5e7-PgbTAcF1Lsot9PudWNMGt5uj2lI\"",
    "mtime": "2022-02-02T17:03:38.682Z",
    "path": "../public/_nuxt/2-591b450c.mjs"
  },
  "/_nuxt/2-5a7056b2.mjs": {
    "type": "application/javascript",
    "etag": "\"79c-kjIJp0MdnVEpJI+biqspvwDUZWw\"",
    "mtime": "2022-02-02T17:03:38.678Z",
    "path": "../public/_nuxt/2-5a7056b2.mjs"
  },
  "/_nuxt/2-6ba570f8.mjs": {
    "type": "application/javascript",
    "etag": "\"730-gBHw+B43WZBP57cV9a9/ZVxk7Qc\"",
    "mtime": "2022-02-02T17:03:38.674Z",
    "path": "../public/_nuxt/2-6ba570f8.mjs"
  },
  "/_nuxt/2-d5e14329.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-0D5kcISnINTKNXr3PHMh6qSsEfA\"",
    "mtime": "2022-02-02T17:03:38.670Z",
    "path": "../public/_nuxt/2-d5e14329.mjs"
  },
  "/_nuxt/3-0000d521.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-/mvm8SiTVBNApqqOmp56ZdRlH6w\"",
    "mtime": "2022-02-02T17:03:38.666Z",
    "path": "../public/_nuxt/3-0000d521.mjs"
  },
  "/_nuxt/3-08196d13.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-BzAjJj6NVIRJBN0AB/e4Nhx+h7o\"",
    "mtime": "2022-02-02T17:03:38.666Z",
    "path": "../public/_nuxt/3-08196d13.mjs"
  },
  "/_nuxt/3-4a0cc9dd.mjs": {
    "type": "application/javascript",
    "etag": "\"691-pgOMiQfH1tVUBdzYX3CfTrKt01g\"",
    "mtime": "2022-02-02T17:03:38.662Z",
    "path": "../public/_nuxt/3-4a0cc9dd.mjs"
  },
  "/_nuxt/3-855d6b9e.mjs": {
    "type": "application/javascript",
    "etag": "\"5f3-thUu0YyMw1eAMByu/FG1VE/kywg\"",
    "mtime": "2022-02-02T17:03:38.658Z",
    "path": "../public/_nuxt/3-855d6b9e.mjs"
  },
  "/_nuxt/3-d0a65563.mjs": {
    "type": "application/javascript",
    "etag": "\"7aa-eeIMORzABQgdWSMIJpWwAjAglGg\"",
    "mtime": "2022-02-02T17:03:38.654Z",
    "path": "../public/_nuxt/3-d0a65563.mjs"
  },
  "/_nuxt/3-f93b4792.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-+f0fnGKj59g/xQuSjkc33Tfcczs\"",
    "mtime": "2022-02-02T17:03:38.654Z",
    "path": "../public/_nuxt/3-f93b4792.mjs"
  },
  "/_nuxt/3-fb1c088f.mjs": {
    "type": "application/javascript",
    "etag": "\"480-VZd2o2MgZEQNTS2woV9Dgr3PAoI\"",
    "mtime": "2022-02-02T17:03:38.650Z",
    "path": "../public/_nuxt/3-fb1c088f.mjs"
  },
  "/_nuxt/4-112c310e.mjs": {
    "type": "application/javascript",
    "etag": "\"afe-rW8RtyBRImWfOO/+w+nNJj2lv6w\"",
    "mtime": "2022-02-02T17:03:38.650Z",
    "path": "../public/_nuxt/4-112c310e.mjs"
  },
  "/_nuxt/4-2e09d77f.mjs": {
    "type": "application/javascript",
    "etag": "\"838-9ShWLCxbKCSJQr+pxTLN6HuQfqU\"",
    "mtime": "2022-02-02T17:03:38.646Z",
    "path": "../public/_nuxt/4-2e09d77f.mjs"
  },
  "/_nuxt/4-5d78ee0e.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-kJTa33/5G5J8l3pWRqR9KSYWwUo\"",
    "mtime": "2022-02-02T17:03:38.646Z",
    "path": "../public/_nuxt/4-5d78ee0e.mjs"
  },
  "/_nuxt/4-b4c3d5e9.mjs": {
    "type": "application/javascript",
    "etag": "\"562-r+B+JIR2G6pHct8X+LgGI1tNHj0\"",
    "mtime": "2022-02-02T17:03:38.642Z",
    "path": "../public/_nuxt/4-b4c3d5e9.mjs"
  },
  "/_nuxt/4-cf22ad3d.mjs": {
    "type": "application/javascript",
    "etag": "\"784-HbYlfMenXxssLSjM9KcDWGXemV4\"",
    "mtime": "2022-02-02T17:03:38.642Z",
    "path": "../public/_nuxt/4-cf22ad3d.mjs"
  },
  "/_nuxt/4-e44c2479.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-N03ftIaIHlooVOoKAej8LN51VJg\"",
    "mtime": "2022-02-02T17:03:38.634Z",
    "path": "../public/_nuxt/4-e44c2479.mjs"
  },
  "/_nuxt/4-e6e90193.mjs": {
    "type": "application/javascript",
    "etag": "\"518-wBUksBmTSUYqaY9VAmU0RCpTouY\"",
    "mtime": "2022-02-02T17:03:38.630Z",
    "path": "../public/_nuxt/4-e6e90193.mjs"
  },
  "/_nuxt/5-0a4e0bd7.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-u/s+nA+J/MmdG2eTxwhesfLi0qY\"",
    "mtime": "2022-02-02T17:03:38.626Z",
    "path": "../public/_nuxt/5-0a4e0bd7.mjs"
  },
  "/_nuxt/5-5864c11e.mjs": {
    "type": "application/javascript",
    "etag": "\"8b1-Qp55v7xEZKNLNdLXY8SZlxtwa4k\"",
    "mtime": "2022-02-02T17:03:38.622Z",
    "path": "../public/_nuxt/5-5864c11e.mjs"
  },
  "/_nuxt/5-6dd18229.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-SxocgquYdPtqCe3GULOCMUkvu2U\"",
    "mtime": "2022-02-02T17:03:38.622Z",
    "path": "../public/_nuxt/5-6dd18229.mjs"
  },
  "/_nuxt/5-d5a96e26.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-Ru1aznHRXZ94WYVVHvun8JA/EGM\"",
    "mtime": "2022-02-02T17:03:38.622Z",
    "path": "../public/_nuxt/5-d5a96e26.mjs"
  },
  "/_nuxt/5-e85a001a.mjs": {
    "type": "application/javascript",
    "etag": "\"779-iqEFeRBbenvZuXqk3qpQeru/tsY\"",
    "mtime": "2022-02-02T17:03:38.614Z",
    "path": "../public/_nuxt/5-e85a001a.mjs"
  },
  "/_nuxt/5-ffc46697.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-iV5teEiQkSyMFwvQgCax2TcsKcs\"",
    "mtime": "2022-02-02T17:03:38.606Z",
    "path": "../public/_nuxt/5-ffc46697.mjs"
  },
  "/_nuxt/6-90872591.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-4C4ntSwiQPXIY0EVxMn0OVHkcKA\"",
    "mtime": "2022-02-02T17:03:38.606Z",
    "path": "../public/_nuxt/6-90872591.mjs"
  },
  "/_nuxt/6-9e374053.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-/GVzmm84wPt7Cw17GTDfijqMmEo\"",
    "mtime": "2022-02-02T17:03:38.602Z",
    "path": "../public/_nuxt/6-9e374053.mjs"
  },
  "/_nuxt/6-b1b1e8d2.mjs": {
    "type": "application/javascript",
    "etag": "\"652-WU/1xFbUgKld80TqyMtjqsFwrkU\"",
    "mtime": "2022-02-02T17:03:38.602Z",
    "path": "../public/_nuxt/6-b1b1e8d2.mjs"
  },
  "/_nuxt/6-b99014fe.mjs": {
    "type": "application/javascript",
    "etag": "\"818-cIldGMk35+4bAqryqeAhjIb9tWU\"",
    "mtime": "2022-02-02T17:03:38.598Z",
    "path": "../public/_nuxt/6-b99014fe.mjs"
  },
  "/_nuxt/6-bed7d965.mjs": {
    "type": "application/javascript",
    "etag": "\"916-ctydcSN3WtBF2E8MEaaQL2J/oao\"",
    "mtime": "2022-02-02T17:03:38.598Z",
    "path": "../public/_nuxt/6-bed7d965.mjs"
  },
  "/_nuxt/7-4435d6c2.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-IgRmOwtBQb8Wdl9H6RlmsHLn9Cw\"",
    "mtime": "2022-02-02T17:03:38.594Z",
    "path": "../public/_nuxt/7-4435d6c2.mjs"
  },
  "/_nuxt/7-c5a66587.mjs": {
    "type": "application/javascript",
    "etag": "\"859-5W8VBWhOh0rBiYAIcSzzJNkdn88\"",
    "mtime": "2022-02-02T17:03:38.594Z",
    "path": "../public/_nuxt/7-c5a66587.mjs"
  },
  "/_nuxt/7-d7916808.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-HryUe6xx2HxaGjRPUn3KGtT6X78\"",
    "mtime": "2022-02-02T17:03:38.594Z",
    "path": "../public/_nuxt/7-d7916808.mjs"
  },
  "/_nuxt/8-129af39c.mjs": {
    "type": "application/javascript",
    "etag": "\"692-XmpCljk1NvMbCYb72dvY08Fu3aw\"",
    "mtime": "2022-02-02T17:03:38.590Z",
    "path": "../public/_nuxt/8-129af39c.mjs"
  },
  "/_nuxt/8-f67c859a.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-6aUfwn8CJkGXTUtk9DyrJLlObaE\"",
    "mtime": "2022-02-02T17:03:38.586Z",
    "path": "../public/_nuxt/8-f67c859a.mjs"
  },
  "/_nuxt/9-23c7f8a4.mjs": {
    "type": "application/javascript",
    "etag": "\"435-M3106ulskinKNHQOejZ09xFCcyY\"",
    "mtime": "2022-02-02T17:03:38.586Z",
    "path": "../public/_nuxt/9-23c7f8a4.mjs"
  },
  "/_nuxt/bootstrap-8cb5578d.mjs": {
    "type": "application/javascript",
    "etag": "\"27f65-nhgi4uh36YT+qd8HUpLTxhlE2T0\"",
    "mtime": "2022-02-02T17:03:38.586Z",
    "path": "../public/_nuxt/bootstrap-8cb5578d.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-02-02T17:03:38.582Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-8daa1408.mjs": {
    "type": "application/javascript",
    "etag": "\"65-3yoV8D0QiV2vUZ4DEWSakU7Q40c\"",
    "mtime": "2022-02-02T17:03:38.582Z",
    "path": "../public/_nuxt/entry-8daa1408.mjs"
  },
  "/_nuxt/index-05b0da84.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-g4tZzIzbbNYL5P0rIyz0vW7FWTM\"",
    "mtime": "2022-02-02T17:03:38.582Z",
    "path": "../public/_nuxt/index-05b0da84.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"2b4b-d5tHSXF+6EAkXal8pOG8hpc2CMM\"",
    "mtime": "2022-02-02T17:03:38.582Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-0db33e6c.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-l26ReFttOKfK37IylZHsMAumgZw\"",
    "mtime": "2022-02-02T17:03:38.582Z",
    "path": "../public/_nuxt/welcome-0db33e6c.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643821413";
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
