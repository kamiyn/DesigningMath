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
    "mtime": "2022-02-02T18:13:56.611Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/0-a0b105c2.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-5beX7Xp5iUMsTcv0Kuny/kdycig\"",
    "mtime": "2022-02-02T18:13:56.763Z",
    "path": "../public/_nuxt/0-a0b105c2.mjs"
  },
  "/_nuxt/1-00b2711a.mjs": {
    "type": "application/javascript",
    "etag": "\"44d-tT1TcCq4FMB2DJm54LXwXQasFCo\"",
    "mtime": "2022-02-02T18:13:56.759Z",
    "path": "../public/_nuxt/1-00b2711a.mjs"
  },
  "/_nuxt/1-44496200.mjs": {
    "type": "application/javascript",
    "etag": "\"525-3Sy63fhjqWe4+kWWJzlNFTvcnD0\"",
    "mtime": "2022-02-02T18:13:56.755Z",
    "path": "../public/_nuxt/1-44496200.mjs"
  },
  "/_nuxt/1-a8ecc52a.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-UqHyfepWvS/Qjz1w38LH717dnFE\"",
    "mtime": "2022-02-02T18:13:56.751Z",
    "path": "../public/_nuxt/1-a8ecc52a.mjs"
  },
  "/_nuxt/1-bf4e7ed3.mjs": {
    "type": "application/javascript",
    "etag": "\"539-WjIRsCAa/p7helrkEJjtm9SKnhM\"",
    "mtime": "2022-02-02T18:13:56.751Z",
    "path": "../public/_nuxt/1-bf4e7ed3.mjs"
  },
  "/_nuxt/1-c42ae906.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-CK5wrfiQ8vRUAh/BHh9jgrao8gE\"",
    "mtime": "2022-02-02T18:13:56.747Z",
    "path": "../public/_nuxt/1-c42ae906.mjs"
  },
  "/_nuxt/1-c89612f5.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-uCfRQJSWZPKQRv6LPxIbj8UNcqo\"",
    "mtime": "2022-02-02T18:13:56.739Z",
    "path": "../public/_nuxt/1-c89612f5.mjs"
  },
  "/_nuxt/1-ceebe596.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-SliNAdRCUVuiyy1xsdlFGpog2uU\"",
    "mtime": "2022-02-02T18:13:56.731Z",
    "path": "../public/_nuxt/1-ceebe596.mjs"
  },
  "/_nuxt/1-e092b021.mjs": {
    "type": "application/javascript",
    "etag": "\"6ee-TUWD1F3D7U0v2cwdlfdvGZjcUic\"",
    "mtime": "2022-02-02T18:13:56.731Z",
    "path": "../public/_nuxt/1-e092b021.mjs"
  },
  "/_nuxt/1-e1aaf43e.mjs": {
    "type": "application/javascript",
    "etag": "\"537-lDNSFvMYzhNvQBvg56LoUWKbCC4\"",
    "mtime": "2022-02-02T18:13:56.727Z",
    "path": "../public/_nuxt/1-e1aaf43e.mjs"
  },
  "/_nuxt/2-1394d39e.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-7kwLU1zSiWmG4UKbk85sKRREjAQ\"",
    "mtime": "2022-02-02T18:13:56.727Z",
    "path": "../public/_nuxt/2-1394d39e.mjs"
  },
  "/_nuxt/2-1d930072.mjs": {
    "type": "application/javascript",
    "etag": "\"623-OWogjUFt1bRUi4HhawoKG5pOOH4\"",
    "mtime": "2022-02-02T18:13:56.723Z",
    "path": "../public/_nuxt/2-1d930072.mjs"
  },
  "/_nuxt/2-1f56d610.mjs": {
    "type": "application/javascript",
    "etag": "\"5e7-AR6zr171ABwRBLoLJYBeIgjLeWY\"",
    "mtime": "2022-02-02T18:13:56.719Z",
    "path": "../public/_nuxt/2-1f56d610.mjs"
  },
  "/_nuxt/2-250eeb36.mjs": {
    "type": "application/javascript",
    "etag": "\"5df-HEfxhBXaaSIXh5e6oXGHn8Z2Kac\"",
    "mtime": "2022-02-02T18:13:56.715Z",
    "path": "../public/_nuxt/2-250eeb36.mjs"
  },
  "/_nuxt/2-489b9490.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-9pYuCOQRiLjESnVkMX5QP2pUKvc\"",
    "mtime": "2022-02-02T18:13:56.715Z",
    "path": "../public/_nuxt/2-489b9490.mjs"
  },
  "/_nuxt/2-8da0e516.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-D6pjdtKe8YgoVKM17+16LnK6XOM\"",
    "mtime": "2022-02-02T18:13:56.711Z",
    "path": "../public/_nuxt/2-8da0e516.mjs"
  },
  "/_nuxt/2-9d73bb8a.mjs": {
    "type": "application/javascript",
    "etag": "\"471-mz13F1dKl0sEPPF/7erxsZsmV8g\"",
    "mtime": "2022-02-02T18:13:56.711Z",
    "path": "../public/_nuxt/2-9d73bb8a.mjs"
  },
  "/_nuxt/2-d033d148.mjs": {
    "type": "application/javascript",
    "etag": "\"79c-Gvg9xu+rT7oloScw/OBfN8RJAjU\"",
    "mtime": "2022-02-02T18:13:56.707Z",
    "path": "../public/_nuxt/2-d033d148.mjs"
  },
  "/_nuxt/2-ed0f33bd.mjs": {
    "type": "application/javascript",
    "etag": "\"72b-H3xd9N3fagqxLK2onhUYHJZpSuM\"",
    "mtime": "2022-02-02T18:13:56.699Z",
    "path": "../public/_nuxt/2-ed0f33bd.mjs"
  },
  "/_nuxt/3-0152d2cb.mjs": {
    "type": "application/javascript",
    "etag": "\"5f3-MXy2X4zcZ0O6SLiZCjgFv6nZH2g\"",
    "mtime": "2022-02-02T18:13:56.699Z",
    "path": "../public/_nuxt/3-0152d2cb.mjs"
  },
  "/_nuxt/3-263b08f8.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-xQfC5ThZU2PDwnyI9ZWWpEWAMKI\"",
    "mtime": "2022-02-02T18:13:56.695Z",
    "path": "../public/_nuxt/3-263b08f8.mjs"
  },
  "/_nuxt/3-287dad87.mjs": {
    "type": "application/javascript",
    "etag": "\"73f-zi1QayN5PE4eit5NzKQHOkxJql8\"",
    "mtime": "2022-02-02T18:13:56.695Z",
    "path": "../public/_nuxt/3-287dad87.mjs"
  },
  "/_nuxt/3-3ea44d72.mjs": {
    "type": "application/javascript",
    "etag": "\"480-qC1YfiGrgB0ScNRkJbiCM561Iqk\"",
    "mtime": "2022-02-02T18:13:56.691Z",
    "path": "../public/_nuxt/3-3ea44d72.mjs"
  },
  "/_nuxt/3-6b723a2c.mjs": {
    "type": "application/javascript",
    "etag": "\"7aa-r35WcQmOOJGWNyKpATRzpgulLbU\"",
    "mtime": "2022-02-02T18:13:56.691Z",
    "path": "../public/_nuxt/3-6b723a2c.mjs"
  },
  "/_nuxt/3-cbe61572.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-H7t8c5UjemSieVLax4QUNLADSQE\"",
    "mtime": "2022-02-02T18:13:56.687Z",
    "path": "../public/_nuxt/3-cbe61572.mjs"
  },
  "/_nuxt/3-d5cc6148.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-MkqxFIFgaqHpuhoBHCyU+LLRItw\"",
    "mtime": "2022-02-02T18:13:56.687Z",
    "path": "../public/_nuxt/3-d5cc6148.mjs"
  },
  "/_nuxt/3-f851244c.mjs": {
    "type": "application/javascript",
    "etag": "\"691-Ah6g5wf3x3wJBcgGtMQfNPxjSys\"",
    "mtime": "2022-02-02T18:13:56.683Z",
    "path": "../public/_nuxt/3-f851244c.mjs"
  },
  "/_nuxt/4-0b9fc889.mjs": {
    "type": "application/javascript",
    "etag": "\"838-cVUvmTAm/VVMuOTWlnni/wJzTmc\"",
    "mtime": "2022-02-02T18:13:56.679Z",
    "path": "../public/_nuxt/4-0b9fc889.mjs"
  },
  "/_nuxt/4-75aec34a.mjs": {
    "type": "application/javascript",
    "etag": "\"7b9-eptxziaKM++gZZvgWfbVMUX/lS0\"",
    "mtime": "2022-02-02T18:13:56.675Z",
    "path": "../public/_nuxt/4-75aec34a.mjs"
  },
  "/_nuxt/4-856b44c5.mjs": {
    "type": "application/javascript",
    "etag": "\"562-DroQc4kfY+55bvzq963r/0Vq1Qc\"",
    "mtime": "2022-02-02T18:13:56.671Z",
    "path": "../public/_nuxt/4-856b44c5.mjs"
  },
  "/_nuxt/4-999db1cc.mjs": {
    "type": "application/javascript",
    "etag": "\"afe-fRZzjlKHdHobl1OReETEQnO/cjE\"",
    "mtime": "2022-02-02T18:13:56.671Z",
    "path": "../public/_nuxt/4-999db1cc.mjs"
  },
  "/_nuxt/4-cc5935f6.mjs": {
    "type": "application/javascript",
    "etag": "\"518-H2NwpEznNbLenVkaZrvF681OgV8\"",
    "mtime": "2022-02-02T18:13:56.667Z",
    "path": "../public/_nuxt/4-cc5935f6.mjs"
  },
  "/_nuxt/4-dbe7c636.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-sYbf97OoT9yUIZ7SpCxS2JBE9aA\"",
    "mtime": "2022-02-02T18:13:56.667Z",
    "path": "../public/_nuxt/4-dbe7c636.mjs"
  },
  "/_nuxt/4-e119c762.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-9MdRHL0ulhdScKhlkKWvsCGJYCg\"",
    "mtime": "2022-02-02T18:13:56.663Z",
    "path": "../public/_nuxt/4-e119c762.mjs"
  },
  "/_nuxt/4-fa83cc01.mjs": {
    "type": "application/javascript",
    "etag": "\"784-uGWY16OYC1Hvx9Hl3c/METU+lcY\"",
    "mtime": "2022-02-02T18:13:56.663Z",
    "path": "../public/_nuxt/4-fa83cc01.mjs"
  },
  "/_nuxt/5-59f583ee.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-1aZQ5T07GfkIptW9TskqEWptBhg\"",
    "mtime": "2022-02-02T18:13:56.659Z",
    "path": "../public/_nuxt/5-59f583ee.mjs"
  },
  "/_nuxt/5-c8aeef1e.mjs": {
    "type": "application/javascript",
    "etag": "\"8b1-s8DUA8XgqQlny3HjEgGr+Nbo7fs\"",
    "mtime": "2022-02-02T18:13:56.659Z",
    "path": "../public/_nuxt/5-c8aeef1e.mjs"
  },
  "/_nuxt/5-c926fc5f.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-a3Hfdk+2Vl2eBeup6pUMTvt7L1o\"",
    "mtime": "2022-02-02T18:13:56.659Z",
    "path": "../public/_nuxt/5-c926fc5f.mjs"
  },
  "/_nuxt/5-cd4f1520.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-hEJLcIDHr9+jUQdE32+XBVkCHhM\"",
    "mtime": "2022-02-02T18:13:56.651Z",
    "path": "../public/_nuxt/5-cd4f1520.mjs"
  },
  "/_nuxt/5-cd667cf7.mjs": {
    "type": "application/javascript",
    "etag": "\"779-Pn+mO3FH+5yFJsnGwJFAK96GBIM\"",
    "mtime": "2022-02-02T18:13:56.643Z",
    "path": "../public/_nuxt/5-cd667cf7.mjs"
  },
  "/_nuxt/5-e7e80e8d.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-cL74Tza0JMGTTS2e2P2J0EncrLU\"",
    "mtime": "2022-02-02T18:13:56.643Z",
    "path": "../public/_nuxt/5-e7e80e8d.mjs"
  },
  "/_nuxt/5-edb0370f.mjs": {
    "type": "application/javascript",
    "etag": "\"8bf-Xif7gTXO2m48WL6kYz4GUbhMUEc\"",
    "mtime": "2022-02-02T18:13:56.639Z",
    "path": "../public/_nuxt/5-edb0370f.mjs"
  },
  "/_nuxt/6-3363be9c.mjs": {
    "type": "application/javascript",
    "etag": "\"916-MmzzoHBd4MpOj14OtLHHbSHfbjk\"",
    "mtime": "2022-02-02T18:13:56.639Z",
    "path": "../public/_nuxt/6-3363be9c.mjs"
  },
  "/_nuxt/6-3e591d5a.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-Noa5tObqS6V2I1GwzBVeUqlurNI\"",
    "mtime": "2022-02-02T18:13:56.639Z",
    "path": "../public/_nuxt/6-3e591d5a.mjs"
  },
  "/_nuxt/6-43c72d12.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-f2MxMPGj8FeXyc6O/COjnvYV4aM\"",
    "mtime": "2022-02-02T18:13:56.635Z",
    "path": "../public/_nuxt/6-43c72d12.mjs"
  },
  "/_nuxt/6-7e1523c8.mjs": {
    "type": "application/javascript",
    "etag": "\"813-9CtpCrq8vMKYTIDjwaZeENXPiAk\"",
    "mtime": "2022-02-02T18:13:56.635Z",
    "path": "../public/_nuxt/6-7e1523c8.mjs"
  },
  "/_nuxt/6-a524f7f3.mjs": {
    "type": "application/javascript",
    "etag": "\"9ab-RxAgHM0nkVGeA7+i7BMZc60t6IA\"",
    "mtime": "2022-02-02T18:13:56.635Z",
    "path": "../public/_nuxt/6-a524f7f3.mjs"
  },
  "/_nuxt/6-e5b71d96.mjs": {
    "type": "application/javascript",
    "etag": "\"652-Jq2gye9wTPuxd0d02KxRYb6qUeY\"",
    "mtime": "2022-02-02T18:13:56.623Z",
    "path": "../public/_nuxt/6-e5b71d96.mjs"
  },
  "/_nuxt/7-742b8bea.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-Js5pSDXUqD8Eme4nkoZcBsLeXfQ\"",
    "mtime": "2022-02-02T18:13:56.623Z",
    "path": "../public/_nuxt/7-742b8bea.mjs"
  },
  "/_nuxt/7-e0907f7b.mjs": {
    "type": "application/javascript",
    "etag": "\"859-D/E1YAKHNxm5/LJkIE19ETXe4oo\"",
    "mtime": "2022-02-02T18:13:56.623Z",
    "path": "../public/_nuxt/7-e0907f7b.mjs"
  },
  "/_nuxt/7-ffe1bdc1.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-5MraEk1x9QtljvCK2ZkP8HM6Qc4\"",
    "mtime": "2022-02-02T18:13:56.619Z",
    "path": "../public/_nuxt/7-ffe1bdc1.mjs"
  },
  "/_nuxt/8-078436a8.mjs": {
    "type": "application/javascript",
    "etag": "\"692-pdg7c7qLD1D4x3iyqwLGTk1Y45M\"",
    "mtime": "2022-02-02T18:13:56.619Z",
    "path": "../public/_nuxt/8-078436a8.mjs"
  },
  "/_nuxt/8-64ef9551.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-2bvP0JMQ5HiEA1C03Rtkr+z7500\"",
    "mtime": "2022-02-02T18:13:56.619Z",
    "path": "../public/_nuxt/8-64ef9551.mjs"
  },
  "/_nuxt/9-c010d67f.mjs": {
    "type": "application/javascript",
    "etag": "\"435-6ELv6PU3WRYJ9kX0xAoAeh0+ggg\"",
    "mtime": "2022-02-02T18:13:56.615Z",
    "path": "../public/_nuxt/9-c010d67f.mjs"
  },
  "/_nuxt/bootstrap-ddf56d88.mjs": {
    "type": "application/javascript",
    "etag": "\"2a3f7-7+3uR0Hx3w6i0cCdRtQMnjRZDhw\"",
    "mtime": "2022-02-02T18:13:56.615Z",
    "path": "../public/_nuxt/bootstrap-ddf56d88.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-02-02T18:13:56.615Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-8ee19b9a.mjs": {
    "type": "application/javascript",
    "etag": "\"65-DCzgy8bRA/3usaHLAxHa5K4wfog\"",
    "mtime": "2022-02-02T18:13:56.615Z",
    "path": "../public/_nuxt/entry-8ee19b9a.mjs"
  },
  "/_nuxt/index-72d1cdce.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-NF2LuSwJsZOivUfbH6LRigQl8UU\"",
    "mtime": "2022-02-02T18:13:56.615Z",
    "path": "../public/_nuxt/index-72d1cdce.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"304f-nExd/rOA7eMDoKZCe7DXgNYb/E0\"",
    "mtime": "2022-02-02T18:13:56.615Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-45602119.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-Zz/RoHn9m+CH8lO2IlN5h5fnCWc\"",
    "mtime": "2022-02-02T18:13:56.611Z",
    "path": "../public/_nuxt/welcome-45602119.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643825631";
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
