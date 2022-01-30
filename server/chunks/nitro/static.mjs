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
  "/_nuxt/0-337ff8be.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-0/B3mhKqqoqv7PKuO+ujnfjcG9w\"",
    "mtime": "2022-01-30T14:53:44.302Z",
    "path": "../public/_nuxt/0-337ff8be.mjs"
  },
  "/_nuxt/1-263c7575.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-hFfPfUz6fcz/vIgmQNvr1AMY41o\"",
    "mtime": "2022-01-30T14:53:44.294Z",
    "path": "../public/_nuxt/1-263c7575.mjs"
  },
  "/_nuxt/1-bf9264ab.mjs": {
    "type": "application/javascript",
    "etag": "\"452-iM0vGYIBGl4FQktkom1H/TcoyYQ\"",
    "mtime": "2022-01-30T14:53:44.290Z",
    "path": "../public/_nuxt/1-bf9264ab.mjs"
  },
  "/_nuxt/1-c05471d4.mjs": {
    "type": "application/javascript",
    "etag": "\"6ee-krixwGQnDD9L4XCB3UNgLzbBlq4\"",
    "mtime": "2022-01-30T14:53:44.286Z",
    "path": "../public/_nuxt/1-c05471d4.mjs"
  },
  "/_nuxt/1-d8cd43b3.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-qCmdlD39qpKnimyoZ0VGNe3AQ8E\"",
    "mtime": "2022-01-30T14:53:44.282Z",
    "path": "../public/_nuxt/1-d8cd43b3.mjs"
  },
  "/_nuxt/1-e0d26a19.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-IxWlQPHekVuBLwZyY6HcTm+e5aQ\"",
    "mtime": "2022-01-30T14:53:44.274Z",
    "path": "../public/_nuxt/1-e0d26a19.mjs"
  },
  "/_nuxt/1-f306a332.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-2ejLTvYq6os3kYMqDMWurBpR3dA\"",
    "mtime": "2022-01-30T14:53:44.266Z",
    "path": "../public/_nuxt/1-f306a332.mjs"
  },
  "/_nuxt/2-0e16b5fb.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-tKfVejLeAuXp2tILAjnIvGH7M/I\"",
    "mtime": "2022-01-30T14:53:44.262Z",
    "path": "../public/_nuxt/2-0e16b5fb.mjs"
  },
  "/_nuxt/2-10d595bc.mjs": {
    "type": "application/javascript",
    "etag": "\"72b-K/6LaLcdiDnE+gkzCN9gr/3VOpY\"",
    "mtime": "2022-01-30T14:53:44.262Z",
    "path": "../public/_nuxt/2-10d595bc.mjs"
  },
  "/_nuxt/2-317c810f.mjs": {
    "type": "application/javascript",
    "etag": "\"79c-993m3MRgr+0OP2GFsmPEfdFJVk0\"",
    "mtime": "2022-01-30T14:53:44.258Z",
    "path": "../public/_nuxt/2-317c810f.mjs"
  },
  "/_nuxt/2-49b96f3a.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-8ne3oFthZencpGfZ/RH+FBYtQbo\"",
    "mtime": "2022-01-30T14:53:44.254Z",
    "path": "../public/_nuxt/2-49b96f3a.mjs"
  },
  "/_nuxt/2-c563514c.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-UROCsA21FRWjNA0C8UmYzl9CLzs\"",
    "mtime": "2022-01-30T14:53:44.250Z",
    "path": "../public/_nuxt/2-c563514c.mjs"
  },
  "/_nuxt/2-f0969055.mjs": {
    "type": "application/javascript",
    "etag": "\"471-2aTWpPjxdVDJG+jyhBaIJiBttT0\"",
    "mtime": "2022-01-30T14:53:44.250Z",
    "path": "../public/_nuxt/2-f0969055.mjs"
  },
  "/_nuxt/3-1c81d83c.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-RUDjD/saSe0NUl2Qu0ubDtgFA9s\"",
    "mtime": "2022-01-30T14:53:44.246Z",
    "path": "../public/_nuxt/3-1c81d83c.mjs"
  },
  "/_nuxt/3-290f7316.mjs": {
    "type": "application/javascript",
    "etag": "\"480-WO5KHd88IczoIp70eFqIkk/ZFLY\"",
    "mtime": "2022-01-30T14:53:44.242Z",
    "path": "../public/_nuxt/3-290f7316.mjs"
  },
  "/_nuxt/3-9a68f392.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-J84tTxmbEo/AUR//n8gVZEsNM9g\"",
    "mtime": "2022-01-30T14:53:44.238Z",
    "path": "../public/_nuxt/3-9a68f392.mjs"
  },
  "/_nuxt/3-a0c1a3b3.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-lo1ng9ekuDsQM2pQBTQLreXaQHs\"",
    "mtime": "2022-01-30T14:53:44.238Z",
    "path": "../public/_nuxt/3-a0c1a3b3.mjs"
  },
  "/_nuxt/3-b646e838.mjs": {
    "type": "application/javascript",
    "etag": "\"7aa-4wS/cYuX50Cm+voMB0mMJiAAqds\"",
    "mtime": "2022-01-30T14:53:44.234Z",
    "path": "../public/_nuxt/3-b646e838.mjs"
  },
  "/_nuxt/4-281abcb0.mjs": {
    "type": "application/javascript",
    "etag": "\"afe-PjU0WvopH3hfAR1Lbea4Kk79tf0\"",
    "mtime": "2022-01-30T14:53:44.226Z",
    "path": "../public/_nuxt/4-281abcb0.mjs"
  },
  "/_nuxt/4-374e529c.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-VB/hnwzfRLzA62NYXuGxeXXa57A\"",
    "mtime": "2022-01-30T14:53:44.214Z",
    "path": "../public/_nuxt/4-374e529c.mjs"
  },
  "/_nuxt/4-48e37ce8.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-QtD19M2PpUtvoHZlkWqOqfyj69Q\"",
    "mtime": "2022-01-30T14:53:44.214Z",
    "path": "../public/_nuxt/4-48e37ce8.mjs"
  },
  "/_nuxt/4-9e2b86ea.mjs": {
    "type": "application/javascript",
    "etag": "\"562-K+bBrLPajuSTE3xI4lwE+4VyGGU\"",
    "mtime": "2022-01-30T14:53:44.210Z",
    "path": "../public/_nuxt/4-9e2b86ea.mjs"
  },
  "/_nuxt/4-ce70c31a.mjs": {
    "type": "application/javascript",
    "etag": "\"518-605QnvGZ5iluIbUb8i2LYTJlmIE\"",
    "mtime": "2022-01-30T14:53:44.206Z",
    "path": "../public/_nuxt/4-ce70c31a.mjs"
  },
  "/_nuxt/5-baecddbd.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-5et1u4cFW/bb1Ic2kKlMQjXYsVA\"",
    "mtime": "2022-01-30T14:53:44.206Z",
    "path": "../public/_nuxt/5-baecddbd.mjs"
  },
  "/_nuxt/5-cf49234c.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-CWQdZtp6TCYQSGBe5ihySZ367ys\"",
    "mtime": "2022-01-30T14:53:44.198Z",
    "path": "../public/_nuxt/5-cf49234c.mjs"
  },
  "/_nuxt/5-d94e390b.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-yG7UnCBQAJSB39hhkgm7D1kIIOQ\"",
    "mtime": "2022-01-30T14:53:44.198Z",
    "path": "../public/_nuxt/5-d94e390b.mjs"
  },
  "/_nuxt/5-e2ceed4d.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-BMM7DKTqlf7rrL1LgVmMMOL4qHk\"",
    "mtime": "2022-01-30T14:53:44.194Z",
    "path": "../public/_nuxt/5-e2ceed4d.mjs"
  },
  "/_nuxt/6-526b785d.mjs": {
    "type": "application/javascript",
    "etag": "\"652-HmjJp7CZLU6lE0R9VIzelTpBiLw\"",
    "mtime": "2022-01-30T14:53:44.194Z",
    "path": "../public/_nuxt/6-526b785d.mjs"
  },
  "/_nuxt/6-577e63d1.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-5iFpqQoOIcO4QfqrAI3hkgmI9P4\"",
    "mtime": "2022-01-30T14:53:44.190Z",
    "path": "../public/_nuxt/6-577e63d1.mjs"
  },
  "/_nuxt/6-a68e849d.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-yON8/F1O+T/Rb14IycJqp/3Tym8\"",
    "mtime": "2022-01-30T14:53:44.190Z",
    "path": "../public/_nuxt/6-a68e849d.mjs"
  },
  "/_nuxt/7-1336472b.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-xVOPKYGhxXjiTLTjCtgIkhBUVx0\"",
    "mtime": "2022-01-30T14:53:44.186Z",
    "path": "../public/_nuxt/7-1336472b.mjs"
  },
  "/_nuxt/7-e6304d6e.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-pHVMB43WM/N0hozdG6B/z2oNhs8\"",
    "mtime": "2022-01-30T14:53:44.186Z",
    "path": "../public/_nuxt/7-e6304d6e.mjs"
  },
  "/_nuxt/8-c925b656.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-Jy26XhWc99q2WL7HgrdKCvGBjm4\"",
    "mtime": "2022-01-30T14:53:44.182Z",
    "path": "../public/_nuxt/8-c925b656.mjs"
  },
  "/_nuxt/8-dc701e33.mjs": {
    "type": "application/javascript",
    "etag": "\"692-AZG7LcTE8Daiu/aI1FGlumFVfkA\"",
    "mtime": "2022-01-30T14:53:44.178Z",
    "path": "../public/_nuxt/8-dc701e33.mjs"
  },
  "/_nuxt/9-41d71c9f.mjs": {
    "type": "application/javascript",
    "etag": "\"435-pntCgSLdOCTTGVPfvy2mBzd0iy8\"",
    "mtime": "2022-01-30T14:53:44.178Z",
    "path": "../public/_nuxt/9-41d71c9f.mjs"
  },
  "/_nuxt/bootstrap-3d44acdd.mjs": {
    "type": "application/javascript",
    "etag": "\"239f0-rikbmnMiGeJl/j17WjYOt2HTIFg\"",
    "mtime": "2022-01-30T14:53:44.178Z",
    "path": "../public/_nuxt/bootstrap-3d44acdd.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-01-30T14:53:44.174Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-62b76fd5.mjs": {
    "type": "application/javascript",
    "etag": "\"65-QV+KVUoODFkrRkKSgm6AcI3qd1c\"",
    "mtime": "2022-01-30T14:53:44.174Z",
    "path": "../public/_nuxt/entry-62b76fd5.mjs"
  },
  "/_nuxt/index-645270d1.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-S0cUGnYY7YU6BFi9YUnROOgTMw8\"",
    "mtime": "2022-01-30T14:53:44.174Z",
    "path": "../public/_nuxt/index-645270d1.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"206d-a6HjLNrtv6njlRpFs9Q3xdtWc20\"",
    "mtime": "2022-01-30T14:53:44.174Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-decc80f1.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-gb1dUiKr19nQuvyFFqBfKygkTZs\"",
    "mtime": "2022-01-30T14:53:44.170Z",
    "path": "../public/_nuxt/welcome-decc80f1.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643554418";
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
