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
    "mtime": "2022-02-02T16:02:00.024Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/0-e568d1a5.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-5T9UejVGO4rAZNy8y3N0oG5j/wg\"",
    "mtime": "2022-02-02T16:02:00.140Z",
    "path": "../public/_nuxt/0-e568d1a5.mjs"
  },
  "/_nuxt/1-010c964f.mjs": {
    "type": "application/javascript",
    "etag": "\"539-o/ekuMZlo1OopdJEwrbG1QnhQnw\"",
    "mtime": "2022-02-02T16:02:00.140Z",
    "path": "../public/_nuxt/1-010c964f.mjs"
  },
  "/_nuxt/1-4920947d.mjs": {
    "type": "application/javascript",
    "etag": "\"6ee-bL3SfK2gEkHdT42VGDH42FeFl+g\"",
    "mtime": "2022-02-02T16:02:00.136Z",
    "path": "../public/_nuxt/1-4920947d.mjs"
  },
  "/_nuxt/1-62310b8b.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-AQU2o5oyZRN7gA9ZlghkQ5nAYTU\"",
    "mtime": "2022-02-02T16:02:00.132Z",
    "path": "../public/_nuxt/1-62310b8b.mjs"
  },
  "/_nuxt/1-84e4e796.mjs": {
    "type": "application/javascript",
    "etag": "\"44d-13WJ6suHdrie0NnYHXaQ3Q8r5es\"",
    "mtime": "2022-02-02T16:02:00.128Z",
    "path": "../public/_nuxt/1-84e4e796.mjs"
  },
  "/_nuxt/1-ba3f3f49.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-Rq2K6pgJCv3z32Ut+QIOGJeTlz8\"",
    "mtime": "2022-02-02T16:02:00.124Z",
    "path": "../public/_nuxt/1-ba3f3f49.mjs"
  },
  "/_nuxt/1-c129dc6d.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-ZVbrqOVTwQJHsvkj+QAoAay+Y8I\"",
    "mtime": "2022-02-02T16:02:00.120Z",
    "path": "../public/_nuxt/1-c129dc6d.mjs"
  },
  "/_nuxt/1-d5af4743.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-aMfhKEBdgZ3wFB+nJ+9uDnTsyhY\"",
    "mtime": "2022-02-02T16:02:00.120Z",
    "path": "../public/_nuxt/1-d5af4743.mjs"
  },
  "/_nuxt/2-024f0d7d.mjs": {
    "type": "application/javascript",
    "etag": "\"5e7-5RDdGxyJfrHpd6bCrbFs61lyEcw\"",
    "mtime": "2022-02-02T16:02:00.116Z",
    "path": "../public/_nuxt/2-024f0d7d.mjs"
  },
  "/_nuxt/2-1693edd2.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-Cs7OdPGUIcjRqaeNjrV11tyWNLI\"",
    "mtime": "2022-02-02T16:02:00.112Z",
    "path": "../public/_nuxt/2-1693edd2.mjs"
  },
  "/_nuxt/2-4f44e141.mjs": {
    "type": "application/javascript",
    "etag": "\"471-6IFtxMZK9D+nWAJMnJ2vrjqLVKw\"",
    "mtime": "2022-02-02T16:02:00.112Z",
    "path": "../public/_nuxt/2-4f44e141.mjs"
  },
  "/_nuxt/2-5fb30b74.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-QhiHC2mw6bmFZlFxVPJtfQeNjeg\"",
    "mtime": "2022-02-02T16:02:00.108Z",
    "path": "../public/_nuxt/2-5fb30b74.mjs"
  },
  "/_nuxt/2-6a86d22a.mjs": {
    "type": "application/javascript",
    "etag": "\"730-tSH2ozhd7Hr4JQSuzzvLwalHgjI\"",
    "mtime": "2022-02-02T16:02:00.108Z",
    "path": "../public/_nuxt/2-6a86d22a.mjs"
  },
  "/_nuxt/2-c1884683.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-nN3zoi6I4qOnNk3rRT2hMeLkllk\"",
    "mtime": "2022-02-02T16:02:00.104Z",
    "path": "../public/_nuxt/2-c1884683.mjs"
  },
  "/_nuxt/2-e51fed3c.mjs": {
    "type": "application/javascript",
    "etag": "\"79c-S0zQtwrunsPick3PpXuqj0Oyajk\"",
    "mtime": "2022-02-02T16:02:00.104Z",
    "path": "../public/_nuxt/2-e51fed3c.mjs"
  },
  "/_nuxt/3-63bee4c5.mjs": {
    "type": "application/javascript",
    "etag": "\"691-HDeUP6hDiWpnEL/vBgvOfgcKcmU\"",
    "mtime": "2022-02-02T16:02:00.100Z",
    "path": "../public/_nuxt/3-63bee4c5.mjs"
  },
  "/_nuxt/3-6cdbb414.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-nP5Fe6hk06hWGv+AnT2KdnnRjSU\"",
    "mtime": "2022-02-02T16:02:00.100Z",
    "path": "../public/_nuxt/3-6cdbb414.mjs"
  },
  "/_nuxt/3-8d11b5e8.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-lDOp28rnzbWaUxUlcCN7NcZPX2A\"",
    "mtime": "2022-02-02T16:02:00.088Z",
    "path": "../public/_nuxt/3-8d11b5e8.mjs"
  },
  "/_nuxt/3-b5eda4e6.mjs": {
    "type": "application/javascript",
    "etag": "\"7aa-lBrfPpSz1l/1AiigQyLtizWCUnI\"",
    "mtime": "2022-02-02T16:02:00.088Z",
    "path": "../public/_nuxt/3-b5eda4e6.mjs"
  },
  "/_nuxt/3-cf0ca19b.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-hUPuezCyFgC4thMcl2C3rLYThlc\"",
    "mtime": "2022-02-02T16:02:00.084Z",
    "path": "../public/_nuxt/3-cf0ca19b.mjs"
  },
  "/_nuxt/3-dcbba769.mjs": {
    "type": "application/javascript",
    "etag": "\"480-jsmrs+n/FDq7mdICDLhiuXCzW6o\"",
    "mtime": "2022-02-02T16:02:00.084Z",
    "path": "../public/_nuxt/3-dcbba769.mjs"
  },
  "/_nuxt/4-21a5fad8.mjs": {
    "type": "application/javascript",
    "etag": "\"518-PPD18OwB9o0N+gZioTnRW+v9DFM\"",
    "mtime": "2022-02-02T16:02:00.080Z",
    "path": "../public/_nuxt/4-21a5fad8.mjs"
  },
  "/_nuxt/4-24040669.mjs": {
    "type": "application/javascript",
    "etag": "\"838-+o9KcdcYnftPKb3orI0zo9hLdVE\"",
    "mtime": "2022-02-02T16:02:00.080Z",
    "path": "../public/_nuxt/4-24040669.mjs"
  },
  "/_nuxt/4-9aa5f5ee.mjs": {
    "type": "application/javascript",
    "etag": "\"562-98YLMEWUZYq0OjV+MmdJwU0JzPk\"",
    "mtime": "2022-02-02T16:02:00.072Z",
    "path": "../public/_nuxt/4-9aa5f5ee.mjs"
  },
  "/_nuxt/4-c20faa36.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-26Nkb9gL579uVD3ZOomb14xN0ZM\"",
    "mtime": "2022-02-02T16:02:00.068Z",
    "path": "../public/_nuxt/4-c20faa36.mjs"
  },
  "/_nuxt/4-cc3501f7.mjs": {
    "type": "application/javascript",
    "etag": "\"afe-kEvQ7yroaFyjptOvx+/A1Hjzsfo\"",
    "mtime": "2022-02-02T16:02:00.068Z",
    "path": "../public/_nuxt/4-cc3501f7.mjs"
  },
  "/_nuxt/4-de817912.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-vFTNDU2c+sluWFl0425MZp3LS2o\"",
    "mtime": "2022-02-02T16:02:00.068Z",
    "path": "../public/_nuxt/4-de817912.mjs"
  },
  "/_nuxt/5-79244dd4.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-7RluYXoiTZuCy8745Cy69X9sYuU\"",
    "mtime": "2022-02-02T16:02:00.060Z",
    "path": "../public/_nuxt/5-79244dd4.mjs"
  },
  "/_nuxt/5-7fd81406.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-EgNgdrnTggjh5r5YLJWpHqoafZw\"",
    "mtime": "2022-02-02T16:02:00.060Z",
    "path": "../public/_nuxt/5-7fd81406.mjs"
  },
  "/_nuxt/5-aad6deb5.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-7QNuQgxH0VJlyFitK/bJ97Z0M60\"",
    "mtime": "2022-02-02T16:02:00.056Z",
    "path": "../public/_nuxt/5-aad6deb5.mjs"
  },
  "/_nuxt/5-d37d7829.mjs": {
    "type": "application/javascript",
    "etag": "\"8b1-daMCFvWPU0hdqHuDDLI2/owFmxM\"",
    "mtime": "2022-02-02T16:02:00.056Z",
    "path": "../public/_nuxt/5-d37d7829.mjs"
  },
  "/_nuxt/5-e9292ae3.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-3hRHxTiTIU1GbdFHVKlecCMcuOc\"",
    "mtime": "2022-02-02T16:02:00.056Z",
    "path": "../public/_nuxt/5-e9292ae3.mjs"
  },
  "/_nuxt/6-115a46fe.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-u2GER3LMIhV9iLbkZ/DjM4RitnE\"",
    "mtime": "2022-02-02T16:02:00.048Z",
    "path": "../public/_nuxt/6-115a46fe.mjs"
  },
  "/_nuxt/6-485baab2.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-zTs6b56CPhgFzeFm8CfGF0wnqsY\"",
    "mtime": "2022-02-02T16:02:00.044Z",
    "path": "../public/_nuxt/6-485baab2.mjs"
  },
  "/_nuxt/6-6d514c8a.mjs": {
    "type": "application/javascript",
    "etag": "\"652-aHPSYUS9uBRWETQFNYKH+rMerBk\"",
    "mtime": "2022-02-02T16:02:00.044Z",
    "path": "../public/_nuxt/6-6d514c8a.mjs"
  },
  "/_nuxt/6-bd62443d.mjs": {
    "type": "application/javascript",
    "etag": "\"916-+HGjho6neKffVF5Vic5rodKxzEU\"",
    "mtime": "2022-02-02T16:02:00.040Z",
    "path": "../public/_nuxt/6-bd62443d.mjs"
  },
  "/_nuxt/7-32508a7e.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-G5V2EBvQz9hxvegSrVisrFYT1/4\"",
    "mtime": "2022-02-02T16:02:00.040Z",
    "path": "../public/_nuxt/7-32508a7e.mjs"
  },
  "/_nuxt/7-7e9f8ef6.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-vGSIRUMDZnY7BvGmZt/zoObtaiU\"",
    "mtime": "2022-02-02T16:02:00.036Z",
    "path": "../public/_nuxt/7-7e9f8ef6.mjs"
  },
  "/_nuxt/8-c21e51e9.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-A1+P/QO9EYsftT07KmB7ie35XSM\"",
    "mtime": "2022-02-02T16:02:00.036Z",
    "path": "../public/_nuxt/8-c21e51e9.mjs"
  },
  "/_nuxt/8-ccb0e5e9.mjs": {
    "type": "application/javascript",
    "etag": "\"692-O8IFuSDTIr6GhIJCn+APEw6dQUE\"",
    "mtime": "2022-02-02T16:02:00.036Z",
    "path": "../public/_nuxt/8-ccb0e5e9.mjs"
  },
  "/_nuxt/9-8bfc2a89.mjs": {
    "type": "application/javascript",
    "etag": "\"435-x/z2KY2twjNzbnCWgqA/24TQVvU\"",
    "mtime": "2022-02-02T16:02:00.032Z",
    "path": "../public/_nuxt/9-8bfc2a89.mjs"
  },
  "/_nuxt/bootstrap-24038287.mjs": {
    "type": "application/javascript",
    "etag": "\"25b50-Vi7c/AfMsSxMgicxpEYKZkEQWMw\"",
    "mtime": "2022-02-02T16:02:00.032Z",
    "path": "../public/_nuxt/bootstrap-24038287.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-02-02T16:02:00.032Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-fc3b7c90.mjs": {
    "type": "application/javascript",
    "etag": "\"65-UhD8QYLnNHwURVD7aQOPdFXB/gc\"",
    "mtime": "2022-02-02T16:02:00.028Z",
    "path": "../public/_nuxt/entry-fc3b7c90.mjs"
  },
  "/_nuxt/index-071422b2.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-aeLie2S39j+3QD+C1Mx+DueXtgg\"",
    "mtime": "2022-02-02T16:02:00.028Z",
    "path": "../public/_nuxt/index-071422b2.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"2571-GlI04QBDed6GagOqySguIb5btv0\"",
    "mtime": "2022-02-02T16:02:00.028Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-cac429c3.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-4XRHMrawh+Bms09xRng/NjeZNTI\"",
    "mtime": "2022-02-02T16:02:00.028Z",
    "path": "../public/_nuxt/welcome-cac429c3.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643817715";
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
