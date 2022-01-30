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
  "/_nuxt/0-23985c37.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-KGP5CUWxqUjwclJ3IXPlCwHyxuU\"",
    "mtime": "2022-01-30T12:58:41.357Z",
    "path": "../public/_nuxt/0-23985c37.mjs"
  },
  "/_nuxt/1-5a029b19.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-2NZ5bIFXWXqP57sjf/ULjPIEJFs\"",
    "mtime": "2022-01-30T12:58:41.353Z",
    "path": "../public/_nuxt/1-5a029b19.mjs"
  },
  "/_nuxt/1-6a66eb0f.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-LNL7w3bWtijGY9wXiyPq87O1Dks\"",
    "mtime": "2022-01-30T12:58:41.349Z",
    "path": "../public/_nuxt/1-6a66eb0f.mjs"
  },
  "/_nuxt/1-722a43ed.mjs": {
    "type": "application/javascript",
    "etag": "\"44d-4QAz9bRL3Z3weOLw515exYR88/w\"",
    "mtime": "2022-01-30T12:58:41.349Z",
    "path": "../public/_nuxt/1-722a43ed.mjs"
  },
  "/_nuxt/1-90d4c7b5.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-Zo87vTbvHxEgH1uGas2NHqSDW/I\"",
    "mtime": "2022-01-30T12:58:41.345Z",
    "path": "../public/_nuxt/1-90d4c7b5.mjs"
  },
  "/_nuxt/1-d684ebd6.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-n6N1/iMi3NUc+nloRMPREA71siE\"",
    "mtime": "2022-01-30T12:58:41.341Z",
    "path": "../public/_nuxt/1-d684ebd6.mjs"
  },
  "/_nuxt/2-18c281a5.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-82bnLjGTfIleekG3Uf0e8shYCS4\"",
    "mtime": "2022-01-30T12:58:41.341Z",
    "path": "../public/_nuxt/2-18c281a5.mjs"
  },
  "/_nuxt/2-4bc2928d.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-O+oMepy3thFNpPWtg9vG07jioAY\"",
    "mtime": "2022-01-30T12:58:41.337Z",
    "path": "../public/_nuxt/2-4bc2928d.mjs"
  },
  "/_nuxt/2-94a1a5a4.mjs": {
    "type": "application/javascript",
    "etag": "\"471-hRunD69ABRGpzsChj4sDyLZ9uoQ\"",
    "mtime": "2022-01-30T12:58:41.333Z",
    "path": "../public/_nuxt/2-94a1a5a4.mjs"
  },
  "/_nuxt/2-c6d7de9e.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-OirQ+VyCkxxTgD4YJzKFIX/aNrA\"",
    "mtime": "2022-01-30T12:58:41.329Z",
    "path": "../public/_nuxt/2-c6d7de9e.mjs"
  },
  "/_nuxt/2-ea9f7bff.mjs": {
    "type": "application/javascript",
    "etag": "\"730-uRP6igg9Fr+SwqbyNVUXiwB1KpU\"",
    "mtime": "2022-01-30T12:58:41.329Z",
    "path": "../public/_nuxt/2-ea9f7bff.mjs"
  },
  "/_nuxt/3-ab1e0a36.mjs": {
    "type": "application/javascript",
    "etag": "\"480-ou+xFbpDhI6pM1Lu3x3V1VgtVM8\"",
    "mtime": "2022-01-30T12:58:41.321Z",
    "path": "../public/_nuxt/3-ab1e0a36.mjs"
  },
  "/_nuxt/3-db3a4591.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-DyXuMuYnBEYE+k3RcRbkm5fVMMg\"",
    "mtime": "2022-01-30T12:58:41.321Z",
    "path": "../public/_nuxt/3-db3a4591.mjs"
  },
  "/_nuxt/3-dc126c90.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-8ykGrREn6xjKi7P6q7F7/h3p4A4\"",
    "mtime": "2022-01-30T12:58:41.317Z",
    "path": "../public/_nuxt/3-dc126c90.mjs"
  },
  "/_nuxt/3-dd258033.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-nnuRQGuwGCqm973wl3RC9qxkhI8\"",
    "mtime": "2022-01-30T12:58:41.313Z",
    "path": "../public/_nuxt/3-dd258033.mjs"
  },
  "/_nuxt/4-766ae699.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-0VDpXg0dKAXH5/crtVXSmuUw8JM\"",
    "mtime": "2022-01-30T12:58:41.309Z",
    "path": "../public/_nuxt/4-766ae699.mjs"
  },
  "/_nuxt/4-8adc2aeb.mjs": {
    "type": "application/javascript",
    "etag": "\"562-BlTwogQzuXCOVwz5c3ODraqfZd8\"",
    "mtime": "2022-01-30T12:58:41.297Z",
    "path": "../public/_nuxt/4-8adc2aeb.mjs"
  },
  "/_nuxt/4-c44a9b80.mjs": {
    "type": "application/javascript",
    "etag": "\"518-qlrd+M/FyBaedz+aXjOuHtHeEhc\"",
    "mtime": "2022-01-30T12:58:41.293Z",
    "path": "../public/_nuxt/4-c44a9b80.mjs"
  },
  "/_nuxt/4-f9c00f8f.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-/gBdJsxJoqPyCn4aqVyPPCAXYr8\"",
    "mtime": "2022-01-30T12:58:41.293Z",
    "path": "../public/_nuxt/4-f9c00f8f.mjs"
  },
  "/_nuxt/5-4269089e.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-BgxD17GE2lug9cJifNO0a+vGRWE\"",
    "mtime": "2022-01-30T12:58:41.289Z",
    "path": "../public/_nuxt/5-4269089e.mjs"
  },
  "/_nuxt/5-50cbadec.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-y62c8apWv15nSQMcQwfErCSngqk\"",
    "mtime": "2022-01-30T12:58:41.285Z",
    "path": "../public/_nuxt/5-50cbadec.mjs"
  },
  "/_nuxt/5-6ffa8e50.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-oNdRFSpAGqoXD7Xz19JthR2TvEQ\"",
    "mtime": "2022-01-30T12:58:41.285Z",
    "path": "../public/_nuxt/5-6ffa8e50.mjs"
  },
  "/_nuxt/5-fbcee8ca.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-L4yD2lONulq/drnQrlQG4iDcJP4\"",
    "mtime": "2022-01-30T12:58:41.281Z",
    "path": "../public/_nuxt/5-fbcee8ca.mjs"
  },
  "/_nuxt/6-6f8492d4.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-xNS48kSQfmzlOLsGsqUf1iKMXUE\"",
    "mtime": "2022-01-30T12:58:41.281Z",
    "path": "../public/_nuxt/6-6f8492d4.mjs"
  },
  "/_nuxt/6-bfea14ac.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-PuC0dpbiaD3aWKkFfFb2clNA/qQ\"",
    "mtime": "2022-01-30T12:58:41.277Z",
    "path": "../public/_nuxt/6-bfea14ac.mjs"
  },
  "/_nuxt/6-d2c0327b.mjs": {
    "type": "application/javascript",
    "etag": "\"652-oR8Yrx93HYzflww+4LhuRxfGlig\"",
    "mtime": "2022-01-30T12:58:41.277Z",
    "path": "../public/_nuxt/6-d2c0327b.mjs"
  },
  "/_nuxt/7-5ae3ad0c.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-so070SeDTT8iM+rLaLMRklvVDe8\"",
    "mtime": "2022-01-30T12:58:41.277Z",
    "path": "../public/_nuxt/7-5ae3ad0c.mjs"
  },
  "/_nuxt/7-9dbcb129.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-CBEN8o/h7EPhWYdv5Kt6ZXRd4qI\"",
    "mtime": "2022-01-30T12:58:41.273Z",
    "path": "../public/_nuxt/7-9dbcb129.mjs"
  },
  "/_nuxt/8-7161b767.mjs": {
    "type": "application/javascript",
    "etag": "\"692-Gc59t+7idVklMWjyLrqiWT4xStk\"",
    "mtime": "2022-01-30T12:58:41.273Z",
    "path": "../public/_nuxt/8-7161b767.mjs"
  },
  "/_nuxt/8-e93b2713.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-PQns7lfiCU/WyR21CD1nsrTb0UA\"",
    "mtime": "2022-01-30T12:58:41.273Z",
    "path": "../public/_nuxt/8-e93b2713.mjs"
  },
  "/_nuxt/9-d4b0dd95.mjs": {
    "type": "application/javascript",
    "etag": "\"435-3ByBnk+SSLxMjfxfVH2zUowEkFc\"",
    "mtime": "2022-01-30T12:58:41.269Z",
    "path": "../public/_nuxt/9-d4b0dd95.mjs"
  },
  "/_nuxt/bootstrap-1bb873d7.mjs": {
    "type": "application/javascript",
    "etag": "\"21f99-Cg2n53k50SpNM1zntAa9bptPw8s\"",
    "mtime": "2022-01-30T12:58:41.269Z",
    "path": "../public/_nuxt/bootstrap-1bb873d7.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-01-30T12:58:41.265Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-eeb6385e.mjs": {
    "type": "application/javascript",
    "etag": "\"65-3vgpjIuGy0xhVnBVeWOawS/gsHQ\"",
    "mtime": "2022-01-30T12:58:41.265Z",
    "path": "../public/_nuxt/entry-eeb6385e.mjs"
  },
  "/_nuxt/index-ad029c5b.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-Oy6TBGi7r6Y1Ak/36py3taT37f4\"",
    "mtime": "2022-01-30T12:58:41.265Z",
    "path": "../public/_nuxt/index-ad029c5b.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1d15-1FaNsNUbcUpw0XaSr+QFvCPpLQE\"",
    "mtime": "2022-01-30T12:58:41.265Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-7e8b6aaa.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-FUWv7sGJnYQxE+vh9aiNN00nOb8\"",
    "mtime": "2022-01-30T12:58:41.265Z",
    "path": "../public/_nuxt/welcome-7e8b6aaa.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643547516";
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
