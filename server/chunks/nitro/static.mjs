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
  "/_nuxt/0-0f97209b.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-Z59Q/SySQCDc02GkEJsJzj5d2KQ\"",
    "mtime": "2022-01-30T12:36:58.356Z",
    "path": "../public/_nuxt/0-0f97209b.mjs"
  },
  "/_nuxt/1-30c681f4.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-m8zdoYp4k+/VEQRuVBcm351CB8o\"",
    "mtime": "2022-01-30T12:36:58.352Z",
    "path": "../public/_nuxt/1-30c681f4.mjs"
  },
  "/_nuxt/1-5e85e7eb.mjs": {
    "type": "application/javascript",
    "etag": "\"452-yEOovzuSzNctpZCoQmdhbDQtXVQ\"",
    "mtime": "2022-01-30T12:36:58.352Z",
    "path": "../public/_nuxt/1-5e85e7eb.mjs"
  },
  "/_nuxt/1-716ce000.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-qPllYRwSl9TauRZv9zTN+Br6MXk\"",
    "mtime": "2022-01-30T12:36:58.348Z",
    "path": "../public/_nuxt/1-716ce000.mjs"
  },
  "/_nuxt/1-9d1fa91c.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-6I+o8tEdjhGua0CzTinQmdvJ0Qk\"",
    "mtime": "2022-01-30T12:36:58.348Z",
    "path": "../public/_nuxt/1-9d1fa91c.mjs"
  },
  "/_nuxt/1-a21a13e5.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-czAp9GkBl5we0XxU6zxfCzxl864\"",
    "mtime": "2022-01-30T12:36:58.344Z",
    "path": "../public/_nuxt/1-a21a13e5.mjs"
  },
  "/_nuxt/2-04e25dda.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-yPBIszjOcUbcvZR1cWt2FlD0XCU\"",
    "mtime": "2022-01-30T12:36:58.336Z",
    "path": "../public/_nuxt/2-04e25dda.mjs"
  },
  "/_nuxt/2-063976c3.mjs": {
    "type": "application/javascript",
    "etag": "\"471-tmMaaFsG0g5D48k1/87hZbLKhHU\"",
    "mtime": "2022-01-30T12:36:58.332Z",
    "path": "../public/_nuxt/2-063976c3.mjs"
  },
  "/_nuxt/2-a641a7b6.mjs": {
    "type": "application/javascript",
    "etag": "\"730-HC65qo31kBRMnWJAIi65Kd/P0o0\"",
    "mtime": "2022-01-30T12:36:58.320Z",
    "path": "../public/_nuxt/2-a641a7b6.mjs"
  },
  "/_nuxt/2-d98f5f72.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-A77pZ26+3+LLsjTkUZBHaNIHOlQ\"",
    "mtime": "2022-01-30T12:36:58.320Z",
    "path": "../public/_nuxt/2-d98f5f72.mjs"
  },
  "/_nuxt/2-f33efed3.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-3LQcmYbug0bOc4kVAAIhCPAHCx8\"",
    "mtime": "2022-01-30T12:36:58.316Z",
    "path": "../public/_nuxt/2-f33efed3.mjs"
  },
  "/_nuxt/3-1167e408.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-NLfbuW/Y7oUny7qc1MgkyyzJXuI\"",
    "mtime": "2022-01-30T12:36:58.312Z",
    "path": "../public/_nuxt/3-1167e408.mjs"
  },
  "/_nuxt/3-24f5cf30.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-V7zX5v9j8gC5FDEq0b+c09gQ1ys\"",
    "mtime": "2022-01-30T12:36:58.300Z",
    "path": "../public/_nuxt/3-24f5cf30.mjs"
  },
  "/_nuxt/3-29834d42.mjs": {
    "type": "application/javascript",
    "etag": "\"61c-ys6mEQmqguY8V3UlYIDAkY2Sq50\"",
    "mtime": "2022-01-30T12:36:58.300Z",
    "path": "../public/_nuxt/3-29834d42.mjs"
  },
  "/_nuxt/3-9915c412.mjs": {
    "type": "application/javascript",
    "etag": "\"480-IJlBeY4M74RMy4MUFxDJ90dwTWE\"",
    "mtime": "2022-01-30T12:36:58.296Z",
    "path": "../public/_nuxt/3-9915c412.mjs"
  },
  "/_nuxt/4-7cad23af.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-77/hBtretl55W0YTIxJZ6+mpgGE\"",
    "mtime": "2022-01-30T12:36:58.296Z",
    "path": "../public/_nuxt/4-7cad23af.mjs"
  },
  "/_nuxt/4-aad58bb2.mjs": {
    "type": "application/javascript",
    "etag": "\"518-HwU3cOW7EyKYqzoSer/WIoYDqeo\"",
    "mtime": "2022-01-30T12:36:58.288Z",
    "path": "../public/_nuxt/4-aad58bb2.mjs"
  },
  "/_nuxt/4-d83a3ccc.mjs": {
    "type": "application/javascript",
    "etag": "\"562-d+EcWw3PxJQGa48m4w+02DNE2y8\"",
    "mtime": "2022-01-30T12:36:58.288Z",
    "path": "../public/_nuxt/4-d83a3ccc.mjs"
  },
  "/_nuxt/5-275f822c.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-N6sOV7r68VCH1+hRaElTOMAsd2Y\"",
    "mtime": "2022-01-30T12:36:58.284Z",
    "path": "../public/_nuxt/5-275f822c.mjs"
  },
  "/_nuxt/5-b8fbb99e.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-14P8BzMQFAEa7RFAW8aRZ8TPGTs\"",
    "mtime": "2022-01-30T12:36:58.284Z",
    "path": "../public/_nuxt/5-b8fbb99e.mjs"
  },
  "/_nuxt/5-ce25bd52.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-zFvXEWAvUaj63wqFpYsEutcCids\"",
    "mtime": "2022-01-30T12:36:58.280Z",
    "path": "../public/_nuxt/5-ce25bd52.mjs"
  },
  "/_nuxt/6-26537d29.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-jELE+d5asFwQROg9j9aMhMbF0Sg\"",
    "mtime": "2022-01-30T12:36:58.280Z",
    "path": "../public/_nuxt/6-26537d29.mjs"
  },
  "/_nuxt/6-adef6bf0.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-sx8Cn1r8cKBSsBZNfPXw5GnvP34\"",
    "mtime": "2022-01-30T12:36:58.276Z",
    "path": "../public/_nuxt/6-adef6bf0.mjs"
  },
  "/_nuxt/7-28a828e7.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-/6u2O7ZuWlrJ96io0XHp6TIQqpw\"",
    "mtime": "2022-01-30T12:36:58.276Z",
    "path": "../public/_nuxt/7-28a828e7.mjs"
  },
  "/_nuxt/7-542ddb38.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-QsRY5csmMfTRMrHAH0RsMN3oQ1M\"",
    "mtime": "2022-01-30T12:36:58.276Z",
    "path": "../public/_nuxt/7-542ddb38.mjs"
  },
  "/_nuxt/8-17235198.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-J4pZOYAkibZ6q8gaDYK/tP9i8i8\"",
    "mtime": "2022-01-30T12:36:58.272Z",
    "path": "../public/_nuxt/8-17235198.mjs"
  },
  "/_nuxt/8-a6aae0f9.mjs": {
    "type": "application/javascript",
    "etag": "\"692-Rvm8hQEAV//eq4VAcE3/ZPHiPFg\"",
    "mtime": "2022-01-30T12:36:58.272Z",
    "path": "../public/_nuxt/8-a6aae0f9.mjs"
  },
  "/_nuxt/9-a1f9b947.mjs": {
    "type": "application/javascript",
    "etag": "\"435-TdjPZTBokFs0piQhhldCVKhq2WY\"",
    "mtime": "2022-01-30T12:36:58.268Z",
    "path": "../public/_nuxt/9-a1f9b947.mjs"
  },
  "/_nuxt/bootstrap-ba7b6b19.mjs": {
    "type": "application/javascript",
    "etag": "\"21418-CWjkr3tdX4Zk8REl3NL6EtDUo6o\"",
    "mtime": "2022-01-30T12:36:58.268Z",
    "path": "../public/_nuxt/bootstrap-ba7b6b19.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-01-30T12:36:58.268Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-f8b8939c.mjs": {
    "type": "application/javascript",
    "etag": "\"65-n8H4UOiB7Xli0X9au5EZ4KEpRZg\"",
    "mtime": "2022-01-30T12:36:58.264Z",
    "path": "../public/_nuxt/entry-f8b8939c.mjs"
  },
  "/_nuxt/index-3e7bcb2b.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-iWiVPEcGK66AH2Ffp9x52M/Kfsk\"",
    "mtime": "2022-01-30T12:36:58.264Z",
    "path": "../public/_nuxt/index-3e7bcb2b.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1a93-lS5fHOod4iEWAYDxU02Qg13mltc\"",
    "mtime": "2022-01-30T12:36:58.264Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-b8411710.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-SWTUGfjpqiQfpEGmtBXFg4UfAjk\"",
    "mtime": "2022-01-30T12:36:58.264Z",
    "path": "../public/_nuxt/welcome-b8411710.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643546214";
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
