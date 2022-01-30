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
  "/_nuxt/0-6697a9e2.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-eY95WYoqCg/CI2zBGVaNy0hiZKw\"",
    "mtime": "2022-01-30T09:39:25.199Z",
    "path": "../public/_nuxt/0-6697a9e2.mjs"
  },
  "/_nuxt/1-e40f6a54.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-MjCntXeL2IpDwAzQnGFD6EgIgU4\"",
    "mtime": "2022-01-30T09:39:25.199Z",
    "path": "../public/_nuxt/1-e40f6a54.mjs"
  },
  "/_nuxt/1-ea8f3403.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-antFPMOa6BPrTvJO1dGGFWE2hRY\"",
    "mtime": "2022-01-30T09:39:25.191Z",
    "path": "../public/_nuxt/1-ea8f3403.mjs"
  },
  "/_nuxt/1-fb39eada.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-jlZCpdDKIAeBGIFNmWtumRQt1wQ\"",
    "mtime": "2022-01-30T09:39:25.187Z",
    "path": "../public/_nuxt/1-fb39eada.mjs"
  },
  "/_nuxt/2-ba1d8ca0.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-wrBMiVGndJKbLZGqvy5U00mvOVo\"",
    "mtime": "2022-01-30T09:39:25.183Z",
    "path": "../public/_nuxt/2-ba1d8ca0.mjs"
  },
  "/_nuxt/2-e7c540a1.mjs": {
    "type": "application/javascript",
    "etag": "\"471-bNeTLmIyf6fuiPW6CU8ctAN/wCA\"",
    "mtime": "2022-01-30T09:39:25.183Z",
    "path": "../public/_nuxt/2-e7c540a1.mjs"
  },
  "/_nuxt/2-f2ccf282.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-aJ+MfQ2Cx84C9o4zv2FREy7FqY0\"",
    "mtime": "2022-01-30T09:39:25.179Z",
    "path": "../public/_nuxt/2-f2ccf282.mjs"
  },
  "/_nuxt/3-843b6582.mjs": {
    "type": "application/javascript",
    "etag": "\"480-3iQG6/DpFuyu32SbUSht754DksY\"",
    "mtime": "2022-01-30T09:39:25.179Z",
    "path": "../public/_nuxt/3-843b6582.mjs"
  },
  "/_nuxt/3-a5cbab96.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-Gr2rzpiqzWFsx4Q2em5jG3Ishqo\"",
    "mtime": "2022-01-30T09:39:25.179Z",
    "path": "../public/_nuxt/3-a5cbab96.mjs"
  },
  "/_nuxt/4-3f3ece0d.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-1HP455XZCdcho4xJIE++FQAr9PM\"",
    "mtime": "2022-01-30T09:39:25.175Z",
    "path": "../public/_nuxt/4-3f3ece0d.mjs"
  },
  "/_nuxt/4-b888191a.mjs": {
    "type": "application/javascript",
    "etag": "\"518-2uBv53yMZ68RQ0R/6Hp5IKE8OV0\"",
    "mtime": "2022-01-30T09:39:25.175Z",
    "path": "../public/_nuxt/4-b888191a.mjs"
  },
  "/_nuxt/5-d98fe4a4.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-1Zd85o5tPl9YMIZ2uLYCEm1zzn0\"",
    "mtime": "2022-01-30T09:39:25.171Z",
    "path": "../public/_nuxt/5-d98fe4a4.mjs"
  },
  "/_nuxt/5-f855fe44.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-3XI4WcexS091nk9w1OIfaX2xRD0\"",
    "mtime": "2022-01-30T09:39:25.171Z",
    "path": "../public/_nuxt/5-f855fe44.mjs"
  },
  "/_nuxt/6-dc232a31.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-TDDlxUhQA2zhcyxIsGVIQrbeDOo\"",
    "mtime": "2022-01-30T09:39:25.167Z",
    "path": "../public/_nuxt/6-dc232a31.mjs"
  },
  "/_nuxt/7-a9d2eb36.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-EulIFkqWJfdhaF8EuNZT2vKjgYk\"",
    "mtime": "2022-01-30T09:39:25.167Z",
    "path": "../public/_nuxt/7-a9d2eb36.mjs"
  },
  "/_nuxt/8-d4c10374.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-m8olKf5DImZmXSKHlpHaQVPju5M\"",
    "mtime": "2022-01-30T09:39:25.167Z",
    "path": "../public/_nuxt/8-d4c10374.mjs"
  },
  "/_nuxt/9-7689867e.mjs": {
    "type": "application/javascript",
    "etag": "\"435-ws+crtf1m+L524oiJWrEtWbJJfc\"",
    "mtime": "2022-01-30T09:39:25.163Z",
    "path": "../public/_nuxt/9-7689867e.mjs"
  },
  "/_nuxt/bootstrap-c494a676.mjs": {
    "type": "application/javascript",
    "etag": "\"1e1a0-CKRuzI+kW0q5dNU8RnsBPRaOFnI\"",
    "mtime": "2022-01-30T09:39:25.163Z",
    "path": "../public/_nuxt/bootstrap-c494a676.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-01-30T09:39:25.163Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-6ebff53d.mjs": {
    "type": "application/javascript",
    "etag": "\"65-WOojIrAp2GdSEw3506ujcpg6uD8\"",
    "mtime": "2022-01-30T09:39:25.163Z",
    "path": "../public/_nuxt/entry-6ebff53d.mjs"
  },
  "/_nuxt/index-7f6f7e63.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-L7OBlwJY5kIPEV9nBGhkNhjyNGI\"",
    "mtime": "2022-01-30T09:39:25.163Z",
    "path": "../public/_nuxt/index-7f6f7e63.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1161-TNXyJRoo9c9e4cyxtbwWCZ9SA4Y\"",
    "mtime": "2022-01-30T09:39:25.163Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-13fc6c22.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-tip/4MSy4Div0GHNyIxImutPNO0\"",
    "mtime": "2022-01-30T09:39:25.159Z",
    "path": "../public/_nuxt/welcome-13fc6c22.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643535561";
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
