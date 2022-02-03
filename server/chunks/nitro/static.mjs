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
    "mtime": "2022-02-03T12:05:17.189Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/0-950417fc.mjs": {
    "type": "application/javascript",
    "etag": "\"39b-n35bvwd2JuyBivEUn48J0mGJHIg\"",
    "mtime": "2022-02-03T12:05:17.405Z",
    "path": "../public/_nuxt/0-950417fc.mjs"
  },
  "/_nuxt/1-0f498621.mjs": {
    "type": "application/javascript",
    "etag": "\"44e-s6/HEUQE9mwyuY1dc33vktnc8TA\"",
    "mtime": "2022-02-03T12:05:17.401Z",
    "path": "../public/_nuxt/1-0f498621.mjs"
  },
  "/_nuxt/1-120e3f58.mjs": {
    "type": "application/javascript",
    "etag": "\"3bb-ktW0Ay9HFspYvmC04SR1a4ZbxXo\"",
    "mtime": "2022-02-03T12:05:17.393Z",
    "path": "../public/_nuxt/1-120e3f58.mjs"
  },
  "/_nuxt/1-1d599d07.mjs": {
    "type": "application/javascript",
    "etag": "\"7b3-tgpfKKwZovg1oizRDqq60HrfjrA\"",
    "mtime": "2022-02-03T12:05:17.393Z",
    "path": "../public/_nuxt/1-1d599d07.mjs"
  },
  "/_nuxt/1-23452263.mjs": {
    "type": "application/javascript",
    "etag": "\"452-6y6pLrOjwvBsNwNLHkGsmKSoyVI\"",
    "mtime": "2022-02-03T12:05:17.381Z",
    "path": "../public/_nuxt/1-23452263.mjs"
  },
  "/_nuxt/1-3d4f59a8.mjs": {
    "type": "application/javascript",
    "etag": "\"3d0-DQ9m5J1sQQ9BLAwoYKgTW7S3aoI\"",
    "mtime": "2022-02-03T12:05:17.377Z",
    "path": "../public/_nuxt/1-3d4f59a8.mjs"
  },
  "/_nuxt/1-9263f36a.mjs": {
    "type": "application/javascript",
    "etag": "\"4b8-362ZLxtVEVVKpvVLxFyteRKhO+0\"",
    "mtime": "2022-02-03T12:05:17.373Z",
    "path": "../public/_nuxt/1-9263f36a.mjs"
  },
  "/_nuxt/1-ac970126.mjs": {
    "type": "application/javascript",
    "etag": "\"537-Dy+LA7N5uGaMeUdOU8pJzpDdyPA\"",
    "mtime": "2022-02-03T12:05:17.369Z",
    "path": "../public/_nuxt/1-ac970126.mjs"
  },
  "/_nuxt/1-cd0d9f1e.mjs": {
    "type": "application/javascript",
    "etag": "\"539-FUMxtYdfsr5R5+Dloe8Th0txCkU\"",
    "mtime": "2022-02-03T12:05:17.365Z",
    "path": "../public/_nuxt/1-cd0d9f1e.mjs"
  },
  "/_nuxt/1-dbc68a8a.mjs": {
    "type": "application/javascript",
    "etag": "\"52f-0g5sCYV/qYD7F+MVV1y6vD6/vMI\"",
    "mtime": "2022-02-03T12:05:17.361Z",
    "path": "../public/_nuxt/1-dbc68a8a.mjs"
  },
  "/_nuxt/1-fdc783c0.mjs": {
    "type": "application/javascript",
    "etag": "\"6ee-p8XOaG1c9vBq3pudh0cyhiZctNY\"",
    "mtime": "2022-02-03T12:05:17.357Z",
    "path": "../public/_nuxt/1-fdc783c0.mjs"
  },
  "/_nuxt/2-1fa91295.mjs": {
    "type": "application/javascript",
    "etag": "\"4a1-AIsdf7vAu5BwtFKV/l/zgF1T2Rk\"",
    "mtime": "2022-02-03T12:05:17.353Z",
    "path": "../public/_nuxt/2-1fa91295.mjs"
  },
  "/_nuxt/2-3e3fd2da.mjs": {
    "type": "application/javascript",
    "etag": "\"3b3-PotrkbFGcGPBZR13PZmeJuKlcVI\"",
    "mtime": "2022-02-03T12:05:17.349Z",
    "path": "../public/_nuxt/2-3e3fd2da.mjs"
  },
  "/_nuxt/2-43456337.mjs": {
    "type": "application/javascript",
    "etag": "\"92f-fvb2We/zvhu/WMQj/Q08IGjX16o\"",
    "mtime": "2022-02-03T12:05:17.345Z",
    "path": "../public/_nuxt/2-43456337.mjs"
  },
  "/_nuxt/2-4eff46b8.mjs": {
    "type": "application/javascript",
    "etag": "\"5df-Hf2A++vwhPwpUPbCZIw3kd3n+yM\"",
    "mtime": "2022-02-03T12:05:17.341Z",
    "path": "../public/_nuxt/2-4eff46b8.mjs"
  },
  "/_nuxt/2-5f563bea.mjs": {
    "type": "application/javascript",
    "etag": "\"79c-xnbKa2Yh1IfoVw4Qtgfi5Db1yno\"",
    "mtime": "2022-02-03T12:05:17.337Z",
    "path": "../public/_nuxt/2-5f563bea.mjs"
  },
  "/_nuxt/2-6c605b76.mjs": {
    "type": "application/javascript",
    "etag": "\"4e1-m/jb+TpTeqbAYPPwnJrBo2RiVec\"",
    "mtime": "2022-02-03T12:05:17.329Z",
    "path": "../public/_nuxt/2-6c605b76.mjs"
  },
  "/_nuxt/2-732814d9.mjs": {
    "type": "application/javascript",
    "etag": "\"623-bx/1hYvc5sWeQ9Ft+DlFn2yKJV0\"",
    "mtime": "2022-02-03T12:05:17.329Z",
    "path": "../public/_nuxt/2-732814d9.mjs"
  },
  "/_nuxt/2-9746ba1a.mjs": {
    "type": "application/javascript",
    "etag": "\"471-S5NRD9tMtWGMSX1UvT+3U0nP3YM\"",
    "mtime": "2022-02-03T12:05:17.325Z",
    "path": "../public/_nuxt/2-9746ba1a.mjs"
  },
  "/_nuxt/2-e8832ec4.mjs": {
    "type": "application/javascript",
    "etag": "\"730-1E7fVyHD0juE51cozwxKwSKcG8A\"",
    "mtime": "2022-02-03T12:05:17.321Z",
    "path": "../public/_nuxt/2-e8832ec4.mjs"
  },
  "/_nuxt/2-f16a363f.mjs": {
    "type": "application/javascript",
    "etag": "\"5e7-H27R88SIe3ALkuPqhZ98fQA312U\"",
    "mtime": "2022-02-03T12:05:17.317Z",
    "path": "../public/_nuxt/2-f16a363f.mjs"
  },
  "/_nuxt/3-181605ba.mjs": {
    "type": "application/javascript",
    "etag": "\"480-ATSTNI3TA/tau+IKJ68hloKGH+0\"",
    "mtime": "2022-02-03T12:05:17.313Z",
    "path": "../public/_nuxt/3-181605ba.mjs"
  },
  "/_nuxt/3-38d86613.mjs": {
    "type": "application/javascript",
    "etag": "\"50a-VKQgtLSqBOwTXkMcgUFo2GK4Cu4\"",
    "mtime": "2022-02-03T12:05:17.313Z",
    "path": "../public/_nuxt/3-38d86613.mjs"
  },
  "/_nuxt/3-be04c09c.mjs": {
    "type": "application/javascript",
    "etag": "\"5f3-txvTd8vverBIjmb/OOd0ImUmqGI\"",
    "mtime": "2022-02-03T12:05:17.305Z",
    "path": "../public/_nuxt/3-be04c09c.mjs"
  },
  "/_nuxt/3-be258184.mjs": {
    "type": "application/javascript",
    "etag": "\"5ce-zKcoHaSrYnwy5pt4apyw+Q9uM90\"",
    "mtime": "2022-02-03T12:05:17.305Z",
    "path": "../public/_nuxt/3-be258184.mjs"
  },
  "/_nuxt/3-d23ae30e.mjs": {
    "type": "application/javascript",
    "etag": "\"7aa-jIc5fKWPj06uEeAdNclztoHldT0\"",
    "mtime": "2022-02-03T12:05:17.301Z",
    "path": "../public/_nuxt/3-d23ae30e.mjs"
  },
  "/_nuxt/3-d4deaa45.mjs": {
    "type": "application/javascript",
    "etag": "\"73f-Z4HvWJ/kaM6eKX0ScrYh4mbXP7k\"",
    "mtime": "2022-02-03T12:05:17.297Z",
    "path": "../public/_nuxt/3-d4deaa45.mjs"
  },
  "/_nuxt/3-d89a95ea.mjs": {
    "type": "application/javascript",
    "etag": "\"4ad-B76yHQ3XuuEmqFDiCrojVNC6Lss\"",
    "mtime": "2022-02-03T12:05:17.297Z",
    "path": "../public/_nuxt/3-d89a95ea.mjs"
  },
  "/_nuxt/3-d95b5e2a.mjs": {
    "type": "application/javascript",
    "etag": "\"9da-rknCWdoOAsyGJboqOFd/uaQAGco\"",
    "mtime": "2022-02-03T12:05:17.293Z",
    "path": "../public/_nuxt/3-d95b5e2a.mjs"
  },
  "/_nuxt/3-ea956a67.mjs": {
    "type": "application/javascript",
    "etag": "\"691-eWFNQZv+r340UMuJ49ev5eaUhTM\"",
    "mtime": "2022-02-03T12:05:17.289Z",
    "path": "../public/_nuxt/3-ea956a67.mjs"
  },
  "/_nuxt/4-00a1c904.mjs": {
    "type": "application/javascript",
    "etag": "\"9f7-BD3DLQcUO0zxwvBgiqbkfxxLbCk\"",
    "mtime": "2022-02-03T12:05:17.285Z",
    "path": "../public/_nuxt/4-00a1c904.mjs"
  },
  "/_nuxt/4-27ebaa72.mjs": {
    "type": "application/javascript",
    "etag": "\"49b-efuFWcOYm+mswIkrcEsRn4WSpEE\"",
    "mtime": "2022-02-03T12:05:17.285Z",
    "path": "../public/_nuxt/4-27ebaa72.mjs"
  },
  "/_nuxt/4-41b7d021.mjs": {
    "type": "application/javascript",
    "etag": "\"838-/F9ahv0OLOwpORb7Yesqgi+0wrA\"",
    "mtime": "2022-02-03T12:05:17.281Z",
    "path": "../public/_nuxt/4-41b7d021.mjs"
  },
  "/_nuxt/4-670c2858.mjs": {
    "type": "application/javascript",
    "etag": "\"518-xsuXZ74oqiVWVNtrMliFFPEw7so\"",
    "mtime": "2022-02-03T12:05:17.277Z",
    "path": "../public/_nuxt/4-670c2858.mjs"
  },
  "/_nuxt/4-6ae6274d.mjs": {
    "type": "application/javascript",
    "etag": "\"afe-ObiSSj7agvwje39VGr2NCtzCUYE\"",
    "mtime": "2022-02-03T12:05:17.277Z",
    "path": "../public/_nuxt/4-6ae6274d.mjs"
  },
  "/_nuxt/4-c565d670.mjs": {
    "type": "application/javascript",
    "etag": "\"64c-TzDaovDyDwbjEwaxeaiX6pw0E6U\"",
    "mtime": "2022-02-03T12:05:17.269Z",
    "path": "../public/_nuxt/4-c565d670.mjs"
  },
  "/_nuxt/4-cacab3f7.mjs": {
    "type": "application/javascript",
    "etag": "\"784-oLpEd+JiB13QinJDe0fuOw4xQHw\"",
    "mtime": "2022-02-03T12:05:17.269Z",
    "path": "../public/_nuxt/4-cacab3f7.mjs"
  },
  "/_nuxt/4-ebb6f989.mjs": {
    "type": "application/javascript",
    "etag": "\"7b9-D+mju3PPcVQkCN+RqGTcAHgz0Yk\"",
    "mtime": "2022-02-03T12:05:17.265Z",
    "path": "../public/_nuxt/4-ebb6f989.mjs"
  },
  "/_nuxt/4-ee473c31.mjs": {
    "type": "application/javascript",
    "etag": "\"562-uzWRLeq6Mo5ZuFkt5djawe8u1O4\"",
    "mtime": "2022-02-03T12:05:17.261Z",
    "path": "../public/_nuxt/4-ee473c31.mjs"
  },
  "/_nuxt/5-1f4796f5.mjs": {
    "type": "application/javascript",
    "etag": "\"5c2-ldZs5soyPWolFxOsd/JBTSkBU04\"",
    "mtime": "2022-02-03T12:05:17.261Z",
    "path": "../public/_nuxt/5-1f4796f5.mjs"
  },
  "/_nuxt/5-236f34a4.mjs": {
    "type": "application/javascript",
    "etag": "\"8b1-YWTx0FtfbO/jCjYsezt7Q7sFjr8\"",
    "mtime": "2022-02-03T12:05:17.245Z",
    "path": "../public/_nuxt/5-236f34a4.mjs"
  },
  "/_nuxt/5-496692cd.mjs": {
    "type": "application/javascript",
    "etag": "\"8bf-ZFrK6RnKNa0eK4KZlCb+PFFZx6s\"",
    "mtime": "2022-02-03T12:05:17.245Z",
    "path": "../public/_nuxt/5-496692cd.mjs"
  },
  "/_nuxt/5-4fb8a2f3.mjs": {
    "type": "application/javascript",
    "etag": "\"4fa-Ojnvasi1f8FJfIO6dZniUB3ARGk\"",
    "mtime": "2022-02-03T12:05:17.237Z",
    "path": "../public/_nuxt/5-4fb8a2f3.mjs"
  },
  "/_nuxt/5-af4e2984.mjs": {
    "type": "application/javascript",
    "etag": "\"779-GJaR0c6KOuMOzkSdf+xpPRosruY\"",
    "mtime": "2022-02-03T12:05:17.233Z",
    "path": "../public/_nuxt/5-af4e2984.mjs"
  },
  "/_nuxt/5-bf91d5f1.mjs": {
    "type": "application/javascript",
    "etag": "\"11bf-JRTmUG05aOQ3caSpOnL8F7zRudc\"",
    "mtime": "2022-02-03T12:05:17.233Z",
    "path": "../public/_nuxt/5-bf91d5f1.mjs"
  },
  "/_nuxt/5-c8d33f3e.mjs": {
    "type": "application/javascript",
    "etag": "\"65c-N446BUlFfSiXhjO3eM2IWadTsKo\"",
    "mtime": "2022-02-03T12:05:17.233Z",
    "path": "../public/_nuxt/5-c8d33f3e.mjs"
  },
  "/_nuxt/5-fcf5637d.mjs": {
    "type": "application/javascript",
    "etag": "\"51b-aVjUcp53LbmoeUXUusM3j2bBPmk\"",
    "mtime": "2022-02-03T12:05:17.229Z",
    "path": "../public/_nuxt/5-fcf5637d.mjs"
  },
  "/_nuxt/6-05e691d9.mjs": {
    "type": "application/javascript",
    "etag": "\"51d-IPK3Ay/fJG3sFLyPb9gQUWZFCuU\"",
    "mtime": "2022-02-03T12:05:17.225Z",
    "path": "../public/_nuxt/6-05e691d9.mjs"
  },
  "/_nuxt/6-07da3146.mjs": {
    "type": "application/javascript",
    "etag": "\"9ab-VhsfOzH/kE892DjMkQ9aDcjO4oY\"",
    "mtime": "2022-02-03T12:05:17.225Z",
    "path": "../public/_nuxt/6-07da3146.mjs"
  },
  "/_nuxt/6-b04de09c.mjs": {
    "type": "application/javascript",
    "etag": "\"5fa-5/lMuz330BRh9szIQaBoHjME8c8\"",
    "mtime": "2022-02-03T12:05:17.217Z",
    "path": "../public/_nuxt/6-b04de09c.mjs"
  },
  "/_nuxt/6-b46f40aa.mjs": {
    "type": "application/javascript",
    "etag": "\"813-Xc1fpdlg3cwXpSSUCdiZlZ1Sd4k\"",
    "mtime": "2022-02-03T12:05:17.213Z",
    "path": "../public/_nuxt/6-b46f40aa.mjs"
  },
  "/_nuxt/6-d34b7d2e.mjs": {
    "type": "application/javascript",
    "etag": "\"916-1S3HmRKxtc+4w+flZ1nMbiwEnSk\"",
    "mtime": "2022-02-03T12:05:17.213Z",
    "path": "../public/_nuxt/6-d34b7d2e.mjs"
  },
  "/_nuxt/6-f14110c0.mjs": {
    "type": "application/javascript",
    "etag": "\"652-zJQYYY60LbIRb7GuS5dwezmkgLo\"",
    "mtime": "2022-02-03T12:05:17.213Z",
    "path": "../public/_nuxt/6-f14110c0.mjs"
  },
  "/_nuxt/7-6cb6c5a0.mjs": {
    "type": "application/javascript",
    "etag": "\"62e-UawF3AYD2Q7p2FPp7T6ViEt7I+Y\"",
    "mtime": "2022-02-03T12:05:17.205Z",
    "path": "../public/_nuxt/7-6cb6c5a0.mjs"
  },
  "/_nuxt/7-88effb40.mjs": {
    "type": "application/javascript",
    "etag": "\"3fa-BA5nC1q+5pS4R5lXv15hTrMVZds\"",
    "mtime": "2022-02-03T12:05:17.201Z",
    "path": "../public/_nuxt/7-88effb40.mjs"
  },
  "/_nuxt/7-d81f92d5.mjs": {
    "type": "application/javascript",
    "etag": "\"859-6xrQ7TrRKNBVa6+NpH85TGFETbM\"",
    "mtime": "2022-02-03T12:05:17.201Z",
    "path": "../public/_nuxt/7-d81f92d5.mjs"
  },
  "/_nuxt/8-4de514d1.mjs": {
    "type": "application/javascript",
    "etag": "\"692-JrPlI8z8sleZPCOXJCHrKALkK+Q\"",
    "mtime": "2022-02-03T12:05:17.201Z",
    "path": "../public/_nuxt/8-4de514d1.mjs"
  },
  "/_nuxt/8-f07d91b9.mjs": {
    "type": "application/javascript",
    "etag": "\"3e7-3+s6474gLjWjExHtYKICsrejZAM\"",
    "mtime": "2022-02-03T12:05:17.197Z",
    "path": "../public/_nuxt/8-f07d91b9.mjs"
  },
  "/_nuxt/9-10f04e60.mjs": {
    "type": "application/javascript",
    "etag": "\"435-hfeEKgkhfKuEQAGptAX+2WDdj44\"",
    "mtime": "2022-02-03T12:05:17.197Z",
    "path": "../public/_nuxt/9-10f04e60.mjs"
  },
  "/_nuxt/bootstrap-10f9cadf.mjs": {
    "type": "application/javascript",
    "etag": "\"2d107-1kFF1oFwSl4wErL11DbiRjMVn0g\"",
    "mtime": "2022-02-03T12:05:17.197Z",
    "path": "../public/_nuxt/bootstrap-10f9cadf.mjs"
  },
  "/_nuxt/bootstrap.b2dec39c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"84-kSiGzOHO/2zXLZkuRd9LTSlOQtU\"",
    "mtime": "2022-02-03T12:05:17.193Z",
    "path": "../public/_nuxt/bootstrap.b2dec39c.css"
  },
  "/_nuxt/entry-b76cb053.mjs": {
    "type": "application/javascript",
    "etag": "\"65-0tr+GcRNA/w5qJfOCIZK0Q8pMa8\"",
    "mtime": "2022-02-03T12:05:17.193Z",
    "path": "../public/_nuxt/entry-b76cb053.mjs"
  },
  "/_nuxt/index-e093f59f.mjs": {
    "type": "application/javascript",
    "etag": "\"cd-V0LbOaNTPig4Ma/WZiSqjWPd+BI\"",
    "mtime": "2022-02-03T12:05:17.193Z",
    "path": "../public/_nuxt/index-e093f59f.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"347d-EyA0sub2smBfrEVWSBNkaJfQ5vU\"",
    "mtime": "2022-02-03T12:05:17.193Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/welcome-00810e0b.mjs": {
    "type": "application/javascript",
    "etag": "\"2dfc-QP5yaTsusXASP0V2/c8QWxz0kQ0\"",
    "mtime": "2022-02-03T12:05:17.193Z",
    "path": "../public/_nuxt/welcome-00810e0b.mjs"
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
const STATIC_ASSETS_BASE = "/_nuxt/home/runner/work/DesigningMath/DesigningMath/dist" + "/" + "1643889911";
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
