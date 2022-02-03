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
    "mtime": "2022-02-03T15:13:12.642Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/0-f56fb81e.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-Wvnao4RwLEFt3Lsqvg6q9NtHDUw\"",
    "mtime": "2022-02-03T15:13:12.810Z",
    "path": "../public/_nuxt/0-f56fb81e.mjs"
  },
  "/_nuxt/1-1b552b19.mjs": {
    "type": "application/javascript",
    "etag": "\"7ae-lXEwUJ9VP3wvTAbJoAPt2JFJyyY\"",
    "mtime": "2022-02-03T15:13:12.802Z",
    "path": "../public/_nuxt/1-1b552b19.mjs"
  },
  "/_nuxt/1-358df128.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-MiNYTsZC4G1wCSzd0soLeTJXf/4\"",
    "mtime": "2022-02-03T15:13:12.798Z",
    "path": "../public/_nuxt/1-358df128.mjs"
  },
  "/_nuxt/1-513a1dbc.mjs": {
    "type": "application/javascript",
    "etag": "\"537-JQ8g2TJE4yzot5yux2L6cThzp+Q\"",
    "mtime": "2022-02-03T15:13:12.798Z",
    "path": "../public/_nuxt/1-513a1dbc.mjs"
  },
  "/_nuxt/1-582997f1.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-EaKgaqsSKjCzoK653wvgCLGc4uw\"",
    "mtime": "2022-02-03T15:13:12.794Z",
    "path": "../public/_nuxt/1-582997f1.mjs"
  },
  "/_nuxt/1-6251fd9f.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-F2K7TXdzmmXMMWrnnjm8mKjHrD4\"",
    "mtime": "2022-02-03T15:13:12.794Z",
    "path": "../public/_nuxt/1-6251fd9f.mjs"
  },
  "/_nuxt/1-91cbb826.mjs": {
    "type": "application/javascript",
    "etag": "\"44d-02d8M5lPTJRfbgKuQ+s52t/qbbQ\"",
    "mtime": "2022-02-03T15:13:12.790Z",
    "path": "../public/_nuxt/1-91cbb826.mjs"
  },
  "/_nuxt/1-966ac8db.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-EIXKIuqu479xWTJYjNgZV3p3FrM\"",
    "mtime": "2022-02-03T15:13:12.786Z",
    "path": "../public/_nuxt/1-966ac8db.mjs"
  },
  "/_nuxt/1-97a4ce38.mjs": {
    "type": "application/javascript",
    "etag": "\"539-Tir8HJJX+lv4gEllg0GGQuRECo8\"",
    "mtime": "2022-02-03T15:13:12.786Z",
    "path": "../public/_nuxt/1-97a4ce38.mjs"
  },
  "/_nuxt/1-a639c5ad.mjs": {
    "type": "application/javascript",
    "etag": "\"52a-q9c4dNRfHF3WFaSAqMt7tWtY7EQ\"",
    "mtime": "2022-02-03T15:13:12.782Z",
    "path": "../public/_nuxt/1-a639c5ad.mjs"
  },
  "/_nuxt/1-ea7cde9f.mjs": {
    "type": "application/javascript",
    "etag": "\"6ee-G7sjzaVAKvs5RNNpwFt20M80R+k\"",
    "mtime": "2022-02-03T15:13:12.778Z",
    "path": "../public/_nuxt/1-ea7cde9f.mjs"
  },
  "/_nuxt/2-2888a3d2.mjs": {
    "type": "application/javascript",
    "etag": "\"5df-zxUAusslf0NfOLRiZNmxR5zoC3Q\"",
    "mtime": "2022-02-03T15:13:12.774Z",
    "path": "../public/_nuxt/2-2888a3d2.mjs"
  },
  "/_nuxt/2-4594efee.mjs": {
    "type": "application/javascript",
    "etag": "\"79c-KEr6FScfuItji177gch88ooPh/w\"",
    "mtime": "2022-02-03T15:13:12.770Z",
    "path": "../public/_nuxt/2-4594efee.mjs"
  },
  "/_nuxt/2-51926bff.mjs": {
    "type": "application/javascript",
    "etag": "\"623-uVGomTx276AwASiM3Pwrpb6glmg\"",
    "mtime": "2022-02-03T15:13:12.766Z",
    "path": "../public/_nuxt/2-51926bff.mjs"
  },
  "/_nuxt/2-6d210bc6.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-DY6o2wlCMpjrsJ9m7eWPUZdRtBI\"",
    "mtime": "2022-02-03T15:13:12.758Z",
    "path": "../public/_nuxt/2-6d210bc6.mjs"
  },
  "/_nuxt/2-711ed49b.mjs": {
    "type": "application/javascript",
    "etag": "\"92f-rupAX6IB35qzw/cXpWoPYCetg7M\"",
    "mtime": "2022-02-03T15:13:12.754Z",
    "path": "../public/_nuxt/2-711ed49b.mjs"
  },
  "/_nuxt/2-8869c68a.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-MzMt1TbyrBIu0L3g8sKvV3rTIDI\"",
    "mtime": "2022-02-03T15:13:12.754Z",
    "path": "../public/_nuxt/2-8869c68a.mjs"
  },
  "/_nuxt/2-92a1bec0.mjs": {
    "type": "application/javascript",
    "etag": "\"730-NNBWMtwJHLTk7NXIigKQMb4p4rA\"",
    "mtime": "2022-02-03T15:13:12.750Z",
    "path": "../public/_nuxt/2-92a1bec0.mjs"
  },
  "/_nuxt/2-9faa943b.mjs": {
    "type": "application/javascript",
    "etag": "\"5e7-TvlomI1LbVRCGFPXSu55SluVras\"",
    "mtime": "2022-02-03T15:13:12.750Z",
    "path": "../public/_nuxt/2-9faa943b.mjs"
  },
  "/_nuxt/2-ccb316ec.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-oBx4fRXKMfnYVUKjYyRKehOTa+U\"",
    "mtime": "2022-02-03T15:13:12.746Z",
    "path": "../public/_nuxt/2-ccb316ec.mjs"
  },
  "/_nuxt/2-d6195960.mjs": {
    "type": "application/javascript",
    "etag": "\"471-3mjRrmeUa7VcRu6EYQ5/jGCtJIE\"",
    "mtime": "2022-02-03T15:13:12.742Z",
    "path": "../public/_nuxt/2-d6195960.mjs"
  },
  "/_nuxt/3-0190c9db.mjs": {
    "type": "application/javascript",
    "etag": "\"73f-lF5RWxOdMHPZSqlW2jsxZZlEU48\"",
    "mtime": "2022-02-03T15:13:12.742Z",
    "path": "../public/_nuxt/3-0190c9db.mjs"
  },
  "/_nuxt/3-2470b03b.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-qNoJzf8EjHEnyGjLKMcJdG2PaRo\"",
    "mtime": "2022-02-03T15:13:12.738Z",
    "path": "../public/_nuxt/3-2470b03b.mjs"
  },
  "/_nuxt/3-9506739e.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-nu3yIsy2luaUg7kFL+aHcjHk6Q0\"",
    "mtime": "2022-02-03T15:13:12.738Z",
    "path": "../public/_nuxt/3-9506739e.mjs"
  },
  "/_nuxt/3-9866c87a.mjs": {
    "type": "application/javascript",
    "etag": "\"5f3-M3UIxoZw8xQg42Oz1bYEo+LLVEY\"",
    "mtime": "2022-02-03T15:13:12.738Z",
    "path": "../public/_nuxt/3-9866c87a.mjs"
  },
  "/_nuxt/3-a308bb03.mjs": {
    "type": "application/javascript",
    "etag": "\"9da-voGYUwtseuliTof2xEe+1uIo4L4\"",
    "mtime": "2022-02-03T15:13:12.730Z",
    "path": "../public/_nuxt/3-a308bb03.mjs"
  },
  "/_nuxt/3-dc8c1cfb.mjs": {
    "type": "application/javascript",
    "etag": "\"691-wNvfw0cN5zVHpQKVaiKcUShtsDM\"",
    "mtime": "2022-02-03T15:13:12.726Z",
    "path": "../public/_nuxt/3-dc8c1cfb.mjs"
  },
  "/_nuxt/3-efa6794e.mjs": {
    "type": "application/javascript",
    "etag": "\"480-ugyGbEYslzGKHL+boPDqknhJrcM\"",
    "mtime": "2022-02-03T15:13:12.726Z",
    "path": "../public/_nuxt/3-efa6794e.mjs"
  },
  "/_nuxt/3-f4b8b7e2.mjs": {
    "type": "application/javascript",
    "etag": "\"7aa-TlX39GHv5HdBIIvj5MhDX/qKiMk\"",
    "mtime": "2022-02-03T15:13:12.722Z",
    "path": "../public/_nuxt/3-f4b8b7e2.mjs"
  },
  "/_nuxt/3-fc0bd4e5.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-lDud+Y1j5/HDPj7YIDN4TtiYpWc\"",
    "mtime": "2022-02-03T15:13:12.718Z",
    "path": "../public/_nuxt/3-fc0bd4e5.mjs"
  },
  "/_nuxt/4-12cc3dd7.mjs": {
    "type": "application/javascript",
    "etag": "\"518-JbjrCGE6LJPVQL2DrN6An0CNGq0\"",
    "mtime": "2022-02-03T15:13:12.718Z",
    "path": "../public/_nuxt/4-12cc3dd7.mjs"
  },
  "/_nuxt/4-298d1e51.mjs": {
    "type": "application/javascript",
    "etag": "\"784-5Tl110UGan92h8lk2YA5YSdvxY0\"",
    "mtime": "2022-02-03T15:13:12.714Z",
    "path": "../public/_nuxt/4-298d1e51.mjs"
  },
  "/_nuxt/4-404c0b62.mjs": {
    "type": "application/javascript",
    "etag": "\"838-XZ0ZrIbfQZWuK1vZVTyGnJWXi8o\"",
    "mtime": "2022-02-03T15:13:12.714Z",
    "path": "../public/_nuxt/4-404c0b62.mjs"
  },
  "/_nuxt/4-4b1a42e6.mjs": {
    "type": "application/javascript",
    "etag": "\"7b9-oDhdw62mj1V/EETYntXoiTXPtgY\"",
    "mtime": "2022-02-03T15:13:12.710Z",
    "path": "../public/_nuxt/4-4b1a42e6.mjs"
  },
  "/_nuxt/4-5084a6bd.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-yS4aTJ3Nweemz+hTM7dPgd6wTyA\"",
    "mtime": "2022-02-03T15:13:12.706Z",
    "path": "../public/_nuxt/4-5084a6bd.mjs"
  },
  "/_nuxt/4-66343b46.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-5S88BP2gWC20TMq+Sqy6alGds3w\"",
    "mtime": "2022-02-03T15:13:12.702Z",
    "path": "../public/_nuxt/4-66343b46.mjs"
  },
  "/_nuxt/4-932b11ca.mjs": {
    "type": "application/javascript",
    "etag": "\"afe-lS6V2MgvYl/yf6XSEhMl3fonQEE\"",
    "mtime": "2022-02-03T15:13:12.702Z",
    "path": "../public/_nuxt/4-932b11ca.mjs"
  },
  "/_nuxt/4-f39e3b5e.mjs": {
    "type": "application/javascript",
    "etag": "\"9f7-aHmruMijfo3fNqUCghalTvJOyaY\"",
    "mtime": "2022-02-03T15:13:12.698Z",
    "path": "../public/_nuxt/4-f39e3b5e.mjs"
  },
  "/_nuxt/4-f8420062.mjs": {
    "type": "application/javascript",
    "etag": "\"562-tz+kZoAdk29tLX1XJ+U5IQYEQkc\"",
    "mtime": "2022-02-03T15:13:12.698Z",
    "path": "../public/_nuxt/4-f8420062.mjs"
  },
  "/_nuxt/5-789d5717.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-+4z9ocDGX8isQJ9H9wQYBHrNk28\"",
    "mtime": "2022-02-03T15:13:12.686Z",
    "path": "../public/_nuxt/5-789d5717.mjs"
  },
  "/_nuxt/5-7f6b36c0.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-9TzdLIMTJAMcu260cr0kpUWSzQ8\"",
    "mtime": "2022-02-03T15:13:12.686Z",
    "path": "../public/_nuxt/5-7f6b36c0.mjs"
  },
  "/_nuxt/5-8d168253.mjs": {
    "type": "application/javascript",
    "etag": "\"779-KNrLtvFQxOhhzeinmy0TbzwCLxE\"",
    "mtime": "2022-02-03T15:13:12.682Z",
    "path": "../public/_nuxt/5-8d168253.mjs"
  },
  "/_nuxt/5-b3b6f51f.mjs": {
    "type": "application/javascript",
    "etag": "\"11bf-rwadbZOUkh6cdIUbpt0usC7ie2M\"",
    "mtime": "2022-02-03T15:13:12.678Z",
    "path": "../public/_nuxt/5-b3b6f51f.mjs"
  },
  "/_nuxt/5-b61cacde.mjs": {
    "type": "application/javascript",
    "etag": "\"8bf-jCS0BPIWMdPYYD34mNLRuJ1LQkY\"",
    "mtime": "2022-02-03T15:13:12.678Z",
    "path": "../public/_nuxt/5-b61cacde.mjs"
  },
  "/_nuxt/5-e3ccc0bc.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-1yKrfMMoxHlMEfq6MbW//92jn6A\"",
    "mtime": "2022-02-03T15:13:12.678Z",
    "path": "../public/_nuxt/5-e3ccc0bc.mjs"
  },
  "/_nuxt/5-fd6ead40.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-ptA1CuT1lhKC56KpODDHWB9JnY0\"",
    "mtime": "2022-02-03T15:13:12.674Z",
    "path": "../public/_nuxt/5-fd6ead40.mjs"
  },
  "/_nuxt/5-fded7c85.mjs": {
    "type": "application/javascript",
    "etag": "\"8b1-gIz/MslXKLTmGvcBQQnHDkhhsbA\"",
    "mtime": "2022-02-03T15:13:12.674Z",
    "path": "../public/_nuxt/5-fded7c85.mjs"
  },
  "/_nuxt/6-7cfef482.mjs": {
    "type": "application/javascript",
    "etag": "\"9ab-c7N5TdwPTfg4LDcU0gF0AIejvtE\"",
    "mtime": "2022-02-03T15:13:12.662Z",
    "path": "../public/_nuxt/6-7cfef482.mjs"
  },
  "/_nuxt/6-890d307c.mjs": {
    "type": "application/javascript",
    "etag": "\"916-EVR6ATOp0eaZUFQvFggstiB9Elo\"",
    "mtime": "2022-02-03T15:13:12.658Z",
    "path": "../public/_nuxt/6-890d307c.mjs"
  },
  "/_nuxt/6-af392177.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-joKXN2UZhYbhAumTddfmg+afBm4\"",
    "mtime": "2022-02-03T15:13:12.658Z",
    "path": "../public/_nuxt/6-af392177.mjs"
  },
  "/_nuxt/6-cccd076c.mjs": {
    "type": "application/javascript",
    "etag": "\"652-63IvjsfjOPKEnFFlTpOWcqElpG4\"",
    "mtime": "2022-02-03T15:13:12.658Z",
    "path": "../public/_nuxt/6-cccd076c.mjs"
  },
  "/_nuxt/6-ec72189a.mjs": {
    "type": "application/javascript",
    "etag": "\"818-GbSW3CTexXfyhkKZiGRHRBTpER4\"",
    "mtime": "2022-02-03T15:13:12.654Z",
    "path": "../public/_nuxt/6-ec72189a.mjs"
  },
  "/_nuxt/6-fecaf0d6.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-UPbT0vkxmIVukKDqOrL0ut3KzoU\"",
    "mtime": "2022-02-03T15:13:12.654Z",
    "path": "../public/_nuxt/6-fecaf0d6.mjs"
  },
  "/_nuxt/7-19cc0a28.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-9jvvnmhAKcPz7y7cE5DwPbWqOMQ\"",
    "mtime": "2022-02-03T15:13:12.654Z",
    "path": "../public/_nuxt/7-19cc0a28.mjs"
  },
  "/_nuxt/7-91a6049c.mjs": {
    "type": "application/javascript",
    "etag": "\"859-aBzMKG9gcDXS7MfAtMUBDQaoPaI\"",
    "mtime": "2022-02-03T15:13:12.650Z",
    "path": "../public/_nuxt/7-91a6049c.mjs"
  },
  "/_nuxt/7-c055cefc.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-qzxJ5/k0xTALuOgkx5XfkJP/gtw\"",
    "mtime": "2022-02-03T15:13:12.650Z",
    "path": "../public/_nuxt/7-c055cefc.mjs"
  },
  "/_nuxt/8-eb5d01fa.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-Eqi6zJ+HIDapwGebXSRJXya2b9k\"",
    "mtime": "2022-02-03T15:13:12.650Z",
    "path": "../public/_nuxt/8-eb5d01fa.mjs"
  },
  "/_nuxt/8-f8b6073a.mjs": {
    "type": "application/javascript",
    "etag": "\"692-It+CBTnxgrEO4I9sUIyJOGFY29k\"",
    "mtime": "2022-02-03T15:13:12.650Z",
    "path": "../public/_nuxt/8-f8b6073a.mjs"
  },
  "/_nuxt/9-7980b977.mjs": {
    "type": "application/javascript",
    "etag": "\"435-l4EQaU85UYNkD3Vg/+swPgQZTQw\"",
    "mtime": "2022-02-03T15:13:12.646Z",
    "path": "../public/_nuxt/9-7980b977.mjs"
  },
  "/_nuxt/bootstrap-b9527510.mjs": {
    "type": "application/javascript",
    "etag": "\"3741d-GFCYuETXsz+ohI5Chfk6lQSxIBI\"",
    "mtime": "2022-02-03T15:13:12.646Z",
    "path": "../public/_nuxt/bootstrap-b9527510.mjs"
  },
  "/_nuxt/bootstrap.d112f0ff.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"259-8adtGOTARCB1GFi7y5wyT9MSeCM\"",
    "mtime": "2022-02-03T15:13:12.646Z",
    "path": "../public/_nuxt/bootstrap.d112f0ff.css"
  },
  "/_nuxt/entry-28770b9c.mjs": {
    "type": "application/javascript",
    "etag": "\"65-KfMX18JHEaYDqVXODC7SWufssQU\"",
    "mtime": "2022-02-03T15:13:12.646Z",
    "path": "../public/_nuxt/entry-28770b9c.mjs"
  },
  "/_nuxt/index-5b5c3ee7.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-kuERrqAxexeHOxni7i8+zXvms6E\"",
    "mtime": "2022-02-03T15:13:12.642Z",
    "path": "../public/_nuxt/index-5b5c3ee7.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"347d-f50zfUkF/bDp3TJd8ADOxl1BwbQ\"",
    "mtime": "2022-02-03T15:13:12.642Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-ec16babc.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-MqazHZ+FjuQpMnWWAW59wNM+ZgY\"",
    "mtime": "2022-02-03T15:13:12.642Z",
    "path": "../public/_nuxt/welcome-ec16babc.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643901186";
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
