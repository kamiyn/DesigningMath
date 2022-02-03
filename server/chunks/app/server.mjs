import { v as vue_cjs_prod, r as require$$0, s as serverRenderer } from '../index.mjs';
import 'unenv/runtime/mock/proxy';
import 'stream';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const entry$1 = (ctx) => Promise.resolve().then(function() {
  return bootstrap$1;
}).then((m) => m.default(ctx));
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serialCaller(hooks, args) {
  return hooks.reduce((promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)), Promise.resolve(null));
}
function parallelCaller(hooks, args) {
  return Promise.all(hooks.map((hook) => hook.apply(void 0, args)));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    return serialCaller(this._hooks[name] || [], args);
  }
  callHookParallel(name, ...args) {
    return parallelCaller(this._hooks[name] || [], args);
  }
  callHookWith(caller, name, ...args) {
    return caller(this._hooks[name] || [], args);
  }
}
function createHooks() {
  return new Hookable();
}
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = new Set([
  "store",
  "spa",
  "fetchCounters"
]);
const todo = new Set([
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const staticFlags = {
  isClient: false,
  isServer: true,
  isDev: false,
  isStatic: void 0,
  target: "server",
  modern: false
};
const legacyPlugin = (nuxtApp) => {
  nuxtApp._legacyContext = new Proxy(nuxtApp, {
    get(nuxt, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxtApp)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt.$router.currentRoute.value[p];
        }
      }
      if (p === "$config" || p === "env") {
        return useRuntimeConfig();
      }
      if (p in staticFlags) {
        return staticFlags[p];
      }
      if (p === "ssrContext") {
        return nuxt._legacyContext;
      }
      if (nuxt.ssrContext && p in nuxt.ssrContext) {
        return nuxt.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt.payload;
      }
      if (p === "nuxtState") {
        return nuxt.payload.data;
      }
      if (p in nuxtApp.vueApp) {
        return nuxtApp.vueApp[p];
      }
      if (p in nuxtApp) {
        return nuxtApp[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = __spreadValues({
    provide: void 0,
    globalName: "nuxt",
    payload: vue_cjs_prod.reactive(__spreadValues({
      data: {},
      state: {},
      _errors: {}
    }, { serverRendered: true })),
    isHydrating: false,
    _asyncDataPromises: {}
  }, options);
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.nuxt = nuxtApp;
  }
  {
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    nuxtApp.ssrContext.payload = nuxtApp.payload;
  }
  {
    nuxtApp.provide("config", options.ssrContext.runtimeConfig.private);
    nuxtApp.payload.config = options.ssrContext.runtimeConfig.public;
  }
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide } = await callWithNuxt(nuxtApp, () => plugin(nuxtApp)) || {};
  if (provide && typeof provide === "object") {
    for (const key in provide) {
      nuxtApp.provide(key, provide[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return () => {
      };
    }
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxtApp) => plugin(nuxtApp._legacyContext, nuxtApp.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
let currentNuxtAppInstance;
const setNuxtAppInstance = (nuxt) => {
  currentNuxtAppInstance = nuxt;
};
function callWithNuxt(nuxt, setup) {
  setNuxtAppInstance(nuxt);
  const p = setup();
  {
    setNuxtAppInstance(null);
  }
  return p;
}
function useNuxtApp() {
  const vm = vue_cjs_prod.getCurrentInstance();
  if (!vm) {
    if (!currentNuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return currentNuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vueRouter_cjs_prod = {};
/*!
  * vue-router v4.0.12
  * (c) 2021 Eduardo San Martin Morote
  * @license MIT
  */
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var vue = require$$0;
  const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
  const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
  const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
  const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
  const routerKey = /* @__PURE__ */ PolySymbol("r");
  const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
  const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
  function isESModule(obj) {
    return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const TRAILING_SLASH_RE2 = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE2, "");
  function parseURL2(parseQuery3, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const searchPos = location2.indexOf("?");
    const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery3(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash,
      path,
      query,
      hash
    };
  }
  function stringifyURL(stringifyQuery3, location2) {
    const query = location2.query ? stringifyQuery3(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery3, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery3(a.query) === stringifyQuery3(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (position === 1 || segment === ".")
        continue;
      if (segment === "..")
        position--;
      else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  const START = "";
  function normalizeBase(base) {
    if (!base) {
      {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset
  });
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener);
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign({}, historyState.value, history2.state, {
        forward: to,
        scroll: computeScrollPosition()
      });
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function createMemoryHistory(base = "") {
    let listeners = [];
    let queue = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location2) {
      position++;
      if (position === queue.length) {
        queue.push(location2);
      } else {
        queue.splice(position);
        queue.push(location2);
      }
    }
    function triggerListeners(to, from, { direction, delta }) {
      const info = {
        direction,
        delta,
        type: NavigationType.pop
      };
      for (const callback of listeners) {
        callback(to, from, info);
      }
    }
    const routerHistory = {
      location: START,
      state: {},
      base,
      createHref: createHref.bind(null, base),
      replace(to) {
        queue.splice(position--, 1);
        setLocation(to);
      },
      push(to, data) {
        setLocation(to);
      },
      listen(callback) {
        listeners.push(callback);
        return () => {
          const index2 = listeners.indexOf(callback);
          if (index2 > -1)
            listeners.splice(index2, 1);
        };
      },
      destroy() {
        listeners = [];
        queue = [START];
        position = 0;
      },
      go(delta, shouldTrigger = true) {
        const from = this.location;
        const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
        position = Math.max(0, Math.min(position + delta, queue.length - 1));
        if (shouldTrigger) {
          triggerListeners(this.location, from, {
            direction,
            delta
          });
        }
      }
    };
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => queue[position]
    });
    return routerHistory;
  }
  function createWebHashHistory(base) {
    base = location.host ? base || location.pathname + location.search : "";
    if (!base.includes("#"))
      base += "#";
    return createWebHistory(base);
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
  exports.NavigationFailureType = void 0;
  (function(NavigationFailureType) {
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [1]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [2]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type, params) {
    {
      return assign(new Error(ErrorTypeMessages[type](params)), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const propertiesToLog = ["params", "query", "hash"];
  function stringifyRoute(to) {
    if (typeof to === "string")
      return to;
    if ("path" in to)
      return to.path;
    const location2 = {};
    for (const key of propertiesToLog) {
      if (key in to)
        location2[key] = to[key];
    }
    return JSON.stringify(location2, null, 2);
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [90];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (Array.isArray(param) && !repeatable)
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            const text = Array.isArray(param) ? param.join("/") : param;
            if (!text) {
              if (optional) {
                if (segment.length < 2) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text;
          }
        }
      }
      return path;
    }
    return {
      re,
      score,
      keys,
      parse,
      stringify
    };
  }
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    return bScore.length - aScore.length;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [[]];
    if (path === "/")
      return [[ROOT_TOKEN]];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent,
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes2, globalOptions) {
    const matchers = [];
    const matcherMap = new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if ("children" in mainNormalizedRecord) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        insertMatcher(matcher);
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index2 = matchers.indexOf(matcherRef);
        if (index2 > -1) {
          matchers.splice(index2, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0)
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes2.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: new Set(),
      updateGuards: new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || {} : { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "boolean" ? props : props[name];
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta2, record) => assign(meta2, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  const HASH_RE2 = /#/g;
  const AMPERSAND_RE2 = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE2 = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE2 = /\+/g;
  const ENC_BRACKET_OPEN_RE2 = /%5B/g;
  const ENC_BRACKET_CLOSE_RE2 = /%5D/g;
  const ENC_CARET_RE2 = /%5E/g;
  const ENC_BACKTICK_RE2 = /%60/g;
  const ENC_CURLY_OPEN_RE2 = /%7B/g;
  const ENC_PIPE_RE2 = /%7C/g;
  const ENC_CURLY_CLOSE_RE2 = /%7D/g;
  const ENC_SPACE_RE2 = /%20/g;
  function commonEncode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE2, "|").replace(ENC_BRACKET_OPEN_RE2, "[").replace(ENC_BRACKET_CLOSE_RE2, "]");
  }
  function encodeHash(text) {
    return commonEncode(text).replace(ENC_CURLY_OPEN_RE2, "{").replace(ENC_CURLY_CLOSE_RE2, "}").replace(ENC_CARET_RE2, "^");
  }
  function encodeQueryValue2(text) {
    return commonEncode(text).replace(PLUS_RE2, "%2B").replace(ENC_SPACE_RE2, "+").replace(HASH_RE2, "%23").replace(AMPERSAND_RE2, "%26").replace(ENC_BACKTICK_RE2, "`").replace(ENC_CURLY_OPEN_RE2, "{").replace(ENC_CURLY_CLOSE_RE2, "}").replace(ENC_CARET_RE2, "^");
  }
  function encodeQueryKey2(text) {
    return encodeQueryValue2(text).replace(EQUAL_RE2, "%3D");
  }
  function encodePath(text) {
    return commonEncode(text).replace(HASH_RE2, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text) {
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
  }
  function decode2(text) {
    try {
      return decodeURIComponent("" + text);
    } catch (err) {
    }
    return "" + text;
  }
  function parseQuery2(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE2, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode2(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode2(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!Array.isArray(currentValue)) {
          currentValue = query[key] = [currentValue];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery2(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey2(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue2(v)) : [value && encodeQueryValue2(value)];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  function useCallbacks() {
    let handlers = [];
    function add(handler) {
      handlers.push(handler);
      return () => {
        const i = handlers.indexOf(handler);
        if (i > -1)
          handlers.splice(i, 1);
      };
    }
    function reset() {
      handlers = [];
    }
    return {
      add,
      list: () => handlers,
      reset
    };
  }
  function registerGuard(record, name, guard) {
    const removeFromList = () => {
      record[name].delete(guard);
    };
    vue.onUnmounted(removeFromList);
    vue.onDeactivated(removeFromList);
    vue.onActivated(() => {
      record[name].add(guard);
    });
    record[name].add(guard);
  }
  function onBeforeRouteLeave(leaveGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "leaveGuards", leaveGuard);
  }
  function onBeforeRouteUpdate(updateGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "updateGuards", updateGuard);
  }
  function guardToPromiseFn(guard, to, from, record, name) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next = (valid) => {
        if (valid === false)
          reject(createRouterError(4, {
            from,
            to
          }));
        else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
            enterCallbackArray.push(valid);
          resolve();
        }
      };
      const guardReturn = guard.call(record && record.instances[name], to, from, next);
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function useLink(props) {
    const router = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index2 > -1)
        return index2;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router[vue.unref(props.replace) ? "replace" : "push"](vue.unref(props.to)).catch(noop);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    setup(props, { attrs, slots }) {
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const depth = vue.inject(viewDepthKey, 0);
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
      vue.provide(viewDepthKey, depth + 1);
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[props.name];
        const currentName = props.name;
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[props.name];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, { Component: component, route }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery2;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery2;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode2);
    function addRoute(parentOrRoute, route) {
      let parent;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL2(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode2(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if ("path" in rawLocation) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL2(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash,
        query: stringifyQuery$1 === stringifyQuery2 ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL2(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
          state: data,
          force,
          replace: replace2
        }), redirectedFrom || targetLocation);
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll();
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? error : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(assign(locationAsObject(failure2.to), {
              state: data,
              force,
              replace: replace2
            }), redirectedFrom || toLocation);
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of to.matched) {
          if (record.beforeEnter && !from.matched.includes(record)) {
            if (Array.isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      for (const guard of afterGuards.list())
        guard(to, from, failure);
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = {};
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll();
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        const toLocation = resolve(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(error.to, toLocation).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info.delta)
            routerHistory.go(-info.delta, false);
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(toLocation, from, false);
          if (failure) {
            if (info.delta) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop);
      });
    }
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorHandlers.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve2, reject) => {
        readyHandlers.add([resolve2, reject]);
      });
    }
    function markAsReady(err) {
      if (ready)
        return;
      ready = true;
      setupListeners();
      readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
      readyHandlers.reset();
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      return Promise.resolve();
    }
    const go = (delta) => routerHistory.go(delta);
    const installedApps = new Set();
    const router = {
      currentRoute,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorHandlers.add,
      isReady,
      install(app) {
        const router2 = this;
        app.component("RouterLink", RouterLink);
        app.component("RouterView", RouterView);
        app.config.globalProperties.$router = router2;
        Object.defineProperty(app.config.globalProperties, "$route", {
          enumerable: true,
          get: () => vue.unref(currentRoute)
        });
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router2);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            currentRoute.value = START_LOCATION_NORMALIZED;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    return router;
  }
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
  }
  function useRouter() {
    return vue.inject(routerKey);
  }
  function useRoute() {
    return vue.inject(routeLocationKey);
  }
  exports.RouterLink = RouterLink;
  exports.RouterView = RouterView;
  exports.START_LOCATION = START_LOCATION_NORMALIZED;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createRouter = createRouter;
  exports.createRouterMatcher = createRouterMatcher;
  exports.createWebHashHistory = createWebHashHistory;
  exports.createWebHistory = createWebHistory;
  exports.isNavigationFailure = isNavigationFailure;
  exports.matchedRouteKey = matchedRouteKey;
  exports.onBeforeRouteLeave = onBeforeRouteLeave;
  exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
  exports.parseQuery = parseQuery2;
  exports.routeLocationKey = routeLocationKey;
  exports.routerKey = routerKey;
  exports.routerViewLocationKey = routerViewLocationKey;
  exports.stringifyQuery = stringifyQuery2;
  exports.useLink = useLink;
  exports.useRoute = useRoute;
  exports.useRouter = useRouter;
  exports.viewDepthKey = viewDepthKey;
})(vueRouter_cjs_prod);
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["{[]|^-?[0-9][0-9.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(val) {
  if (typeof val !== "string") {
    return val;
  }
  const _lval = val.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return NaN;
  }
  if (_lval === "infinity") {
    return Infinity;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(val)) {
    return val;
  }
  try {
    if (suspectProtoRx.test(val) || suspectConstructorRx.test(val)) {
      return JSON.parse(val, jsonParseTransform);
    }
    return JSON.parse(val);
  } catch (_e) {
    return val;
  }
}
const preload = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n) ? props.getAttribute(n) : void 0 : props[n];
    if (value !== void 0) {
      return { name: n, value };
    }
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a;
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_a = j == null ? void 0 : j.tagName) == null ? void 0 : _a.toLowerCase()) === type) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => createElement(tag.tag, tag.props, document2));
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldElements.length; i++) {
      const oldEl = oldElements[i];
      if (isEqualNode(oldEl, newEl)) {
        oldElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    head.insertBefore(t, headCountEl);
  });
  headCountEl.setAttribute("content", "" + (headCount - oldElements.length + newElements.length));
};
var createHead = () => {
  let allHeadObjs = [];
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      for (const name of Object.keys(actualTags)) {
        updateElements(document2, name, actualTags[name]);
      }
    }
  };
  return head;
};
var tagToString = (tag) => {
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}>`;
  }
  return `<${tag.tag}${attrs}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    }
  };
};
const vueuseHead_a070f002 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp._useMeta = (meta2) => {
    const headObj = vue_cjs_prod.ref(meta2);
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index2;
  let lastIndex = 0;
  for (index2 = match.index; index2 < str.length; index2++) {
    switch (str.charCodeAt(index2)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index2) {
      html += str.slice(lastIndex, index2);
    }
    lastIndex = index2 + 1;
    html += escaped;
  }
  return lastIndex !== index2 ? html + str.slice(lastIndex, index2) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis$1;
const getGlobalThis = () => {
  return _globalThis$1 || (_globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
function useMeta(meta2) {
  const resolvedMeta = isFunction_1(meta2) ? vue_cjs_prod.computed(meta2) : meta2;
  useNuxtApp()._useMeta(resolvedMeta);
}
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useMeta(() => metaFactory(__spreadValues(__spreadValues({}, removeUndefinedProps(props)), ctx.attrs), ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = vue_cjs_prod.defineComponent({
  name: "Script",
  props: __spreadProps(__spreadValues({}, globalProps), {
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  }),
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = vue_cjs_prod.defineComponent({
  name: "Link",
  props: __spreadProps(__spreadValues({}, globalProps), {
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  }),
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = vue_cjs_prod.defineComponent({
  name: "Base",
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = vue_cjs_prod.defineComponent({
  name: "Title",
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b;
    const title = ((_b = (_a = slots.default()) == null ? void 0 : _a[0]) == null ? void 0 : _b.children) || null;
    return {
      title
    };
  })
});
const Meta = vue_cjs_prod.defineComponent({
  name: "Meta",
  props: __spreadProps(__spreadValues({}, globalProps), {
    charset: String,
    content: String,
    httpEquiv: String,
    key: String,
    name: String
  }),
  setup: setupForUseMeta((meta2) => ({
    meta: [meta2]
  }))
});
const Style = vue_cjs_prod.defineComponent({
  name: "Style",
  props: __spreadProps(__spreadValues({}, globalProps), {
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  }),
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = __spreadValues({}, props);
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  setup: (_props, ctx) => ctx.slots.default
});
const Html = vue_cjs_prod.defineComponent({
  name: "Html",
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
  name: "Body",
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
});
const metaConfig = { "globalMeta": { "meta": [{ "charset": "utf-8" }, { "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" }], "link": [], "style": [], "script": [] }, "mixinKey": "created" };
const plugin_03b31df3 = defineNuxtPlugin((nuxtApp) => {
  useMeta(metaConfig.globalMeta);
  nuxtApp.vueApp.mixin({
    [metaConfig.mixinKey]() {
      var _a;
      const instance = vue_cjs_prod.getCurrentInstance();
      const options = (instance == null ? void 0 : instance.type) || ((_a = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a.$options);
      if (!options || !("head" in options)) {
        return;
      }
      const source = typeof options.head === "function" ? vue_cjs_prod.computed(() => options.head(nuxtApp)) : options.head;
      useMeta(source);
    }
  });
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1Z = {
  name: "NuxtNestedPage"
};
function _sfc_ssrRender$12(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterView = vue_cjs_prod.resolveComponent("RouterView");
  _push(serverRenderer.exports.ssrRenderComponent(_component_RouterView, _attrs, {
    default: vue_cjs_prod.withCtx(({ Component }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        serverRenderer.exports.ssrRenderVNode(_push2, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent(Component), {
          key: _ctx.$route.path
        }, null), _parent2, _scopeId);
      } else {
        return [
          (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(Component), {
            key: _ctx.$route.path
          }))
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1Z = _sfc_main$1Z.setup;
_sfc_main$1Z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("node_modules/nuxt3/dist/pages/runtime/nested-page.vue");
  return _sfc_setup$1Z ? _sfc_setup$1Z(props, ctx) : void 0;
};
const NuxtNestedPage = /* @__PURE__ */ _export_sfc(_sfc_main$1Z, [["ssrRender", _sfc_ssrRender$12]]);
const layouts = {};
const NuxtLayout = vue_cjs_prod.defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: "default"
    }
  },
  setup(props, context) {
    return () => {
      var _a;
      const layout = (_a = props.name && typeof props.name === "object" ? props.name.value : props.name) != null ? _a : "default";
      if (!layouts[layout]) {
        return context.slots.default();
      }
      return vue_cjs_prod.h(layouts[layout], props, context.slots);
    };
  }
});
const NuxtTransition = vue_cjs_prod.defineComponent({
  name: "NuxtTransition",
  props: {
    options: [Object, Boolean]
  },
  setup(props, { slots }) {
    return () => props.options ? vue_cjs_prod.h(vue_cjs_prod.Transition, props.options, slots.default) : slots.default();
  }
});
const _sfc_main$1Y = vue_cjs_prod.defineComponent({
  name: "NuxtPage",
  components: { NuxtLayout, NuxtTransition },
  props: {
    layout: {
      type: String,
      default: null
    }
  },
  setup() {
    const nuxtApp = useNuxtApp();
    function onSuspensePending(Component) {
      return nuxtApp.callHook("page:start", Component);
    }
    function onSuspenseResolved(Component) {
      return nuxtApp.callHook("page:finish", Component);
    }
    return {
      onSuspensePending,
      onSuspenseResolved
    };
  }
});
function _sfc_ssrRender$11(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterView = vue_cjs_prod.resolveComponent("RouterView");
  const _component_NuxtLayout = vue_cjs_prod.resolveComponent("NuxtLayout");
  const _component_NuxtTransition = vue_cjs_prod.resolveComponent("NuxtTransition");
  _push(serverRenderer.exports.ssrRenderComponent(_component_RouterView, _attrs, {
    default: vue_cjs_prod.withCtx(({ Component, route }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if (Component) {
          _push2(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, {
            name: _ctx.layout || route.meta.layout
          }, {
            default: vue_cjs_prod.withCtx((_, _push3, _parent3, _scopeId2) => {
              var _a, _b;
              if (_push3) {
                _push3(serverRenderer.exports.ssrRenderComponent(_component_NuxtTransition, {
                  options: (_a = route.meta.transition) != null ? _a : { name: "page", mode: "out-in" }
                }, {
                  default: vue_cjs_prod.withCtx((_10, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      serverRenderer.exports.ssrRenderSuspense(_push4, {
                        default: () => {
                          serverRenderer.exports.ssrRenderVNode(_push4, vue_cjs_prod.createVNode(vue_cjs_prod.resolveDynamicComponent(Component), {
                            key: route.path
                          }, null), _parent4, _scopeId3);
                        },
                        _: 2
                      });
                    } else {
                      return [
                        (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Suspense, {
                          onPending: () => _ctx.onSuspensePending(Component),
                          onResolve: () => _ctx.onSuspenseResolved(Component)
                        }, {
                          default: vue_cjs_prod.withCtx(() => [
                            (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(Component), {
                              key: route.path
                            }))
                          ]),
                          _: 2
                        }, 1032, ["onPending", "onResolve"]))
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
              } else {
                return [
                  vue_cjs_prod.createVNode(_component_NuxtTransition, {
                    options: (_b = route.meta.transition) != null ? _b : { name: "page", mode: "out-in" }
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Suspense, {
                        onPending: () => _ctx.onSuspensePending(Component),
                        onResolve: () => _ctx.onSuspenseResolved(Component)
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(Component), {
                            key: route.path
                          }))
                        ]),
                        _: 2
                      }, 1032, ["onPending", "onResolve"]))
                    ]),
                    _: 2
                  }, 1032, ["options"])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          Component ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_NuxtLayout, {
            key: 0,
            name: _ctx.layout || route.meta.layout
          }, {
            default: vue_cjs_prod.withCtx(() => {
              var _a;
              return [
                vue_cjs_prod.createVNode(_component_NuxtTransition, {
                  options: (_a = route.meta.transition) != null ? _a : { name: "page", mode: "out-in" }
                }, {
                  default: vue_cjs_prod.withCtx(() => [
                    (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Suspense, {
                      onPending: () => _ctx.onSuspensePending(Component),
                      onResolve: () => _ctx.onSuspenseResolved(Component)
                    }, {
                      default: vue_cjs_prod.withCtx(() => [
                        (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.resolveDynamicComponent(Component), {
                          key: route.path
                        }))
                      ]),
                      _: 2
                    }, 1032, ["onPending", "onResolve"]))
                  ]),
                  _: 2
                }, 1032, ["options"])
              ];
            }),
            _: 2
          }, 1032, ["name"])) : vue_cjs_prod.createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1Y = _sfc_main$1Y.setup;
_sfc_main$1Y.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("node_modules/nuxt3/dist/pages/runtime/page.vue");
  return _sfc_setup$1Y ? _sfc_setup$1Y(props, ctx) : void 0;
};
const NuxtPage = /* @__PURE__ */ _export_sfc(_sfc_main$1Y, [["ssrRender", _sfc_ssrRender$11]]);
var timerId;
const _sfc_main$1X = vue_cjs_prod.defineComponent({
  name: "designingmath",
  props: {
    setupFunc: {
      type: Function
    },
    loopFunc: {
      type: Function
    },
    touchOrMouseStartFunc: {
      type: Function
    },
    touchOrMouseMoveFunc: {
      type: Function
    },
    touchOrMouseEndFunc: {
      type: Function
    }
  },
  methods: {
    screenWidth() {
      return this.canvasElement.width;
    },
    screenHeight() {
      return this.canvasElement.height;
    },
    getCtx() {
      return this.canvasElement.getContext("2d");
    },
    updateTouchPosition(evt) {
      var rect = this.canvasElement.getBoundingClientRect();
      var bai2 = this.screenWidth() / rect.width;
      this.curYubiX = (evt.changedTouches[0].pageX - (rect.left + window.pageXOffset)) * bai2;
      this.curYubiY = (evt.changedTouches[0].pageY - (rect.top + window.pageYOffset)) * bai2;
    },
    doTouchstart(evt) {
      this.updateTouchPosition(evt);
      this.yubiTouched = true;
      if (this.touchOrMouseStartFunc) {
        this.touchOrMouseStartFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }
    },
    doTouchmove(evt) {
      this.updateTouchPosition(evt);
      if (this.touchOrMouseMoveFunc) {
        this.touchOrMouseMoveFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }
    },
    doTouchend(evt) {
      this.updateTouchPosition(evt);
      this.yubiTouched = false;
      if (this.touchOrMouseEndFunc) {
        this.touchOrMouseEndFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }
    },
    updateMousePosition(evt) {
      var rect = this.canvasElement.getBoundingClientRect();
      var bai2 = this.screenWidth() / rect.width;
      this.curYubiX = (evt.clientX - rect.left) * bai2;
      this.curYubiY = (evt.clientY - rect.top) * bai2;
    },
    doMousedown(evt) {
      this.updateMousePosition(evt);
      this.yubiTouched = true;
      if (this.touchOrMouseStartFunc) {
        this.touchOrMouseStartFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }
    },
    doMousemove(evt) {
      this.updateMousePosition(evt);
      if (this.touchOrMouseMoveFunc) {
        this.touchOrMouseMoveFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }
    },
    doMouseup(evt) {
      this.updateMousePosition(evt);
      this.yubiTouched = false;
      if (this.touchOrMouseEndFunc) {
        this.touchOrMouseEndFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }
    }
  },
  computed: {},
  mounted() {
    console.log(this.canvasElement);
    this.curYubiX = this.screenWidth() / 2;
    this.curYubiY = this.screenHeight() / 2;
    if (this.setupFunc) {
      this.setupFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
    }
    if (this.loopFunc) {
      this.timerId = setInterval(() => {
        this.loopFunc(this.getCtx(), this.screenWidth(), this.screenHeight(), this.curYubiX, this.curYubiY, this.yubiTouched);
      }, 33);
    }
  },
  setup() {
    const canvasElement = vue_cjs_prod.ref(null);
    return {
      canvasElement,
      curYubiX: void 0,
      curYubiY: void 0,
      yubiTouched: false,
      timerId
    };
  }
});
function _sfc_ssrRender$10(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<canvas${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
    class: "canvasElement",
    ref: "canvasElement",
    width: "1280",
    height: "1600"
  }, _attrs))} data-v-9f747400></canvas>`);
}
const _sfc_setup$1X = _sfc_main$1X.setup;
_sfc_main$1X.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("components/designingmath.vue");
  return _sfc_setup$1X ? _sfc_setup$1X(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1X, [["ssrRender", _sfc_ssrRender$10], ["__scopeId", "data-v-9f747400"]]);
const designingmath = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __nuxt_component_0$1
});
const _sfc_main$1W = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc 0");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc 0");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc 0");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc 0");
    }
  }
});
const _sfc_setup$1W = _sfc_main$1W.setup;
_sfc_main$1W.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter01/0.vue");
  return _sfc_setup$1W ? _sfc_setup$1W(props, ctx) : void 0;
};
const meta$Y = void 0;
const _sfc_main$1V = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1V = _sfc_main$1V.setup;
_sfc_main$1V.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter01/1.vue");
  return _sfc_setup$1V ? _sfc_setup$1V(props, ctx) : void 0;
};
const meta$X = void 0;
const _sfc_main$1U = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1U = _sfc_main$1U.setup;
_sfc_main$1U.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter01/2.vue");
  return _sfc_setup$1U ? _sfc_setup$1U(props, ctx) : void 0;
};
const meta$W = void 0;
const _sfc_main$1T = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.moveTo(200, 100);
      ctx.lineTo(800, 900);
      ctx.stroke();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1T = _sfc_main$1T.setup;
_sfc_main$1T.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/1.vue");
  return _sfc_setup$1T ? _sfc_setup$1T(props, ctx) : void 0;
};
const meta$V = void 0;
const _sfc_main$1S = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(screenWidth, screenHeight);
      ctx.lineTo(screenWidth / 3, screenHeight);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(screenWidth * 0.5, screenHeight * 0.1);
      ctx.lineTo(screenWidth, 0);
      ctx.lineTo(screenWidth * 0.8, screenHeight * 0.6);
      ctx.lineTo(screenWidth * 0.4, screenHeight * 0.2);
      ctx.fill();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1S = _sfc_main$1S.setup;
_sfc_main$1S.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/2.vue");
  return _sfc_setup$1S ? _sfc_setup$1S(props, ctx) : void 0;
};
const meta$U = void 0;
const _sfc_main$1R = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.bezierCurveTo(300, 200, 100, 300, 200, 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(200, 500);
      ctx.quadraticCurveTo(300, 600, 100, 700);
      ctx.lineTo(100, 500);
      ctx.closePath();
      ctx.stroke();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1R = _sfc_main$1R.setup;
_sfc_main$1R.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/3.vue");
  return _sfc_setup$1R ? _sfc_setup$1R(props, ctx) : void 0;
};
const meta$T = void 0;
const _sfc_main$1Q = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.arc(500, 200, 100, 30 / 180 * Math.PI, 120 / 180 * Math.PI, true);
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(500, 600, 200, 100, 45 / 180 * Math.PI, 30 / 180 * Math.PI, 120 / 180 * Math.PI, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(800, 100, 100, 200);
      ctx.fill();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1Q = _sfc_main$1Q.setup;
_sfc_main$1Q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/4.vue");
  return _sfc_setup$1Q ? _sfc_setup$1Q(props, ctx) : void 0;
};
const meta$S = void 0;
const _sfc_main$1P = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.lineWidth = 40;
      ctx.fillStyle = "pink";
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(400, 500, 300, 0, 180 * Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgb(160, 160, 160)";
      ctx.strokeStyle = "#990000";
      ctx.beginPath();
      ctx.arc(700, 500, 300, 0, 180 * Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(550, 800, 300, 0, 180 * Math.PI * 2, true);
      ctx.fill();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1P = _sfc_main$1P.setup;
_sfc_main$1P.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/5.vue");
  return _sfc_setup$1P ? _sfc_setup$1P(props, ctx) : void 0;
};
const meta$R = void 0;
const _sfc_main$1O = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.fillText("Designing Math.", screenWidth / 2, 200);
      ctx.strokeStyle = "black";
      ctx.font = "60px Serif";
      ctx.textAlign = "right";
      ctx.strokeText("Designing Math.", screenWidth / 2, 400);
      ctx.fillStyle = "grey";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.font = "80px Helvetica";
      ctx.textAlign = "center";
      ctx.strokeText("Designing Math.", screenWidth / 2, 600);
      ctx.fillText("Designing Math.", screenWidth / 2, 600);
      ctx.fillText("Designing Math.", screenWidth / 2, 800);
      ctx.strokeText("Designing Math.", screenWidth / 2, 800);
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1O = _sfc_main$1O.setup;
_sfc_main$1O.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/6.vue");
  return _sfc_setup$1O ? _sfc_setup$1O(props, ctx) : void 0;
};
const meta$Q = void 0;
const _sfc_main$1N = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1N = _sfc_main$1N.setup;
_sfc_main$1N.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/7.vue");
  return _sfc_setup$1N ? _sfc_setup$1N(props, ctx) : void 0;
};
const meta$P = void 0;
const _sfc_main$1M = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      if (yubiTouched) {
        ctx.beginPath();
        ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1M = _sfc_main$1M.setup;
_sfc_main$1M.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/8.vue");
  return _sfc_setup$1M ? _sfc_setup$1M(props, ctx) : void 0;
};
const meta$O = void 0;
const _sfc_main$1L = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.lineWidth = 40;
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      ctx.strokeStyle = "red";
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
      ctx.strokeStyle = "pink";
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
      ctx.strokeStyle = "grey";
    }
  }
});
const _sfc_setup$1L = _sfc_main$1L.setup;
_sfc_main$1L.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/9.vue");
  return _sfc_setup$1L ? _sfc_setup$1L(props, ctx) : void 0;
};
const meta$N = void 0;
const unitKazu$v = 16;
const unitSize$v = 60;
const offsetX$V = 0;
const offsetY$V = 0;
const hankei$1 = unitSize$v / 2;
const _sfc_main$1K = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      [...Array(unitKazu$v).keys()].forEach((tateNum) => [...Array(unitKazu$v).keys()].forEach((yokoNum) => {
        const x = unitSize$v * yokoNum + offsetX$V;
        const y = unitSize$v * tateNum + offsetY$V;
        ctx.beginPath();
        ctx.arc(x + hankei$1, y + hankei$1, hankei$1, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1K = _sfc_main$1K.setup;
_sfc_main$1K.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/1.vue");
  return _sfc_setup$1K ? _sfc_setup$1K(props, ctx) : void 0;
};
const meta$M = void 0;
const unitKazu$u = 16;
var unitSize$u;
var offsetX$U;
var offsetY$U;
const _sfc_main$1J = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$u = Math.min(screenWidth, screenHeight) / unitKazu$u;
      const totalLength = unitSize$u * unitKazu$u;
      offsetX$U = (screenWidth - totalLength) / 2;
      offsetY$U = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$u / 2;
      [...Array(unitKazu$u).keys()].forEach((tateNum) => [...Array(unitKazu$u).keys()].forEach((yokoNum) => {
        const x = unitSize$u * yokoNum + offsetX$U;
        const y = unitSize$u * tateNum + offsetY$U;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1J = _sfc_main$1J.setup;
_sfc_main$1J.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/2.vue");
  return _sfc_setup$1J ? _sfc_setup$1J(props, ctx) : void 0;
};
const meta$L = void 0;
const unitKazu$t = 16;
var unitSize$t;
var offsetX$T;
var offsetY$T;
const _sfc_main$1I = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$t = Math.min(screenWidth, screenHeight) / unitKazu$t;
      const totalLength = unitSize$t * unitKazu$t;
      offsetX$T = (screenWidth - totalLength) / 2;
      offsetY$T = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$t / 2;
      var idx = 0;
      [...Array(unitKazu$t).keys()].forEach((tateNum) => [...Array(unitKazu$t).keys()].forEach((yokoNum) => {
        const par1 = idx++ % (unitKazu$t + 1) / unitKazu$t;
        const x = unitSize$t * yokoNum + offsetX$T;
        const y = unitSize$t * tateNum + offsetY$T;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, par1 * hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1I = _sfc_main$1I.setup;
_sfc_main$1I.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/3.vue");
  return _sfc_setup$1I ? _sfc_setup$1I(props, ctx) : void 0;
};
const meta$K = void 0;
const unitKazu$s = 16;
var unitSize$s;
var offsetX$S;
var offsetY$S;
var startTime$p;
const _sfc_main$1H = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$s = Math.min(screenWidth, screenHeight) / unitKazu$s;
      startTime$p = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$p) % 1e3 / 999;
      const totalLength = unitSize$s * unitKazu$s;
      offsetX$S = (screenWidth - totalLength) / 2;
      offsetY$S = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$s / 2;
      var idx = 0;
      [...Array(unitKazu$s).keys()].forEach((tateNum) => [...Array(unitKazu$s).keys()].forEach((yokoNum) => {
        const par1 = idx++ % (unitKazu$s + 1) / unitKazu$s;
        const x = unitSize$s * yokoNum + offsetX$S;
        const y = unitSize$s * tateNum + offsetY$S;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, (par1 + par2) * hankei2 % hankei2 + 1, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1H = _sfc_main$1H.setup;
_sfc_main$1H.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/4.vue");
  return _sfc_setup$1H ? _sfc_setup$1H(props, ctx) : void 0;
};
const meta$J = void 0;
const unitKazu$r = 16;
var unitSize$r;
var offsetX$R;
var offsetY$R;
var startTime$o;
const _sfc_main$1G = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$r = Math.min(screenWidth, screenHeight) / unitKazu$r;
      startTime$o = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$o) % 1e3 / 999;
      const totalLength = unitSize$r * unitKazu$r;
      offsetX$R = (screenWidth - totalLength) / 2;
      offsetY$R = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$r / 2;
      var idx = 0;
      [...Array(unitKazu$r).keys()].forEach((tateNum) => [...Array(unitKazu$r).keys()].forEach((yokoNum) => {
        const par1 = idx++ % (unitKazu$r + 1) / unitKazu$r;
        const parC = (par1 + par2) * 256 % 256;
        ctx.fillStyle = `rgb(${parC},${parC},${parC})`;
        const x = unitSize$r * yokoNum + offsetX$R;
        const y = unitSize$r * tateNum + offsetY$R;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, (par1 + par2) * hankei2 % hankei2 + 1, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1G = _sfc_main$1G.setup;
_sfc_main$1G.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/5.vue");
  return _sfc_setup$1G ? _sfc_setup$1G(props, ctx) : void 0;
};
const meta$I = void 0;
const unitKazu$q = 8;
const unitYokoKazu$l = unitKazu$q;
const unitTateKazu$l = unitKazu$q;
var unitSize$q;
var offsetX$Q;
var offsetY$Q;
const _sfc_main$1F = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$q = Math.min(screenWidth, screenHeight) / unitKazu$q;
      const totalLength = unitSize$q * unitKazu$q;
      offsetX$Q = (screenWidth - totalLength) / 2;
      offsetY$Q = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$l).keys()].forEach((tateNum) => [...Array(unitYokoKazu$l).keys()].forEach((yokoNum) => {
        const x = unitSize$q * yokoNum + offsetX$Q;
        const y = unitSize$q * tateNum + offsetY$Q;
        const hankei2 = unitSize$q / 2;
        ctx.fillStyle = "rgb(255, 200, 200)";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1F = _sfc_main$1F.setup;
_sfc_main$1F.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/1.vue");
  return _sfc_setup$1F ? _sfc_setup$1F(props, ctx) : void 0;
};
const meta$H = void 0;
const unitKazu$p = 8;
const unitYokoKazu$k = unitKazu$p;
const unitTateKazu$k = unitKazu$p * 4;
var unitSize$p;
var unitSizeX$j;
var unitSizeY$j;
var offsetX$P;
var offsetY$P;
const _sfc_main$1E = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$p = screenSize / unitKazu$p;
      unitSizeX$j = screenSize / unitYokoKazu$k;
      unitSizeY$j = screenSize / unitTateKazu$k;
      const totalLength = unitSize$p * unitKazu$p;
      offsetX$P = (screenWidth - totalLength) / 2;
      offsetY$P = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$k).keys()].forEach((tateNum) => [...Array(unitYokoKazu$k).keys()].forEach((yokoNum) => {
        const x = unitSizeX$j * yokoNum + offsetX$P;
        const y = unitSizeY$j * tateNum + offsetY$P;
        const hankei2 = unitSize$p / 2;
        ctx.fillStyle = "rgba(255, 200, 200, 0.7)";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1E = _sfc_main$1E.setup;
_sfc_main$1E.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/2.vue");
  return _sfc_setup$1E ? _sfc_setup$1E(props, ctx) : void 0;
};
const meta$G = void 0;
const unitKazu$o = 8;
const unitYokoKazu$j = unitKazu$o;
const unitTateKazu$j = unitKazu$o * 4;
var unitSize$o;
var unitSizeX$i;
var unitSizeY$i;
var offsetX$O;
var offsetY$O;
const _sfc_main$1D = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$o = screenSize / unitKazu$o;
      unitSizeX$i = screenSize / unitYokoKazu$j;
      unitSizeY$i = screenSize / unitTateKazu$j;
      const totalLength = unitSize$o * unitKazu$o;
      offsetX$O = (screenWidth - totalLength) / 2;
      offsetY$O = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$j + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$j + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$o / 2;
        const x = unitSizeX$i * yokoNum + offsetX$O + (tateNum % 2 === 1 ? -unitSize$o / 2 : 0);
        const y = unitSizeY$i * (tateNum - 1) + offsetY$O;
        ctx.fillStyle = "rgba(255, 200, 200, 0.7)";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1D = _sfc_main$1D.setup;
_sfc_main$1D.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/3.vue");
  return _sfc_setup$1D ? _sfc_setup$1D(props, ctx) : void 0;
};
const meta$F = void 0;
const unitKazu$n = 8;
const unitYokoKazu$i = unitKazu$n;
const unitTateKazu$i = unitKazu$n * 4;
var unitSize$n;
var unitSizeX$h;
var unitSizeY$h;
var offsetX$N;
var offsetY$N;
const _sfc_main$1C = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$n = screenSize / unitKazu$n;
      unitSizeX$h = screenSize / unitYokoKazu$i;
      unitSizeY$h = screenSize / unitTateKazu$i;
      const totalLength = unitSize$n * unitKazu$n;
      offsetX$N = (screenWidth - totalLength) / 2;
      offsetY$N = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$i + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$i + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$n / 2;
        const x = unitSizeX$h * yokoNum + offsetX$N + (tateNum % 2 === 1 ? -unitSize$n / 2 : 0);
        const y = unitSizeY$h * (tateNum - 1) + offsetY$N;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), 0, Math.PI * 2, false);
          ctx.stroke();
        });
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1C = _sfc_main$1C.setup;
_sfc_main$1C.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/4.vue");
  return _sfc_setup$1C ? _sfc_setup$1C(props, ctx) : void 0;
};
const meta$E = void 0;
const unitKazu$m = 8;
const unitYokoKazu$h = unitKazu$m;
const unitTateKazu$h = unitKazu$m * 4;
var unitSize$m;
var unitSizeX$g;
var unitSizeY$g;
var offsetX$M;
var offsetY$M;
var startTime$n;
const _sfc_main$1B = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$m = screenSize / unitKazu$m;
      unitSizeX$g = screenSize / unitYokoKazu$h;
      unitSizeY$g = screenSize / unitTateKazu$h;
      const totalLength = unitSize$m * unitKazu$m;
      offsetX$M = (screenWidth - totalLength) / 2;
      offsetY$M = (screenHeight - totalLength) / 2;
      startTime$n = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$n) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      [...Array(unitTateKazu$h + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$h + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$m / 2;
        const x = unitSizeX$g * yokoNum + offsetX$M + (tateNum % 2 === 1 ? -unitSize$m / 2 : 0);
        const y = unitSizeY$g * (tateNum - 1) + offsetY$M;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + 0, kakudoA + kakudo324, false);
          ctx.stroke();
        });
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1B = _sfc_main$1B.setup;
_sfc_main$1B.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/5.vue");
  return _sfc_setup$1B ? _sfc_setup$1B(props, ctx) : void 0;
};
const meta$D = void 0;
const unitKazu$l = 8;
const unitYokoKazu$g = unitKazu$l;
const unitTateKazu$g = unitKazu$l * 4;
var unitSize$l;
var unitSizeX$f;
var unitSizeY$f;
var offsetX$L;
var offsetY$L;
var startTime$m;
const _sfc_main$1A = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$l = screenSize / unitKazu$l;
      unitSizeX$f = screenSize / unitYokoKazu$g;
      unitSizeY$f = screenSize / unitTateKazu$g;
      const totalLength = unitSize$l * unitKazu$l;
      offsetX$L = (screenWidth - totalLength) / 2;
      offsetY$L = (screenHeight - totalLength) / 2;
      startTime$m = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$m) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      [...Array(unitTateKazu$g + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$g + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$l / 2;
        const x = unitSizeX$f * yokoNum + offsetX$L + (tateNum % 2 === 1 ? -unitSize$l / 2 : 0);
        const y = unitSizeY$f * (tateNum - 1) + offsetY$L;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          const kakudoC = (lineIdx + 1) / (arcNum + 1) * Math.PI;
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + kakudoC + 0, kakudoA + kakudoC + kakudo324, false);
          ctx.stroke();
        });
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1A = _sfc_main$1A.setup;
_sfc_main$1A.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/6.vue");
  return _sfc_setup$1A ? _sfc_setup$1A(props, ctx) : void 0;
};
const meta$C = void 0;
const unitKazu$k = 8;
const unitYokoKazu$f = unitKazu$k;
const unitTateKazu$f = unitKazu$k * 4;
var unitSize$k;
var unitSizeX$e;
var unitSizeY$e;
var offsetX$K;
var offsetY$K;
var startTime$l;
const _sfc_main$1z = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$k = screenSize / unitKazu$k;
      unitSizeX$e = screenSize / unitYokoKazu$f;
      unitSizeY$e = screenSize / unitTateKazu$f;
      const totalLength = unitSize$k * unitKazu$k;
      offsetX$K = (screenWidth - totalLength) / 2;
      offsetY$K = (screenHeight - totalLength) / 2;
      startTime$l = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$l) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      var idx = 0;
      [...Array(unitTateKazu$f + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$f + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$k / 2;
        const x = unitSizeX$e * yokoNum + offsetX$K + (tateNum % 2 === 1 ? -unitSize$k / 2 : 0);
        const y = unitSizeY$e * (tateNum - 1) + offsetY$K;
        const kakudoB = idx++ % (unitYokoKazu$f + 2) / (unitYokoKazu$f + 1) * Math.PI * 2;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          const kakudoC = (lineIdx + 1) / (arcNum + 1) * Math.PI;
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + kakudoB + kakudoC + 0, kakudoA + kakudoB + kakudoC + kakudo324, false);
          ctx.stroke();
        });
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1z = _sfc_main$1z.setup;
_sfc_main$1z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/7.vue");
  return _sfc_setup$1z ? _sfc_setup$1z(props, ctx) : void 0;
};
const meta$B = void 0;
const unitKazu$j = 8;
const unitYokoKazu$e = unitKazu$j;
const unitTateKazu$e = unitKazu$j * 4;
var unitSize$j;
var unitSizeX$d;
var unitSizeY$d;
var offsetX$J;
var offsetY$J;
var startTime$k;
const _sfc_main$1y = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$j = screenSize / unitKazu$j;
      unitSizeX$d = screenSize / unitYokoKazu$e;
      unitSizeY$d = screenSize / unitTateKazu$e;
      const totalLength = unitSize$j * unitKazu$j;
      offsetX$J = (screenWidth - totalLength) / 2;
      offsetY$J = (screenHeight - totalLength) / 2;
      startTime$k = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$k) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      var idx = 0;
      [...Array(unitTateKazu$e + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$e + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$j / 2;
        const x = unitSizeX$d * yokoNum + offsetX$J + (tateNum % 2 === 1 ? -unitSize$j / 2 : 0);
        const y = unitSizeY$d * (tateNum - 1) + offsetY$J;
        const kakudoB = idx++ % (unitYokoKazu$e + 2) / (unitYokoKazu$e + 1) * Math.PI * 2;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          const kakudoC = (lineIdx + 1) / (arcNum + 1) * Math.PI;
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + kakudoB + kakudoC + 0, kakudoA + kakudoB + kakudoC + kakudo324, false);
          ctx.stroke();
        });
      }));
      ctx.fillStyle = "white";
      if (offsetX$J > 0) {
        ctx.fillRect(0, 0, offsetX$J, screenHeight);
        ctx.fillRect(screenWidth - offsetX$J, 0, offsetX$J, screenHeight);
      }
      if (offsetY$J > 0) {
        ctx.fillRect(0, 0, screenWidth, offsetY$J);
        ctx.fillRect(0, screenHeight - offsetY$J, screenWidth, offsetY$J);
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1y = _sfc_main$1y.setup;
_sfc_main$1y.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/8.vue");
  return _sfc_setup$1y ? _sfc_setup$1y(props, ctx) : void 0;
};
const meta$A = void 0;
var centerX$b;
var centerY$b;
const _sfc_main$1x = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$b = screenWidth / 2;
      centerY$b = screenHeight / 2;
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = hankei1 * Math.cos(kakudo) + centerX$b;
        const y = hankei1 * Math.sin(kakudo) + centerY$b;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1x = _sfc_main$1x.setup;
_sfc_main$1x.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/1.vue");
  return _sfc_setup$1x ? _sfc_setup$1x(props, ctx) : void 0;
};
const meta$z = void 0;
var centerX$a;
var centerY$a;
const numPattern$7 = 3;
var targetPattern$7 = 0;
const _sfc_main$1w = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8"
    };
  },
  methods: {
    onClick() {
      targetPattern$7 = ++targetPattern$7 % numPattern$7;
      console.log(targetPattern$7);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$a = screenWidth / 2;
      centerY$a = screenHeight / 2;
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      switch (targetPattern$7) {
        case 0:
          this.loopFunc0(ctx);
          break;
        case 1:
          this.loopFunc1(ctx);
          break;
        case 2:
          this.loopFunc2(ctx);
          break;
      }
    },
    loopFunc0(ctx) {
      const cycle = parseInt(this.numCycle, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$a;
        const y = hankei1 * Math.sin(kakudo) + centerY$a;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    loopFunc1(ctx) {
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = degree;
        const y = hankei1 * Math.sin(kakudo) + centerY$a;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    loopFunc2(ctx) {
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = degree;
        const y = hankei1 * Math.sin(kakudo * 2) + centerY$a;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1w = _sfc_main$1w.setup;
_sfc_main$1w.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/2.vue");
  return _sfc_setup$1w ? _sfc_setup$1w(props, ctx) : void 0;
};
const meta$y = void 0;
var centerX$9;
var centerY$9;
const _sfc_main$1v = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$9 = screenWidth / 2;
      centerY$9 = screenHeight / 2;
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$9;
        const y = hankei1 * Math.sin(kakudo) + centerY$9;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1v = _sfc_main$1v.setup;
_sfc_main$1v.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/3.vue");
  return _sfc_setup$1v ? _sfc_setup$1v(props, ctx) : void 0;
};
const meta$x = void 0;
var centerX$8;
var centerY$8;
var startTime$j;
const _sfc_main$1u = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$8 = screenWidth / 2;
      centerY$8 = screenHeight / 2;
      startTime$j = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycleSeconds = 2;
      const passedTime = new Date().getTime() - startTime$j;
      const objectKakudo = passedTime / 1e3 * Math.PI * 2 / cycleSeconds;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle + objectKakudo) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$8;
        const y = hankei1 * Math.sin(kakudo) + centerY$8;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1u = _sfc_main$1u.setup;
_sfc_main$1u.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/4.vue");
  return _sfc_setup$1u ? _sfc_setup$1u(props, ctx) : void 0;
};
const meta$w = void 0;
var centerX$7;
var centerY$7;
var startTime$i;
const _sfc_main$1t = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$7 = screenWidth / 2;
      centerY$7 = screenHeight / 2;
      startTime$i = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycleSeconds = 2;
      const passedTime = new Date().getTime() - startTime$i;
      const objectKakudo = passedTime / 1e3 * Math.PI * 2 / cycleSeconds;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20 * (Math.sin(objectKakudo) + 1);
        const hankei2 = haba * (Math.sin(kakudo * cycle + objectKakudo) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$7;
        const y = hankei1 * Math.sin(kakudo) + centerY$7;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1t = _sfc_main$1t.setup;
_sfc_main$1t.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/5.vue");
  return _sfc_setup$1t ? _sfc_setup$1t(props, ctx) : void 0;
};
const meta$v = void 0;
var centerX$6;
var centerY$6;
var startTime$h;
const _sfc_main$1s = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$6 = screenWidth / 2;
      centerY$6 = screenHeight / 2;
      startTime$h = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycleSeconds = 2;
      const passedTime = new Date().getTime() - startTime$h;
      const objectKakudo = passedTime / 1e3 * Math.PI * 2 / cycleSeconds;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius + objectKakudo) + 400;
        const haba = 20 * (Math.sin(objectKakudo) + 1);
        const hankei2 = haba * (Math.sin(kakudo * cycle + objectKakudo) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$6;
        const y = hankei1 * Math.sin(kakudo) + centerY$6;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1s = _sfc_main$1s.setup;
_sfc_main$1s.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/6.vue");
  return _sfc_setup$1s ? _sfc_setup$1s(props, ctx) : void 0;
};
const meta$u = void 0;
function hsbToRgb$7(hueOriginal, satOriginal, briOriginal) {
  const hue = hueOriginal % 360 + (hueOriginal < 0 ? 360 : 0);
  const sat = Math.min(Math.max(satOriginal, 0), 255);
  const bri = Math.min(Math.max(briOriginal, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
var shikiso$1 = 0;
const _sfc_main$1r = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      shikiso$1 = ++shikiso$1 % 360;
      const saido = Math.ceil(curYubiX / screenWidth * 255);
      const meido = Math.ceil(curYubiY / screenHeight * 255);
      const rgbCol = hsbToRgb$7(shikiso$1, saido, meido);
      const squareWidth = screenWidth / 2;
      const squareHeight = screenWidth / 2;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.fillStyle = `rgb(${rgbCol.red},${rgbCol.green},${rgbCol.blue})`;
      ctx.fillRect(squareWidth / 2, screenHeight / 2 - squareHeight / 2, squareWidth, squareHeight);
      ctx.fillStyle = "black";
      ctx.font = "36px serif";
      ctx.fillText(`\u8272\u76F8: ${shikiso$1}/360`, squareWidth * 1.5 + 10, screenHeight / 2 + squareHeight / 2 - 105);
      ctx.fillText(`\u5F69\u5EA6: ${saido}/255`, squareWidth * 1.5 + 10, screenHeight / 2 + squareHeight / 2 - 55);
      ctx.fillText(`\u660E\u5EA6: ${meido}/255`, squareWidth * 1.5 + 10, screenHeight / 2 + squareHeight / 2 - 5);
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1r = _sfc_main$1r.setup;
_sfc_main$1r.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/1.vue");
  return _sfc_setup$1r ? _sfc_setup$1r(props, ctx) : void 0;
};
const meta$t = void 0;
function hsbToRgb$6(hsb) {
  const hue = hsb.hue % 360 + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
const unitKazu$i = 8;
const unitYokoKazu$d = unitKazu$i;
const unitTateKazu$d = unitKazu$i * 2;
var unitSize$i;
var unitSizeX$c;
var unitSizeY$c;
var offsetX$I;
var offsetY$I;
const numPattern$6 = 2;
var targetPattern$6 = 0;
var startTime$g;
const _sfc_main$1q = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    onClick() {
      targetPattern$6 = ++targetPattern$6 % numPattern$6;
      console.log(targetPattern$6);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      startTime$g = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const passedTime = (new Date().getTime() - startTime$g) / 1e3;
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$i = screenSize / unitKazu$i;
      unitSizeX$c = screenSize / unitYokoKazu$d;
      unitSizeY$c = screenSize / unitTateKazu$d;
      const totalLength = unitSize$i * unitKazu$i;
      offsetX$I = (screenWidth - totalLength) / 2;
      offsetY$I = (screenHeight - totalLength) / 2;
      const totalCount = (unitTateKazu$d + 1) * (unitYokoKazu$d + 1);
      var idx = 0;
      [...Array(unitTateKazu$d + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$d + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$i / 2;
        const x = unitSizeX$c * yokoNum + offsetX$I + (tateNum % 2 === 1 ? -unitSize$i / 2 : 0);
        const y = unitSizeY$c * (tateNum - 1) + offsetY$I;
        const rgb = hsbToRgb$6({
          hue: idx++ / totalCount * 360 + passedTime * 60 * targetPattern$6,
          sat: curYubiX / screenWidth * 255,
          bri: curYubiY / screenHeight * 255
        });
        ctx.fillStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1q = _sfc_main$1q.setup;
_sfc_main$1q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/2.vue");
  return _sfc_setup$1q ? _sfc_setup$1q(props, ctx) : void 0;
};
const meta$s = void 0;
function hsbToRgb$5(hsb) {
  const hue = hsb.hue % 360 + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
const unitKazu$h = 8;
const unitYokoKazu$c = unitKazu$h;
const unitTateKazu$c = unitKazu$h * 2;
var unitSize$h;
var unitSizeX$b;
var unitSizeY$b;
var offsetX$H;
var offsetY$H;
const numPattern$5 = 2;
var targetPattern$5 = 0;
var startTime$f;
const _sfc_main$1p = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    onClick() {
      targetPattern$5 = ++targetPattern$5 % numPattern$5;
      console.log(targetPattern$5);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      startTime$f = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const passedTime = (new Date().getTime() - startTime$f) / 1e3 * targetPattern$5;
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$h = screenSize / unitKazu$h;
      unitSizeX$b = screenSize / unitYokoKazu$c;
      unitSizeY$b = screenSize / unitTateKazu$c;
      const totalLength = unitSize$h * unitKazu$h;
      offsetX$H = (screenWidth - totalLength) / 2;
      offsetY$H = (screenHeight - totalLength) / 2;
      const totalCount = (unitTateKazu$c + 1) * (unitYokoKazu$c + 1);
      var idx = 0;
      [...Array(unitTateKazu$c + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$c + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$h / 2;
        const x = unitSizeX$b * yokoNum + offsetX$H + (tateNum % 2 === 1 ? -unitSize$h / 2 : 0);
        const y = unitSizeY$b * (tateNum - 1) + offsetY$H;
        const yokoRate = yokoNum / unitYokoKazu$c;
        const rgb = hsbToRgb$5({
          hue: idx++ / totalCount * 360,
          sat: 255,
          bri: ((Math.sin((yokoRate + passedTime) * Math.PI * 2) + 1) / 2 * 0.6 + 0.4) * 255
        });
        ctx.fillStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1p = _sfc_main$1p.setup;
_sfc_main$1p.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/3.vue");
  return _sfc_setup$1p ? _sfc_setup$1p(props, ctx) : void 0;
};
const meta$r = void 0;
function hsbToRgb$4(hsb) {
  const hue = hsb.hue % 360 + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
function drawUnitSankuzusi$1(ctx, hsb, cx, cy, hankei2, mukiEven) {
  ctx.lineWidth = hankei2 * 0.45;
  const xRate = mukiEven ? -1 : 1;
  {
    const rgb = hsbToRgb$4(hsb);
    ctx.strokeStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    ctx.beginPath();
    ctx.moveTo(cx + hankei2 * 0.76 * xRate, cy - hankei2 * 0.36);
    ctx.lineTo(cx - hankei2 * 0.36 * xRate, cy + hankei2 * 0.76);
    ctx.stroke();
  }
  {
    const rgb = hsbToRgb$4(__spreadValues(__spreadValues({}, hsb), {
      hue: hsb.hue + 180
    }));
    ctx.strokeStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    ctx.beginPath();
    ctx.moveTo(cx + hankei2 * 0.36 * xRate, cy - hankei2 * 0.76);
    ctx.lineTo(cx - hankei2 * 0.76 * xRate, cy + hankei2 * 0.36);
    ctx.stroke();
  }
}
const unitKazu$g = 8;
const unitYokoKazu$b = unitKazu$g;
const unitTateKazu$b = unitKazu$g * 2;
var unitSize$g;
var unitSizeX$a;
var unitSizeY$a;
var offsetX$G;
var offsetY$G;
const numPattern$4 = 2;
var targetPattern$4 = 0;
var startTime$e;
const _sfc_main$1o = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    onClick() {
      targetPattern$4 = ++targetPattern$4 % numPattern$4;
      console.log(targetPattern$4);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      startTime$e = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const passedTime = (new Date().getTime() - startTime$e) / 1e3 * targetPattern$4;
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$g = screenSize / unitKazu$g;
      unitSizeX$a = screenSize / unitYokoKazu$b;
      unitSizeY$a = screenSize / unitTateKazu$b;
      const totalLength = unitSize$g * unitKazu$g;
      offsetX$G = (screenWidth - totalLength) / 2;
      offsetY$G = (screenHeight - totalLength) / 2;
      const totalCount = (unitTateKazu$b + 1) * (unitYokoKazu$b + 1);
      var idx = 0;
      [...Array(unitTateKazu$b + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$b + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$g / 2;
        const x = unitSizeX$a * yokoNum + offsetX$G + (tateNum % 2 === 1 ? -unitSize$g / 2 : 0);
        const y = unitSizeY$a * (tateNum - 1) + offsetY$G;
        drawUnitSankuzusi$1(ctx, {
          hue: idx++ / totalCount * 360 + passedTime * 60,
          sat: curYubiX / screenWidth * 255,
          bri: ((Math.sin((yokoNum / (unitYokoKazu$b + 1) + passedTime / 4) * Math.PI * 2) + 1) / 2 * 0.6 + 0.4) * 255
        }, x + hankei2, y + hankei2, hankei2, tateNum % 2 === 0);
      }));
      ctx.fillStyle = "white";
      if (offsetX$G > 0) {
        ctx.fillRect(0, 0, offsetX$G, screenHeight);
        ctx.fillRect(screenWidth - offsetX$G, 0, offsetX$G, screenHeight);
      }
      if (offsetY$G > 0) {
        ctx.fillRect(0, 0, screenWidth, offsetY$G);
        ctx.fillRect(0, screenHeight - offsetY$G, screenWidth, offsetY$G);
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1o = _sfc_main$1o.setup;
_sfc_main$1o.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/4.vue");
  return _sfc_setup$1o ? _sfc_setup$1o(props, ctx) : void 0;
};
const meta$q = void 0;
class Maru$x {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const offsetX$F = 0;
const offsetY$F = 0;
var unitKyori$x = 0;
var maruArrArr$x = [];
const _sfc_main$1n = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$x = yokoInterval;
      maruArrArr$x = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$F + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$F;
        return new Maru$x(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$x.forEach((maruY) => maruY.forEach((maru) => {
        const hankei2 = unitKyori$x / 2;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1n = _sfc_main$1n.setup;
_sfc_main$1n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/1.vue");
  return _sfc_setup$1n ? _sfc_setup$1n(props, ctx) : void 0;
};
const meta$p = void 0;
class Maru$w {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
}
const offsetX$E = 0;
const offsetY$E = 0;
var unitKyori$w = 0;
var maruArrArr$w = [];
const _sfc_main$1m = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$w = yokoInterval;
      maruArrArr$w = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$E + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$E;
        return new Maru$w(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$w.forEach((maruY) => maruY.forEach((maru) => {
        const parR = Math.max(1 - maru.kyori(curYubiX, curYubiY) / screenSize, 0);
        const hankei2 = unitKyori$w / 2 * parR;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1m = _sfc_main$1m.setup;
_sfc_main$1m.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/2.vue");
  return _sfc_setup$1m ? _sfc_setup$1m(props, ctx) : void 0;
};
const meta$o = void 0;
class Maru$v {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
}
const offsetX$D = 0;
const offsetY$D = 0;
var unitKyori$v = 0;
var maruArrArr$v = [];
const _sfc_main$1l = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$v = yokoInterval;
      maruArrArr$v = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$D + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$D;
        return new Maru$v(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$v.forEach((maruY) => maruY.forEach((maru) => {
        const parR = Math.max(1 - maru.kyori(curYubiX, curYubiY) / screenSize, 0);
        const hankei2 = unitKyori$v / 2 * parR;
        const grayValue = parR * 255;
        ctx.fillStyle = `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, maru.kakudo(curYubiX, curYubiY) - Math.PI / 2, maru.kakudo(curYubiX, curYubiY) + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1l = _sfc_main$1l.setup;
_sfc_main$1l.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/3.vue");
  return _sfc_setup$1l ? _sfc_setup$1l(props, ctx) : void 0;
};
const meta$n = void 0;
class Maru$u {
  constructor(x, y) {
    __publicField(this, "touched");
    this.x = x;
    this.y = y;
    this.touched = false;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  setTouched() {
    this.touched = true;
  }
  clearTouched() {
    this.touched = false;
  }
  isTouched() {
    return this.touched;
  }
}
const offsetX$C = 0;
const offsetY$C = 0;
var unitKyori$u = 0;
var maruArrArr$u = [];
const _sfc_main$1k = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$u = yokoInterval;
      maruArrArr$u = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$C + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$C;
        return new Maru$u(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$u.forEach((maruY) => maruY.forEach((maru) => {
        const kyori = maru.kyori(curYubiX, curYubiY);
        if (kyori < unitKyori$u / 2) {
          maru.setTouched();
        }
        const parR = Math.max(1 - kyori / screenSize, 0);
        const hankei2 = unitKyori$u / 2 * parR;
        const grayValue = parR * 255;
        ctx.fillStyle = maru.isTouched() ? "red" : `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, maru.kakudo(curYubiX, curYubiY) - Math.PI / 2, maru.kakudo(curYubiX, curYubiY) + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      maruArrArr$u.forEach((maruY) => maruY.forEach((maru) => {
        maru.clearTouched();
      }));
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1k = _sfc_main$1k.setup;
_sfc_main$1k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/4.vue");
  return _sfc_setup$1k ? _sfc_setup$1k(props, ctx) : void 0;
};
const meta$m = void 0;
class Maru$t {
  constructor(x, y) {
    __publicField(this, "touched");
    this.x = x;
    this.y = y;
    this.touched = false;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  setTouched() {
    this.touched = true;
  }
  clearTouched() {
    this.touched = false;
  }
  isTouched() {
    return this.touched;
  }
}
const offsetX$B = 0;
const offsetY$B = 0;
var unitKyori$t = 0;
var maruArrArr$t = [];
const _sfc_main$1j = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$t = yokoInterval;
      maruArrArr$t = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$B + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$B;
        return new Maru$t(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$t.forEach((maruY) => maruY.forEach((maru) => {
        const kyori = maru.kyori(curYubiX, curYubiY);
        const kakudo = maru.kakudo(curYubiX, curYubiY);
        if (kyori < unitKyori$t / 2) {
          maru.setTouched();
        }
        const parR = Math.max(1 - kyori / screenSize, 0);
        const hankei2 = unitKyori$t / 2 * parR;
        ctx.strokeStyle = "black";
        ctx.lineWidth = parR * 5;
        const x1 = hankei2 * Math.cos(kakudo);
        const y1 = hankei2 * Math.sin(kakudo);
        ctx.beginPath();
        ctx.moveTo(maru.x, maru.y);
        ctx.lineTo(maru.x + x1, maru.y + y1);
        ctx.stroke();
        const grayValue = parR * 255;
        ctx.fillStyle = maru.isTouched() ? "red" : `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, kakudo - Math.PI / 2, kakudo + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      maruArrArr$t.forEach((maruY) => maruY.forEach((maru) => {
        maru.clearTouched();
      }));
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1j = _sfc_main$1j.setup;
_sfc_main$1j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/5.vue");
  return _sfc_setup$1j ? _sfc_setup$1j(props, ctx) : void 0;
};
const meta$l = void 0;
class Maru$s {
  constructor(x, y) {
    __publicField(this, "touched");
    this.x = x;
    this.y = y;
    this.touched = false;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  setTouched() {
    this.touched = true;
  }
  clearTouched() {
    this.touched = false;
  }
  isTouched() {
    return this.touched;
  }
}
const offsetX$A = 0;
const offsetY$A = 0;
var unitKyori$s = 0;
var maruArrArr$s = [];
var startTime$d;
const _sfc_main$1i = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$s = yokoInterval;
      maruArrArr$s = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$A + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$A;
        return new Maru$s(x, y);
      }));
      startTime$d = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const second = (new Date().getTime() - startTime$d) / 1e3;
      const fureKakudo = Math.sin(second * Math.PI * 2) * Math.PI * 0.2;
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$s.forEach((maruY) => maruY.forEach((maru) => {
        const kyori = maru.kyori(curYubiX, curYubiY);
        const kakudo = maru.kakudo(curYubiX, curYubiY);
        if (kyori < unitKyori$s / 2) {
          maru.setTouched();
        }
        const parR = Math.max(1 - kyori / screenSize, 0);
        const hankei2 = unitKyori$s / 2 * parR;
        ctx.strokeStyle = "black";
        ctx.lineWidth = parR * 5;
        const x1 = hankei2 * Math.cos(kakudo + fureKakudo);
        const y1 = hankei2 * Math.sin(kakudo + fureKakudo);
        ctx.beginPath();
        ctx.moveTo(maru.x, maru.y);
        ctx.lineTo(maru.x + x1, maru.y + y1);
        ctx.stroke();
        const grayValue = parR * 255;
        ctx.fillStyle = maru.isTouched() ? "red" : `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, kakudo - Math.PI / 2, kakudo + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      maruArrArr$s.forEach((maruY) => maruY.forEach((maru) => {
        maru.clearTouched();
      }));
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1i = _sfc_main$1i.setup;
_sfc_main$1i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/6.vue");
  return _sfc_setup$1i ? _sfc_setup$1i(props, ctx) : void 0;
};
const meta$k = void 0;
class Maru$r {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const offsetX$z = 0;
const offsetY$z = 0;
var unitKyori$r = 0;
var maruArrArr$r = [];
const _sfc_main$1h = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$r = yokoInterval;
      maruArrArr$r = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$z - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$z;
        return new Maru$r(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$r.forEach((maruY) => maruY.forEach((maru) => {
        const hankei2 = unitKyori$r / 4;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1h = _sfc_main$1h.setup;
_sfc_main$1h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/1.vue");
  return _sfc_setup$1h ? _sfc_setup$1h(props, ctx) : void 0;
};
const meta$j = void 0;
class Maru$q {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  rotatedMaru(kaiten2) {
    return new Maru$q(this.x * Math.cos(kaiten2) - this.y * Math.sin(kaiten2), this.x * Math.sin(kaiten2) + this.y * Math.cos(kaiten2));
  }
}
const offsetX$y = 0;
const offsetY$y = 0;
var unitKyori$q = 0;
var maruArrArr$q = [];
var kaiten$1 = 0;
const _sfc_main$1g = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$q = yokoInterval;
      maruArrArr$q = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$y - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$y;
        return new Maru$q(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      if (yubiTouched) {
        kaiten$1 += Math.PI / 36;
        console.log(kaiten$1);
      }
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$q.forEach((maruY) => maruY.forEach((maru) => {
        const rotated = maru.rotatedMaru(kaiten$1);
        const hankei2 = unitKyori$q / 4;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rotated.x, rotated.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1g = _sfc_main$1g.setup;
_sfc_main$1g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/2.vue");
  return _sfc_setup$1g ? _sfc_setup$1g(props, ctx) : void 0;
};
const meta$i = void 0;
class Maru$p {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  rotate(curYubiX, curYubiY, kaiten2) {
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
}
const offsetX$x = 0;
const offsetY$x = 0;
var unitKyori$p = 0;
var maruArrArr$p = [];
const _sfc_main$1f = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$p = yokoInterval;
      maruArrArr$p = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$x - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$x;
        return new Maru$p(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$p.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        }
        const hankei2 = unitKyori$p / 4;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1f = _sfc_main$1f.setup;
_sfc_main$1f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/3.vue");
  return _sfc_setup$1f ? _sfc_setup$1f(props, ctx) : void 0;
};
const meta$h = void 0;
class Maru$o {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig) {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
}
const offsetX$w = 0;
const offsetY$w = 0;
var unitKyori$o = 0;
var maruArrArr$o = [];
const _sfc_main$1e = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$o = yokoInterval;
      maruArrArr$o = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$w - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$w;
        return new Maru$o(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$o.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        }
        const hankei2 = unitKyori$o / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1e = _sfc_main$1e.setup;
_sfc_main$1e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/4.vue");
  return _sfc_setup$1e ? _sfc_setup$1e(props, ctx) : void 0;
};
const meta$g = void 0;
class Maru$n {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig) {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
}
const offsetX$v = 0;
const offsetY$v = 0;
var unitKyori$n = 0;
var maruArrArr$n = [];
const _sfc_main$1d = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$n = yokoInterval;
      maruArrArr$n = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$v - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$v;
        return new Maru$n(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.rect(0, 0, screenWidth, screenHeight);
      ctx.fill();
      maruArrArr$n.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        }
        const hankei2 = unitKyori$n / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1d = _sfc_main$1d.setup;
_sfc_main$1d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/5.vue");
  return _sfc_setup$1d ? _sfc_setup$1d(props, ctx) : void 0;
};
const meta$f = void 0;
class Maru$m {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    __publicField(this, "moto_x");
    __publicField(this, "moto_y");
    this.x = x;
    this.y = y;
    this.moto_x = x;
    this.moto_y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig) {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
  movoToMoto() {
    this.x += (this.moto_x - this.x) / 10;
    this.y += (this.moto_y - this.y) / 10;
  }
}
const offsetX$u = 0;
const offsetY$u = 0;
var unitKyori$m = 0;
var maruArrArr$m = [];
const _sfc_main$1c = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$m = yokoInterval;
      maruArrArr$m = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$u - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$u;
        return new Maru$m(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.rect(0, 0, screenWidth, screenHeight);
      ctx.fill();
      maruArrArr$m.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        } else {
          maru.movoToMoto();
        }
        const hankei2 = unitKyori$m / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1c = _sfc_main$1c.setup;
_sfc_main$1c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/6.vue");
  return _sfc_setup$1c ? _sfc_setup$1c(props, ctx) : void 0;
};
const meta$e = void 0;
class Maru$l {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    __publicField(this, "moto_x");
    __publicField(this, "moto_y");
    this.x = x;
    this.y = y;
    this.moto_x = x;
    this.moto_y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig, bai2) {
    console.log(bai2);
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki * bai2;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
  movoToMoto() {
    this.x += (this.moto_x - this.x) / 10;
    this.y += (this.moto_y - this.y) / 10;
  }
}
const offsetX$t = 0;
const offsetY$t = 0;
var unitKyori$l = 0;
var maruArrArr$l = [];
var bai$1 = 0;
const _sfc_main$1b = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$l = yokoInterval;
      maruArrArr$l = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$t - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$t;
        return new Maru$l(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      if (yubiTouched) {
        bai$1 = Math.min(bai$1 + 5e-3, 1);
      } else {
        bai$1 = 0;
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.rect(0, 0, screenWidth, screenHeight);
      ctx.fill();
      maruArrArr$l.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36, bai$1);
        } else {
          maru.movoToMoto();
        }
        const hankei2 = unitKyori$l / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1b = _sfc_main$1b.setup;
_sfc_main$1b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/7.vue");
  return _sfc_setup$1b ? _sfc_setup$1b(props, ctx) : void 0;
};
const meta$d = void 0;
class Point$h {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var ten$b = [];
const _sfc_main$1a = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$b = [...Array(4).keys()].map((idx) => {
        return new Point$h(screenWidth / 2, screenHeight / 2);
      });
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$b.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const hankei2 = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ten$b.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      });
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$1a = _sfc_main$1a.setup;
_sfc_main$1a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/1.vue");
  return _sfc_setup$1a ? _sfc_setup$1a(props, ctx) : void 0;
};
const meta$c = void 0;
class Point$g {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var ten$a = [];
const _sfc_main$19 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$a = [...Array(4).keys()].map((idx) => {
        return new Point$g(screenWidth / 2, screenHeight / 2);
      });
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$a.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$a[0].x, ten$a[0].y);
      ctx.bezierCurveTo(ten$a[1].x, ten$a[1].y, ten$a[2].x, ten$a[2].y, ten$a[3].x, ten$a[3].y);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(ten$a[0].x, ten$a[0].y);
      ctx.lineTo(ten$a[1].x, ten$a[1].y);
      ctx.lineTo(ten$a[2].x, ten$a[2].y);
      ctx.lineTo(ten$a[3].x, ten$a[3].y);
      ctx.stroke();
      const hankei2 = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ten$a.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      });
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/2.vue");
  return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
const meta$b = void 0;
class Point$f {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$k {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var ten$9 = [];
var maruArrArr$k = [];
var unitKyori$k = 0;
const _sfc_main$18 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$9 = [...Array(4).keys()].map((idx) => {
        return new Point$f(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$k = yokoInterval;
      maruArrArr$k = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$k(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$9.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const hankei2 = unitKyori$k / 4;
      maruArrArr$k.forEach((maruY) => maruY.forEach((maru) => {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$9[0].x, ten$9[0].y);
      ctx.bezierCurveTo(ten$9[1].x, ten$9[1].y, ten$9[2].x, ten$9[2].y, ten$9[3].x, ten$9[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$9[0].x, ten$9[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$9[3].x, ten$9[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/3.vue");
  return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
const meta$a = void 0;
class Point$e {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$j {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayuHantei(p0, p1) {
    const x1 = p1.x - p0.x;
    const y1 = p1.y - p0.y;
    const x2 = this.x - p0.x;
    const y2 = this.y - p0.y;
    return Math.sign(x1 * y2 - x2 * y1);
  }
}
var ten$8 = [];
var maruArrArr$j = [];
var unitKyori$j = 0;
const _sfc_main$17 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$8 = [...Array(4).keys()].map((idx) => {
        return new Point$e(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$j = yokoInterval;
      maruArrArr$j = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$j(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$8.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const hankei2 = unitKyori$j / 4;
      maruArrArr$j.forEach((maruY) => maruY.forEach((maru) => {
        ctx.strokeStyle = maru.sayuHantei(ten$8[3], ten$8[0]) === 1 ? "red" : "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$8[0].x, ten$8[0].y);
      ctx.bezierCurveTo(ten$8[1].x, ten$8[1].y, ten$8[2].x, ten$8[2].y, ten$8[3].x, ten$8[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$8[0].x, ten$8[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$8[3].x, ten$8[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/4.vue");
  return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
const meta$9 = void 0;
class Point$d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$i {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayuHantei(p0, p1) {
    const x1 = p1.x - p0.x;
    const y1 = p1.y - p0.y;
    const x2 = this.x - p0.x;
    const y2 = this.y - p0.y;
    return Math.sign(x1 * y2 - x2 * y1);
  }
  sayuHantei4Points(p) {
    const sayu = this.sayuHantei(p[3], p[2]) + this.sayuHantei(p[2], p[1]) + this.sayuHantei(p[1], p[0]);
    if (sayu === 3) {
      return {
        storokeStyle: "red",
        hankeiRate: 0.7
      };
    } else if (sayu === -3) {
      return {
        storokeStyle: "black",
        hankeiRate: 0.7
      };
    } else {
      return {
        storokeStyle: "grey",
        hankeiRate: 0.35
      };
    }
  }
}
var ten$7 = [];
var maruArrArr$i = [];
var unitKyori$i = 0;
const _sfc_main$16 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$7 = [...Array(4).keys()].map((idx) => {
        return new Point$d(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$i = yokoInterval;
      maruArrArr$i = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$i(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$7.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$i.forEach((maruY) => maruY.forEach((maru) => {
        const hanteiResult = maru.sayuHantei4Points(ten$7);
        ctx.strokeStyle = hanteiResult.storokeStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, unitKyori$i * hanteiResult.hankeiRate, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$7[0].x, ten$7[0].y);
      ctx.bezierCurveTo(ten$7[1].x, ten$7[1].y, ten$7[2].x, ten$7[2].y, ten$7[3].x, ten$7[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$7[0].x, ten$7[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$7[3].x, ten$7[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/5.vue");
  return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
const meta$8 = void 0;
class Point$c {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$h {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayuHantei(p0, p1) {
    const x1 = p1.x - p0.x;
    const y1 = p1.y - p0.y;
    const x2 = this.x - p0.x;
    const y2 = this.y - p0.y;
    return Math.sign(x1 * y2 - x2 * y1);
  }
  sayuHantei4Points(p) {
    const sayu = this.sayuHantei(p[3], p[2]) + this.sayuHantei(p[2], p[1]) + this.sayuHantei(p[1], p[0]);
    if (sayu === 3) {
      return {
        storokeStyle: "red",
        hankeiRate: 0.7
      };
    } else if (sayu === -3) {
      return {
        storokeStyle: "black",
        hankeiRate: 0.7
      };
    } else {
      return {
        storokeStyle: "grey",
        hankeiRate: 0.35
      };
    }
  }
  vertexRokkaku(hankei2) {
    return [...Array(6).keys()].map((idx) => {
      return new Point$c(this.x + hankei2 * Math.sin(Math.PI * 2 / 6 * idx), this.y + hankei2 * Math.cos(Math.PI * 2 / 6 * idx));
    });
  }
}
var ten$6 = [];
var maruArrArr$h = [];
var unitKyori$h = 0;
const _sfc_main$15 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$6 = [...Array(4).keys()].map((idx) => {
        return new Point$c(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$h = yokoInterval;
      maruArrArr$h = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$h(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$6.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$h.forEach((maruY) => maruY.forEach((maru) => {
        const hanteiResult = maru.sayuHantei4Points(ten$6);
        const vertex = maru.vertexRokkaku(unitKyori$h * hanteiResult.hankeiRate);
        ctx.strokeStyle = hanteiResult.storokeStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(vertex[0].x, vertex[0].y);
        vertex.splice(1).forEach((v) => ctx.lineTo(v.x, v.y));
        ctx.closePath();
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$6[0].x, ten$6[0].y);
      ctx.bezierCurveTo(ten$6[1].x, ten$6[1].y, ten$6[2].x, ten$6[2].y, ten$6[3].x, ten$6[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$6[0].x, ten$6[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$6[3].x, ten$6[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/6.vue");
  return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
const meta$7 = void 0;
class Choten$9 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$9(this.x, this.y, this.z + gc);
  }
  tx(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.x / g.z;
  }
  ty(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.y / g.z;
  }
}
const henLength$9 = 400;
var choten$9 = [
  new Choten$9(henLength$9, henLength$9, henLength$9),
  new Choten$9(henLength$9, henLength$9, -henLength$9),
  new Choten$9(-henLength$9, henLength$9, -henLength$9),
  new Choten$9(-henLength$9, henLength$9, henLength$9),
  new Choten$9(henLength$9, -henLength$9, henLength$9),
  new Choten$9(henLength$9, -henLength$9, -henLength$9),
  new Choten$9(-henLength$9, -henLength$9, -henLength$9),
  new Choten$9(-henLength$9, -henLength$9, henLength$9)
];
const _sfc_main$14 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const gc = 3e3;
      const sc = 2e3;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(choten$9[0].tx(gc, sc), choten$9[0].ty(gc, sc));
      ctx.lineTo(choten$9[1].tx(gc, sc), choten$9[1].ty(gc, sc));
      ctx.lineTo(choten$9[2].tx(gc, sc), choten$9[2].ty(gc, sc));
      ctx.lineTo(choten$9[3].tx(gc, sc), choten$9[3].ty(gc, sc));
      ctx.lineTo(choten$9[0].tx(gc, sc), choten$9[0].ty(gc, sc));
      ctx.lineTo(choten$9[4].tx(gc, sc), choten$9[4].ty(gc, sc));
      ctx.lineTo(choten$9[5].tx(gc, sc), choten$9[5].ty(gc, sc));
      ctx.lineTo(choten$9[6].tx(gc, sc), choten$9[6].ty(gc, sc));
      ctx.lineTo(choten$9[7].tx(gc, sc), choten$9[7].ty(gc, sc));
      ctx.lineTo(choten$9[4].tx(gc, sc), choten$9[4].ty(gc, sc));
      ctx.moveTo(choten$9[1].tx(gc, sc), choten$9[1].ty(gc, sc));
      ctx.lineTo(choten$9[5].tx(gc, sc), choten$9[5].ty(gc, sc));
      ctx.moveTo(choten$9[2].tx(gc, sc), choten$9[2].ty(gc, sc));
      ctx.lineTo(choten$9[6].tx(gc, sc), choten$9[6].ty(gc, sc));
      ctx.moveTo(choten$9[3].tx(gc, sc), choten$9[3].ty(gc, sc));
      ctx.lineTo(choten$9[7].tx(gc, sc), choten$9[7].ty(gc, sc));
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/1.vue");
  return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
const meta$6 = void 0;
class Choten$8 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$8(this.x, this.y, this.z + gc);
  }
  tx(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.x / g.z;
  }
  ty(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.y / g.z;
  }
}
const henLength$8 = 400;
var choten$8 = [
  new Choten$8(henLength$8, henLength$8, henLength$8),
  new Choten$8(henLength$8, henLength$8, -henLength$8),
  new Choten$8(-henLength$8, henLength$8, -henLength$8),
  new Choten$8(-henLength$8, henLength$8, henLength$8),
  new Choten$8(henLength$8, -henLength$8, henLength$8),
  new Choten$8(henLength$8, -henLength$8, -henLength$8),
  new Choten$8(-henLength$8, -henLength$8, -henLength$8),
  new Choten$8(-henLength$8, -henLength$8, henLength$8)
];
const _sfc_main$13 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(choten$8[0].tx(gc, sc), choten$8[0].ty(gc, sc));
      ctx.lineTo(choten$8[1].tx(gc, sc), choten$8[1].ty(gc, sc));
      ctx.lineTo(choten$8[2].tx(gc, sc), choten$8[2].ty(gc, sc));
      ctx.lineTo(choten$8[3].tx(gc, sc), choten$8[3].ty(gc, sc));
      ctx.lineTo(choten$8[0].tx(gc, sc), choten$8[0].ty(gc, sc));
      ctx.lineTo(choten$8[4].tx(gc, sc), choten$8[4].ty(gc, sc));
      ctx.lineTo(choten$8[5].tx(gc, sc), choten$8[5].ty(gc, sc));
      ctx.lineTo(choten$8[6].tx(gc, sc), choten$8[6].ty(gc, sc));
      ctx.lineTo(choten$8[7].tx(gc, sc), choten$8[7].ty(gc, sc));
      ctx.lineTo(choten$8[4].tx(gc, sc), choten$8[4].ty(gc, sc));
      ctx.moveTo(choten$8[1].tx(gc, sc), choten$8[1].ty(gc, sc));
      ctx.lineTo(choten$8[5].tx(gc, sc), choten$8[5].ty(gc, sc));
      ctx.moveTo(choten$8[2].tx(gc, sc), choten$8[2].ty(gc, sc));
      ctx.lineTo(choten$8[6].tx(gc, sc), choten$8[6].ty(gc, sc));
      ctx.moveTo(choten$8[3].tx(gc, sc), choten$8[3].ty(gc, sc));
      ctx.lineTo(choten$8[7].tx(gc, sc), choten$8[7].ty(gc, sc));
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/2.vue");
  return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
const meta$5 = void 0;
class Point$b {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Choten$7 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$7(this.x, this.y, this.z + gc);
  }
  toei(gc, sc) {
    const g = this.gxyz(gc);
    return new Point$b(sc * g.x / g.z, sc * g.y / g.z);
  }
  kaiten(kx, ky, kz) {
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;
    return new Choten$7(x2, y2, z2);
  }
}
const henLength$7 = 400;
var choten$7 = [
  new Choten$7(henLength$7, henLength$7, henLength$7),
  new Choten$7(henLength$7, henLength$7, -henLength$7),
  new Choten$7(-henLength$7, henLength$7, -henLength$7),
  new Choten$7(-henLength$7, henLength$7, henLength$7),
  new Choten$7(henLength$7, -henLength$7, henLength$7),
  new Choten$7(henLength$7, -henLength$7, -henLength$7),
  new Choten$7(-henLength$7, -henLength$7, -henLength$7),
  new Choten$7(-henLength$7, -henLength$7, henLength$7)
];
var kakudoX$5 = 0;
var kakudoY$5 = 0;
var kakudoZ$5 = 0;
const _sfc_main$12 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      kakudoX$5 += Math.PI * 0.01;
      kakudoY$5 += -Math.PI * 0.02;
      kakudoZ$5 += -Math.PI * 0.03;
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      const chotenRotated = choten$7.map((c) => c.kaiten(kakudoX$5, kakudoY$5, kakudoZ$5));
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/3.vue");
  return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
const meta$4 = void 0;
class Point$a {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Choten$6 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$6(this.x, this.y, this.z + gc);
  }
  toei(gc, sc) {
    const g = this.gxyz(gc);
    return new Point$a(sc * g.x / g.z, sc * g.y / g.z);
  }
  kaiten(kx, ky, kz) {
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;
    return new Choten$6(x2, y2, z2);
  }
}
const henLength$6 = 400;
var choten$6 = [
  new Choten$6(henLength$6, henLength$6, henLength$6),
  new Choten$6(henLength$6, henLength$6, -henLength$6),
  new Choten$6(-henLength$6, henLength$6, -henLength$6),
  new Choten$6(-henLength$6, henLength$6, henLength$6),
  new Choten$6(henLength$6, -henLength$6, henLength$6),
  new Choten$6(henLength$6, -henLength$6, -henLength$6),
  new Choten$6(-henLength$6, -henLength$6, -henLength$6),
  new Choten$6(-henLength$6, -henLength$6, henLength$6)
];
var kakudoX$4 = 0;
var kakudoY$4 = 0;
var kakudoZ$4 = 0;
var preYubiX$3 = 0;
var preYubiY$3 = 0;
var kakudoXstep$3 = 0;
var kakudoYstep$3 = 0;
var kakudoZstep$3 = 0;
const _sfc_main$11 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      kakudoX$4 += kakudoXstep$3;
      kakudoY$4 += kakudoYstep$3;
      kakudoZ$4 += kakudoZstep$3;
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      const chotenRotated = choten$6.map((c) => c.kaiten(kakudoX$4, kakudoY$4, kakudoZ$4));
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      preYubiX$3 = curYubiX;
      preYubiY$3 = curYubiY;
      kakudoXstep$3 = 0;
      kakudoYstep$3 = 0;
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
      if (yubiTouched) {
        kakudoYstep$3 = (curYubiX - preYubiX$3) * 0.03;
        kakudoXstep$3 = (curYubiY - preYubiY$3) * 0.03;
        preYubiX$3 = curYubiX;
        preYubiY$3 = curYubiY;
      }
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/4.vue");
  return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
const meta$3 = void 0;
class Point$9 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Choten$5 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$5(this.x, this.y, this.z + gc);
  }
  toei(gc, sc) {
    const g = this.gxyz(gc);
    return new Point$9(sc * g.x / g.z, sc * g.y / g.z);
  }
  kaiten(kx, ky, kz) {
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;
    return new Choten$5(x2, y2, z2);
  }
}
class BezierChoten$1 {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }
}
var bezCt$1 = [];
const bezCtLoc$1 = [
  [57, 36.1, 0, 53.5, 41.8, 0, 47, 41.8, 0],
  [43.8, 41.8, 0, 42.6, 40.5, 0, 38, 35.9, 0],
  [35.4, 33.1, 0, 33.1, 33.1, 0, 25.6, 33, 0],
  [25.6, 33, 0, 25.6, 32, 0, 25.6, 32, 0],
  [32.5, 30.3, 0, 36.4, 29.4, 0, 36.4, 23.6, 0],
  [36.4, 15, 0, 25.5, 3.1, 0, 13.5, 3.1, 0],
  [9.9, 3.1, 0, 6, 4.3, 0, 4.5, 4.8, 0],
  [10.5, 9.3, 0, 20.4, 18.6, 0, 20.4, 31.8, 0],
  [20.4, 47.6, 0, 4.1, 52.6, 0, -2.8, 52.6, 0],
  [-5.8, 52.6, 0, -7.9, 52.3, 0, -8.4, 48.6, 0],
  [-9.4, 42.1, 0, -9.6, 40.3, 0, -23.3, 30.9, 0],
  [-23.3, 30.9, 0, -22.6, 30.3, 0, -22.6, 30.3, 0],
  [-19.5, 31.1, 0, -13.75, 32.8, 0, -8.3, 32.8, 0],
  [-5.3, 32.8, 0, 0.4, 32.8, 0, 0.4, 27.3, 0],
  [0.4, 25.9, 0, -0.1, 19.4, 0, -7.8, 11.1, 0],
  [-23.4, 21.1, 0, -30.3, 32.8, 0, -35.9, 42.3, 0],
  [-36.5, 43.3, 0, -40.5, 49.4, 0, -43.9, 49.4, 0],
  [-47.3, 49.4, 0, -54.8, 43.4, 0, -54.8, 33.1, 0],
  [-54.8, 24.4, 0, -50.4, 20.4, 0, -43.9, 14.3, 0],
  [-44.8, 16.8, 0, -45, 17.8, 0, -45, 18.9, 0],
  [-45, 21.25, 0, -44.3, 23.6, 0, -41.6, 23.6, 0],
  [-39.8, 23.6, 0, -38.3, 23.3, 0, -30.3, 18.4, 0],
  [-21.9, 13.1, 0, -15.8, 10.1, 0, -11, 7.8, 0],
  [-19.8, -1, 0, -20.1, -5.1, 0, -20.1, -8.3, 0],
  [-20.1, -15.5, 0, -15.6, -18.9, 0, -13.3, -20.8, 0],
  [-9.4, -23.75, 0, -8.9, -24.1, 0, -8.9, -25.1, 0],
  [-8.9, -26.1, 0, -9.6, -27, 0, -13, -29.3, 0],
  [-19.1, -33.4, 0, -23.1, -41.25, 0, -23.1, -49.1, 0],
  [-23.1, -50.8, 0, -23, -51.9, 0, -22.8, -53.75, 0],
  [-16.4, -43.6, 0, -11.9, -43.4, 0, 2.3, -42.3, 0],
  [8.4, -41.8, 0, 16.25, -35, 0, 16.25, -26.9, 0],
  [16.25, -20.8, 0, 10.9, -19.3, 0, 8.4, -19.3, 0],
  [6.6, -19.3, 0, -1.4, -20.9, 0, -3, -20.9, 0],
  [-9.4, -20.9, 0, -15.5, -17.1, 0, -15.5, -13.5, 0],
  [-15.5, -8.3, 0, -6.8, -2.6, 0, 1.4, 2.6, 0],
  [7.9, 0.3, 0, 14.1, -0.9, 0, 21, -0.9, 0],
  [47.8, -0.9, 0, 57, 19.3, 0, 57, 30.3, 0],
  [57, 36.1, 0, 53.5, 41.8, 0, 47, 41.8, 0]
];
const henLength$5 = 400;
var choten$5 = [
  new Choten$5(henLength$5, henLength$5, henLength$5),
  new Choten$5(henLength$5, henLength$5, -henLength$5),
  new Choten$5(-henLength$5, henLength$5, -henLength$5),
  new Choten$5(-henLength$5, henLength$5, henLength$5),
  new Choten$5(henLength$5, -henLength$5, henLength$5),
  new Choten$5(henLength$5, -henLength$5, -henLength$5),
  new Choten$5(-henLength$5, -henLength$5, -henLength$5),
  new Choten$5(-henLength$5, -henLength$5, henLength$5)
];
var kakudoX$3 = 0;
var kakudoY$3 = 0;
var kakudoZ$3 = 0;
var preYubiX$2 = 0;
var preYubiY$2 = 0;
var kakudoXstep$2 = 0;
var kakudoYstep$2 = 0;
var kakudoZstep$2 = 0;
const _sfc_main$10 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const bezUnit = henLength$5 / 100;
      bezCt$1 = bezCtLoc$1.map((loc) => new BezierChoten$1(new Choten$5(loc[0] * bezUnit, loc[1] * bezUnit, loc[2] * bezUnit), new Choten$5(loc[3] * bezUnit, loc[4] * bezUnit, loc[5] * bezUnit), new Choten$5(loc[6] * bezUnit, loc[7] * bezUnit, loc[8] * bezUnit)));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      kakudoX$3 += kakudoXstep$2;
      kakudoY$3 += kakudoYstep$2;
      kakudoZ$3 += kakudoZstep$2;
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      const chotenRotated = choten$5.map((c) => c.kaiten(kakudoX$3, kakudoY$3, kakudoZ$3));
      const bezRotated = bezCt$1.map((bez) => new BezierChoten$1(bez.p1.kaiten(kakudoX$3, kakudoY$3, kakudoZ$3), bez.p2.kaiten(kakudoX$3, kakudoY$3, kakudoZ$3), bez.p3.kaiten(kakudoX$3, kakudoY$3, kakudoZ$3)));
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      {
        const p3 = bezRotated[0].p3.toei(gc, sc);
        ctx.moveTo(p3.x, p3.y);
      }
      bezRotated.splice(1).forEach((bez) => {
        const p1 = bez.p1.toei(gc, sc);
        const p2 = bez.p2.toei(gc, sc);
        const p3 = bez.p3.toei(gc, sc);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      });
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      preYubiX$2 = curYubiX;
      preYubiY$2 = curYubiY;
      kakudoXstep$2 = 0;
      kakudoYstep$2 = 0;
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
      if (yubiTouched) {
        kakudoYstep$2 = (curYubiX - preYubiX$2) * 0.03;
        kakudoXstep$2 = (curYubiY - preYubiY$2) * 0.03;
        preYubiX$2 = curYubiX;
        preYubiY$2 = curYubiY;
      }
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
const _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/5.vue");
  return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
const meta$2 = void 0;
const meta$1 = void 0;
const meta = void 0;
const routes = [
  {
    "name": "chapter01-0",
    "path": "/chapter01/0",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter01/0.vue",
    "children": [],
    "meta": meta$Y,
    "component": () => Promise.resolve().then(function() {
      return _0$1;
    })
  },
  {
    "name": "chapter01-1",
    "path": "/chapter01/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter01/1.vue",
    "children": [],
    "meta": meta$X,
    "component": () => Promise.resolve().then(function() {
      return _1$j;
    })
  },
  {
    "name": "chapter01-2",
    "path": "/chapter01/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter01/2.vue",
    "children": [],
    "meta": meta$W,
    "component": () => Promise.resolve().then(function() {
      return _2$j;
    })
  },
  {
    "name": "chapter02-1",
    "path": "/chapter02/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/1.vue",
    "children": [],
    "meta": meta$V,
    "component": () => Promise.resolve().then(function() {
      return _1$h;
    })
  },
  {
    "name": "chapter02-2",
    "path": "/chapter02/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/2.vue",
    "children": [],
    "meta": meta$U,
    "component": () => Promise.resolve().then(function() {
      return _2$h;
    })
  },
  {
    "name": "chapter02-3",
    "path": "/chapter02/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/3.vue",
    "children": [],
    "meta": meta$T,
    "component": () => Promise.resolve().then(function() {
      return _3$h;
    })
  },
  {
    "name": "chapter02-4",
    "path": "/chapter02/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/4.vue",
    "children": [],
    "meta": meta$S,
    "component": () => Promise.resolve().then(function() {
      return _4$h;
    })
  },
  {
    "name": "chapter02-5",
    "path": "/chapter02/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/5.vue",
    "children": [],
    "meta": meta$R,
    "component": () => Promise.resolve().then(function() {
      return _5$f;
    })
  },
  {
    "name": "chapter02-6",
    "path": "/chapter02/6",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/6.vue",
    "children": [],
    "meta": meta$Q,
    "component": () => Promise.resolve().then(function() {
      return _6$b;
    })
  },
  {
    "name": "chapter02-7",
    "path": "/chapter02/7",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/7.vue",
    "children": [],
    "meta": meta$P,
    "component": () => Promise.resolve().then(function() {
      return _7$5;
    })
  },
  {
    "name": "chapter02-8",
    "path": "/chapter02/8",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/8.vue",
    "children": [],
    "meta": meta$O,
    "component": () => Promise.resolve().then(function() {
      return _8$3;
    })
  },
  {
    "name": "chapter02-9",
    "path": "/chapter02/9",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter02/9.vue",
    "children": [],
    "meta": meta$N,
    "component": () => Promise.resolve().then(function() {
      return _9$1;
    })
  },
  {
    "name": "chapter03-1",
    "path": "/chapter03/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter03/1.vue",
    "children": [],
    "meta": meta$M,
    "component": () => Promise.resolve().then(function() {
      return _1$f;
    })
  },
  {
    "name": "chapter03-2",
    "path": "/chapter03/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter03/2.vue",
    "children": [],
    "meta": meta$L,
    "component": () => Promise.resolve().then(function() {
      return _2$f;
    })
  },
  {
    "name": "chapter03-3",
    "path": "/chapter03/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter03/3.vue",
    "children": [],
    "meta": meta$K,
    "component": () => Promise.resolve().then(function() {
      return _3$f;
    })
  },
  {
    "name": "chapter03-4",
    "path": "/chapter03/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter03/4.vue",
    "children": [],
    "meta": meta$J,
    "component": () => Promise.resolve().then(function() {
      return _4$f;
    })
  },
  {
    "name": "chapter03-5",
    "path": "/chapter03/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter03/5.vue",
    "children": [],
    "meta": meta$I,
    "component": () => Promise.resolve().then(function() {
      return _5$d;
    })
  },
  {
    "name": "chapter04-1",
    "path": "/chapter04/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/1.vue",
    "children": [],
    "meta": meta$H,
    "component": () => Promise.resolve().then(function() {
      return _1$d;
    })
  },
  {
    "name": "chapter04-2",
    "path": "/chapter04/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/2.vue",
    "children": [],
    "meta": meta$G,
    "component": () => Promise.resolve().then(function() {
      return _2$d;
    })
  },
  {
    "name": "chapter04-3",
    "path": "/chapter04/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/3.vue",
    "children": [],
    "meta": meta$F,
    "component": () => Promise.resolve().then(function() {
      return _3$d;
    })
  },
  {
    "name": "chapter04-4",
    "path": "/chapter04/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/4.vue",
    "children": [],
    "meta": meta$E,
    "component": () => Promise.resolve().then(function() {
      return _4$d;
    })
  },
  {
    "name": "chapter04-5",
    "path": "/chapter04/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/5.vue",
    "children": [],
    "meta": meta$D,
    "component": () => Promise.resolve().then(function() {
      return _5$b;
    })
  },
  {
    "name": "chapter04-6",
    "path": "/chapter04/6",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/6.vue",
    "children": [],
    "meta": meta$C,
    "component": () => Promise.resolve().then(function() {
      return _6$9;
    })
  },
  {
    "name": "chapter04-7",
    "path": "/chapter04/7",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/7.vue",
    "children": [],
    "meta": meta$B,
    "component": () => Promise.resolve().then(function() {
      return _7$3;
    })
  },
  {
    "name": "chapter04-8",
    "path": "/chapter04/8",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter04/8.vue",
    "children": [],
    "meta": meta$A,
    "component": () => Promise.resolve().then(function() {
      return _8$1;
    })
  },
  {
    "name": "chapter05-1",
    "path": "/chapter05/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter05/1.vue",
    "children": [],
    "meta": meta$z,
    "component": () => Promise.resolve().then(function() {
      return _1$b;
    })
  },
  {
    "name": "chapter05-2",
    "path": "/chapter05/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter05/2.vue",
    "children": [],
    "meta": meta$y,
    "component": () => Promise.resolve().then(function() {
      return _2$b;
    })
  },
  {
    "name": "chapter05-3",
    "path": "/chapter05/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter05/3.vue",
    "children": [],
    "meta": meta$x,
    "component": () => Promise.resolve().then(function() {
      return _3$b;
    })
  },
  {
    "name": "chapter05-4",
    "path": "/chapter05/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter05/4.vue",
    "children": [],
    "meta": meta$w,
    "component": () => Promise.resolve().then(function() {
      return _4$b;
    })
  },
  {
    "name": "chapter05-5",
    "path": "/chapter05/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter05/5.vue",
    "children": [],
    "meta": meta$v,
    "component": () => Promise.resolve().then(function() {
      return _5$9;
    })
  },
  {
    "name": "chapter05-6",
    "path": "/chapter05/6",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter05/6.vue",
    "children": [],
    "meta": meta$u,
    "component": () => Promise.resolve().then(function() {
      return _6$7;
    })
  },
  {
    "name": "chapter06-1",
    "path": "/chapter06/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter06/1.vue",
    "children": [],
    "meta": meta$t,
    "component": () => Promise.resolve().then(function() {
      return _1$9;
    })
  },
  {
    "name": "chapter06-2",
    "path": "/chapter06/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter06/2.vue",
    "children": [],
    "meta": meta$s,
    "component": () => Promise.resolve().then(function() {
      return _2$9;
    })
  },
  {
    "name": "chapter06-3",
    "path": "/chapter06/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter06/3.vue",
    "children": [],
    "meta": meta$r,
    "component": () => Promise.resolve().then(function() {
      return _3$9;
    })
  },
  {
    "name": "chapter06-4",
    "path": "/chapter06/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter06/4.vue",
    "children": [],
    "meta": meta$q,
    "component": () => Promise.resolve().then(function() {
      return _4$9;
    })
  },
  {
    "name": "chapter07-1",
    "path": "/chapter07/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter07/1.vue",
    "children": [],
    "meta": meta$p,
    "component": () => Promise.resolve().then(function() {
      return _1$7;
    })
  },
  {
    "name": "chapter07-2",
    "path": "/chapter07/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter07/2.vue",
    "children": [],
    "meta": meta$o,
    "component": () => Promise.resolve().then(function() {
      return _2$7;
    })
  },
  {
    "name": "chapter07-3",
    "path": "/chapter07/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter07/3.vue",
    "children": [],
    "meta": meta$n,
    "component": () => Promise.resolve().then(function() {
      return _3$7;
    })
  },
  {
    "name": "chapter07-4",
    "path": "/chapter07/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter07/4.vue",
    "children": [],
    "meta": meta$m,
    "component": () => Promise.resolve().then(function() {
      return _4$7;
    })
  },
  {
    "name": "chapter07-5",
    "path": "/chapter07/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter07/5.vue",
    "children": [],
    "meta": meta$l,
    "component": () => Promise.resolve().then(function() {
      return _5$7;
    })
  },
  {
    "name": "chapter07-6",
    "path": "/chapter07/6",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter07/6.vue",
    "children": [],
    "meta": meta$k,
    "component": () => Promise.resolve().then(function() {
      return _6$5;
    })
  },
  {
    "name": "chapter08-1",
    "path": "/chapter08/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/1.vue",
    "children": [],
    "meta": meta$j,
    "component": () => Promise.resolve().then(function() {
      return _1$5;
    })
  },
  {
    "name": "chapter08-2",
    "path": "/chapter08/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/2.vue",
    "children": [],
    "meta": meta$i,
    "component": () => Promise.resolve().then(function() {
      return _2$5;
    })
  },
  {
    "name": "chapter08-3",
    "path": "/chapter08/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/3.vue",
    "children": [],
    "meta": meta$h,
    "component": () => Promise.resolve().then(function() {
      return _3$5;
    })
  },
  {
    "name": "chapter08-4",
    "path": "/chapter08/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/4.vue",
    "children": [],
    "meta": meta$g,
    "component": () => Promise.resolve().then(function() {
      return _4$5;
    })
  },
  {
    "name": "chapter08-5",
    "path": "/chapter08/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/5.vue",
    "children": [],
    "meta": meta$f,
    "component": () => Promise.resolve().then(function() {
      return _5$5;
    })
  },
  {
    "name": "chapter08-6",
    "path": "/chapter08/6",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/6.vue",
    "children": [],
    "meta": meta$e,
    "component": () => Promise.resolve().then(function() {
      return _6$3;
    })
  },
  {
    "name": "chapter08-7",
    "path": "/chapter08/7",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter08/7.vue",
    "children": [],
    "meta": meta$d,
    "component": () => Promise.resolve().then(function() {
      return _7$1;
    })
  },
  {
    "name": "chapter09-1",
    "path": "/chapter09/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter09/1.vue",
    "children": [],
    "meta": meta$c,
    "component": () => Promise.resolve().then(function() {
      return _1$3;
    })
  },
  {
    "name": "chapter09-2",
    "path": "/chapter09/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter09/2.vue",
    "children": [],
    "meta": meta$b,
    "component": () => Promise.resolve().then(function() {
      return _2$3;
    })
  },
  {
    "name": "chapter09-3",
    "path": "/chapter09/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter09/3.vue",
    "children": [],
    "meta": meta$a,
    "component": () => Promise.resolve().then(function() {
      return _3$3;
    })
  },
  {
    "name": "chapter09-4",
    "path": "/chapter09/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter09/4.vue",
    "children": [],
    "meta": meta$9,
    "component": () => Promise.resolve().then(function() {
      return _4$3;
    })
  },
  {
    "name": "chapter09-5",
    "path": "/chapter09/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter09/5.vue",
    "children": [],
    "meta": meta$8,
    "component": () => Promise.resolve().then(function() {
      return _5$3;
    })
  },
  {
    "name": "chapter09-6",
    "path": "/chapter09/6",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter09/6.vue",
    "children": [],
    "meta": meta$7,
    "component": () => Promise.resolve().then(function() {
      return _6$1;
    })
  },
  {
    "name": "chapter10-1",
    "path": "/chapter10/1",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter10/1.vue",
    "children": [],
    "meta": meta$6,
    "component": () => Promise.resolve().then(function() {
      return _1$1;
    })
  },
  {
    "name": "chapter10-2",
    "path": "/chapter10/2",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter10/2.vue",
    "children": [],
    "meta": meta$5,
    "component": () => Promise.resolve().then(function() {
      return _2$1;
    })
  },
  {
    "name": "chapter10-3",
    "path": "/chapter10/3",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter10/3.vue",
    "children": [],
    "meta": meta$4,
    "component": () => Promise.resolve().then(function() {
      return _3$1;
    })
  },
  {
    "name": "chapter10-4",
    "path": "/chapter10/4",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter10/4.vue",
    "children": [],
    "meta": meta$3,
    "component": () => Promise.resolve().then(function() {
      return _4$1;
    })
  },
  {
    "name": "chapter10-5",
    "path": "/chapter10/5",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/chapter10/5.vue",
    "children": [],
    "meta": meta$2,
    "component": () => Promise.resolve().then(function() {
      return _5$1;
    })
  },
  {
    "name": "index",
    "path": "/",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/index.vue",
    "children": [],
    "meta": meta$1,
    "component": () => Promise.resolve().then(function() {
      return index$1;
    })
  },
  {
    "name": "welcome",
    "path": "/welcome",
    "file": "/home/runner/work/DesigningMath/DesigningMath/pages/welcome.vue",
    "children": [],
    "meta": meta,
    "component": () => Promise.resolve().then(function() {
      return welcome$1;
    })
  }
];
const router_0e1a838c = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtNestedPage);
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtLayout", NuxtLayout);
  nuxtApp.vueApp.component("NuxtLink", vueRouter_cjs_prod.RouterLink);
  nuxtApp.vueApp.component("NuxtChild", NuxtNestedPage);
  const { baseURL } = useRuntimeConfig().app;
  const routerHistory = vueRouter_cjs_prod.createMemoryHistory(baseURL);
  const router = vueRouter_cjs_prod.createRouter({
    history: routerHistory,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = vue_cjs_prod.computed(() => router.currentRoute.value[key]);
  }
  nuxtApp._route = vue_cjs_prod.reactive(route);
  nuxtApp.hook("app:created", async () => {
    {
      router.push(nuxtApp.ssrContext.url);
    }
    await router.isReady();
    const is404 = router.currentRoute.value.matched.length === 0;
    if (is404) {
      const error = new Error(`Page not found: ${nuxtApp.ssrContext.url}`);
      error.statusCode = 404;
      nuxtApp.ssrContext.error = error;
    }
  });
  return { provide: { router } };
});
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/gi;
const ENC_BRACKET_CLOSE_RE = /%5D/gi;
const ENC_CARET_RE = /%5E/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_CURLY_OPEN_RE = /%7B/gi;
const ENC_PIPE_RE = /%7C/gi;
const ENC_CURLY_CLOSE_RE = /%7D/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeQueryValue(text) {
  return encode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch (_err) {
    return "" + text;
  }
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(paramsStr = "") {
  const obj = {};
  if (paramsStr[0] === "?") {
    paramsStr = paramsStr.substr(1);
  }
  for (const param of paramsStr.split("&")) {
    const s = param.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decode(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
function encodeQueryItem(key, val) {
  if (!val) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(val)) {
    return val.map((_val) => `${encodeQueryKey(key)}=${encodeQueryValue(_val)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(val)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).map((k) => encodeQueryItem(k, query[k])).join("&");
}
function hasProtocol(inputStr, acceptProtocolRelative = false) {
  return /^\w+:\/\/.+/.test(inputStr) || acceptProtocolRelative && /^\/\/[^/]+/.test(inputStr);
}
const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return (s0.slice(0, -1) || "/") + (s.length ? `?${s.join("?")}` : "");
}
function withTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length ? `?${s.join("?")}` : "");
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.substr(1) : input) || "/";
}
function withBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = __spreadValues(__spreadValues({}, parseQuery(parsed.search)), query);
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const i of input.filter(isNonEmptyURL)) {
    url = url ? withTrailingSlash(url) + withoutLeadingSlash(i) : i;
  }
  return url;
}
function parseURL(input = "", defaultProto) {
  if (!hasProtocol(input, true)) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [protocol = "", auth, hostAndPath] = (input.match(/([^:/]+:)?\/\/([^/@]+@)?(.*)/) || []).splice(1);
  const [host = "", path = ""] = (hostAndPath.match(/([^/?]*)(.*)?/) || []).splice(1);
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol,
    auth: auth ? auth.substr(0, auth.length - 1) : "",
    host,
    pathname,
    search,
    hash
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const fullpath = parsed.pathname + (parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "") + parsed.hash;
  if (!parsed.protocol) {
    return fullpath;
  }
  return parsed.protocol + "//" + (parsed.auth ? parsed.auth + "@" : "") + parsed.host + fullpath;
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, error, response) {
  let message = "";
  if (request && response) {
    message = `${response.status} ${response.statusText} (${request.toString()})`;
  }
  if (error) {
    message = `${error.message} (${message})`;
  }
  const fetchError = new FetchError(message);
  Object.defineProperty(fetchError, "request", { get() {
    return request;
  } });
  Object.defineProperty(fetchError, "response", { get() {
    return response;
  } });
  Object.defineProperty(fetchError, "data", { get() {
    return response && response._data;
  } });
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(val) {
  if (val === void 0) {
    return false;
  }
  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(val)) {
    return true;
  }
  return val.constructor && val.constructor.name === "Object" || typeof val.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const jsonTypes = /* @__PURE__ */ new Set(["application/json", "application/ld+json"]);
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift();
  if (jsonTypes.has(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504
]);
function createFetch(globalOptions) {
  const { fetch: fetch2, Headers: Headers2 } = globalOptions;
  function onError(ctx) {
    if (ctx.options.retry !== false) {
      const retries = typeof ctx.options.retry === "number" ? ctx.options.retry : isPayloadMethod(ctx.options.method) ? 0 : 1;
      const responseCode = ctx.response && ctx.response.status || 500;
      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        return $fetchRaw(ctx.request, __spreadProps(__spreadValues({}, ctx.options), {
          retry: retries - 1
        }));
      }
    }
    const err = createFetchError(ctx.request, ctx.error, ctx.response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, $fetchRaw);
    }
    throw err;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _opts = {}) {
    const ctx = {
      request: _request,
      options: __spreadValues(__spreadValues({}, globalOptions.defaults), _opts),
      response: void 0,
      error: void 0
    };
    if (ctx.options.onRequest) {
      await ctx.options.onRequest(ctx);
    }
    if (typeof ctx.request === "string") {
      if (ctx.options.baseURL) {
        ctx.request = withBase(ctx.request, ctx.options.baseURL);
      }
      if (ctx.options.params) {
        ctx.request = withQuery(ctx.request, ctx.options.params);
      }
      if (ctx.options.body && isPayloadMethod(ctx.options.method)) {
        if (isJSONSerializable(ctx.options.body)) {
          ctx.options.body = JSON.stringify(ctx.options.body);
          ctx.options.headers = new Headers2(ctx.options.headers);
          if (!ctx.options.headers.has("content-type")) {
            ctx.options.headers.set("content-type", "application/json");
          }
          if (!ctx.options.headers.has("accept")) {
            ctx.options.headers.set("accept", "application/json");
          }
        }
      }
    }
    ctx.response = await fetch2(ctx.request, ctx.options).catch(async (error) => {
      ctx.error = error;
      if (ctx.options.onRequestError) {
        await ctx.options.onRequestError(ctx);
      }
      return onError(ctx);
    });
    const responseType = (ctx.options.parseResponse ? "json" : ctx.options.responseType) || detectResponseType(ctx.response.headers.get("content-type") || "");
    if (responseType === "json") {
      const data = await ctx.response.text();
      const parseFn = ctx.options.parseResponse || destr;
      ctx.response._data = parseFn(data);
    } else {
      ctx.response._data = await ctx.response[responseType]();
    }
    if (ctx.options.onResponse) {
      await ctx.options.onResponse(ctx);
    }
    if (!ctx.response.ok) {
      if (ctx.options.onResponseError) {
        await ctx.options.onResponseError(ctx);
      }
    }
    return ctx.response.ok ? ctx.response : onError(ctx);
  };
  const $fetch2 = function $fetch22(request, opts) {
    return $fetchRaw(request, opts).then((r) => r._data);
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.create = (defaultOptions = {}) => createFetch(__spreadProps(__spreadValues({}, globalOptions), {
    defaults: __spreadValues(__spreadValues({}, globalOptions.defaults), defaultOptions)
  }));
  return $fetch2;
}
const _globalThis = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis.fetch || (() => Promise.reject(new Error("[ohmyfetch] globalThis.fetch is not supported!")));
const Headers = _globalThis.Headers;
const $fetch = createFetch({ fetch, Headers });
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch;
}
const nitroClient_33092f2b = () => {
};
const components = {
  "Designingmath": vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return designingmath;
  }).then((c) => c.default || c))
};
function components_515c5644(nuxtApp) {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
}
const _plugins = [
  preload,
  vueuseHead_a070f002,
  plugin_03b31df3,
  router_0e1a838c,
  nitroClient_33092f2b,
  components_515c5644
];
const _sfc_main$$ = {
  setup() {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
  }
};
function _sfc_ssrRender$$(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_App = vue_cjs_prod.resolveComponent("App");
  serverRenderer.exports.ssrRenderSuspense(_push, {
    default: () => {
      _push(serverRenderer.exports.ssrRenderComponent(_component_App, null, null, _parent));
    },
    _: 1
  });
}
const _sfc_setup$$ = _sfc_main$$.setup;
_sfc_main$$.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("node_modules/nuxt3/dist/app/components/nuxt-root.vue");
  return _sfc_setup$$ ? _sfc_setup$$(props, ctx) : void 0;
};
const RootComponent = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["ssrRender", _sfc_ssrRender$$]]);
const _sfc_main$_ = {};
function _sfc_ssrRender$_(_ctx, _push, _parent, _attrs) {
  const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$_ = _sfc_main$_.setup;
_sfc_main$_.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("app.vue");
  return _sfc_setup$_ ? _sfc_setup$_(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["ssrRender", _sfc_ssrRender$_]]);
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext = {}) {
    const vueApp = vue_cjs_prod.createApp(RootComponent);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    await applyPlugins(nuxt, plugins);
    await nuxt.hooks.callHook("app:created", vueApp);
    return vueApp;
  };
}
const bootstrap = (ctx) => entry(ctx);
const bootstrap$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": bootstrap
});
const _sfc_main$Z = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc 0");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc 0");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc 0");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc 0");
    }
  }
});
function _sfc_ssrRender$Z(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>0.vue \u95A2\u6570\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$Z = _sfc_main$Z.setup;
_sfc_main$Z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter01/0.vue");
  return _sfc_setup$Z ? _sfc_setup$Z(props, ctx) : void 0;
};
const _0 = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["ssrRender", _sfc_ssrRender$Z]]);
const _0$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _0
});
const _sfc_main$Y = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$Y(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 1 1-1 \u4ED5\u7D44\u307F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$Y = _sfc_main$Y.setup;
_sfc_main$Y.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter01/1.vue");
  return _sfc_setup$Y ? _sfc_setup$Y(props, ctx) : void 0;
};
const _1$i = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["ssrRender", _sfc_ssrRender$Y]]);
const _1$j = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$i
});
const _sfc_main$X = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$X(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 1 1-2 touchStart</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter01/2.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const _2$i = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["ssrRender", _sfc_ssrRender$X]]);
const _2$j = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$i
});
const _sfc_main$W = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.moveTo(200, 100);
      ctx.lineTo(800, 900);
      ctx.stroke();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$W(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-1 \u76F4\u7DDA\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/1.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const _1$g = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["ssrRender", _sfc_ssrRender$W]]);
const _1$h = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$g
});
const _sfc_main$V = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(screenWidth, screenHeight);
      ctx.lineTo(screenWidth / 3, screenHeight);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(screenWidth * 0.5, screenHeight * 0.1);
      ctx.lineTo(screenWidth, 0);
      ctx.lineTo(screenWidth * 0.8, screenHeight * 0.6);
      ctx.lineTo(screenWidth * 0.4, screenHeight * 0.2);
      ctx.fill();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$V(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-2 \u753B\u9762\u30B5\u30A4\u30BA\u3001\u7DDA\u3092\u3064\u306A\u3052\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/2.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const _2$g = /* @__PURE__ */ _export_sfc(_sfc_main$V, [["ssrRender", _sfc_ssrRender$V]]);
const _2$h = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$g
});
const _sfc_main$U = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.bezierCurveTo(300, 200, 100, 300, 200, 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(200, 500);
      ctx.quadraticCurveTo(300, 600, 100, 700);
      ctx.lineTo(100, 500);
      ctx.closePath();
      ctx.stroke();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$U(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-3 \u3044\u308D\u3044\u308D\u306A\u7DDA\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/3.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const _3$g = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["ssrRender", _sfc_ssrRender$U]]);
const _3$h = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$g
});
const _sfc_main$T = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.beginPath();
      ctx.arc(500, 200, 100, 30 / 180 * Math.PI, 120 / 180 * Math.PI, true);
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(500, 600, 200, 100, 45 / 180 * Math.PI, 30 / 180 * Math.PI, 120 / 180 * Math.PI, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(800, 100, 100, 200);
      ctx.fill();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$T(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-4 \u3044\u308D\u3044\u308D\u306A\u5F62\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/4.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const _4$g = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["ssrRender", _sfc_ssrRender$T]]);
const _4$h = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$g
});
const _sfc_main$S = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.lineWidth = 40;
      ctx.fillStyle = "pink";
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(400, 500, 300, 0, 180 * Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgb(160, 160, 160)";
      ctx.strokeStyle = "#990000";
      ctx.beginPath();
      ctx.arc(700, 500, 300, 0, 180 * Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(550, 800, 300, 0, 180 * Math.PI * 2, true);
      ctx.fill();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$S(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-5 \u8272\u306E\u8A2D\u5B9A</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/5.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const _5$e = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["ssrRender", _sfc_ssrRender$S]]);
const _5$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$e
});
const _sfc_main$R = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ctx.fillText("Designing Math.", screenWidth / 2, 200);
      ctx.strokeStyle = "black";
      ctx.font = "60px Serif";
      ctx.textAlign = "right";
      ctx.strokeText("Designing Math.", screenWidth / 2, 400);
      ctx.fillStyle = "grey";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.font = "80px Helvetica";
      ctx.textAlign = "center";
      ctx.strokeText("Designing Math.", screenWidth / 2, 600);
      ctx.fillText("Designing Math.", screenWidth / 2, 600);
      ctx.fillText("Designing Math.", screenWidth / 2, 800);
      ctx.strokeText("Designing Math.", screenWidth / 2, 800);
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$R(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-6 \u6587\u5B57\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/6.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const _6$a = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["ssrRender", _sfc_ssrRender$R]]);
const _6$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _6$a
});
const _sfc_main$Q = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$Q(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-7 \u52D5\u304D\u306E\u8868\u73FE\u3001\u6307\u306E\u4F4D\u7F6E</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/7.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const _7$4 = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["ssrRender", _sfc_ssrRender$Q]]);
const _7$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _7$4
});
const _sfc_main$P = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      if (yubiTouched) {
        ctx.beginPath();
        ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$P(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-8 \u30BF\u30C3\u30C1\u306E\u72B6\u614B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/8.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const _8$2 = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["ssrRender", _sfc_ssrRender$P]]);
const _8$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _8$2
});
const _sfc_main$O = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.lineWidth = 40;
      ctx.beginPath();
      ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI * 2);
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      ctx.strokeStyle = "red";
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
      ctx.strokeStyle = "pink";
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
      ctx.strokeStyle = "grey";
    }
  }
});
function _sfc_ssrRender$O(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 2 2-9 \u30BF\u30C3\u30C1\u30A4\u30D9\u30F3\u30C8</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter02/9.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const _9 = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["ssrRender", _sfc_ssrRender$O]]);
const _9$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _9
});
const unitKazu$f = 16;
const unitSize$f = 60;
const offsetX$s = 0;
const offsetY$s = 0;
const hankei = unitSize$f / 2;
const _sfc_main$N = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      [...Array(unitKazu$f).keys()].forEach((tateNum) => [...Array(unitKazu$f).keys()].forEach((yokoNum) => {
        const x = unitSize$f * yokoNum + offsetX$s;
        const y = unitSize$f * tateNum + offsetY$s;
        ctx.beginPath();
        ctx.arc(x + hankei, y + hankei, hankei, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$N(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 3 3-1 \u7E26\u6A2A\u306B\u25CF\u3092\u4E26\u3079\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/1.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const _1$e = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["ssrRender", _sfc_ssrRender$N]]);
const _1$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$e
});
const unitKazu$e = 16;
var unitSize$e;
var offsetX$r;
var offsetY$r;
const _sfc_main$M = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$e = Math.min(screenWidth, screenHeight) / unitKazu$e;
      const totalLength = unitSize$e * unitKazu$e;
      offsetX$r = (screenWidth - totalLength) / 2;
      offsetY$r = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$e / 2;
      [...Array(unitKazu$e).keys()].forEach((tateNum) => [...Array(unitKazu$e).keys()].forEach((yokoNum) => {
        const x = unitSize$e * yokoNum + offsetX$r;
        const y = unitSize$e * tateNum + offsetY$r;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$M(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 3 3-2 \u30A8\u30EA\u30A2\u5185\u306B\u3074\u3063\u305F\u308A\u53CE\u3081\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/2.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _2$e = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["ssrRender", _sfc_ssrRender$M]]);
const _2$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$e
});
const unitKazu$d = 16;
var unitSize$d;
var offsetX$q;
var offsetY$q;
const _sfc_main$L = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$d = Math.min(screenWidth, screenHeight) / unitKazu$d;
      const totalLength = unitSize$d * unitKazu$d;
      offsetX$q = (screenWidth - totalLength) / 2;
      offsetY$q = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$d / 2;
      var idx = 0;
      [...Array(unitKazu$d).keys()].forEach((tateNum) => [...Array(unitKazu$d).keys()].forEach((yokoNum) => {
        const par1 = idx++ % (unitKazu$d + 1) / unitKazu$d;
        const x = unitSize$d * yokoNum + offsetX$q;
        const y = unitSize$d * tateNum + offsetY$q;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, par1 * hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$L(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 3 3-3 \u5F90\u3005\u306B\u5927\u304D\u3055\u3092\u5909\u3048\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/3.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const _3$e = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["ssrRender", _sfc_ssrRender$L]]);
const _3$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$e
});
const unitKazu$c = 16;
var unitSize$c;
var offsetX$p;
var offsetY$p;
var startTime$c;
const _sfc_main$K = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$c = Math.min(screenWidth, screenHeight) / unitKazu$c;
      startTime$c = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$c) % 1e3 / 999;
      const totalLength = unitSize$c * unitKazu$c;
      offsetX$p = (screenWidth - totalLength) / 2;
      offsetY$p = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$c / 2;
      var idx = 0;
      [...Array(unitKazu$c).keys()].forEach((tateNum) => [...Array(unitKazu$c).keys()].forEach((yokoNum) => {
        const par1 = idx++ % (unitKazu$c + 1) / unitKazu$c;
        const x = unitSize$c * yokoNum + offsetX$p;
        const y = unitSize$c * tateNum + offsetY$p;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, (par1 + par2) * hankei2 % hankei2 + 1, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$K(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 3 3-4 \u6642\u9593\u306B\u6CBF\u3063\u3066\u5927\u304D\u3055\u3092\u52D5\u304B\u3059</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/4.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _4$e = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["ssrRender", _sfc_ssrRender$K]]);
const _4$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$e
});
const unitKazu$b = 16;
var unitSize$b;
var offsetX$o;
var offsetY$o;
var startTime$b;
const _sfc_main$J = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$b = Math.min(screenWidth, screenHeight) / unitKazu$b;
      startTime$b = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$b) % 1e3 / 999;
      const totalLength = unitSize$b * unitKazu$b;
      offsetX$o = (screenWidth - totalLength) / 2;
      offsetY$o = (screenHeight - totalLength) / 2;
      const hankei2 = unitSize$b / 2;
      var idx = 0;
      [...Array(unitKazu$b).keys()].forEach((tateNum) => [...Array(unitKazu$b).keys()].forEach((yokoNum) => {
        const par1 = idx++ % (unitKazu$b + 1) / unitKazu$b;
        const parC = (par1 + par2) * 256 % 256;
        ctx.fillStyle = `rgb(${parC},${parC},${parC})`;
        const x = unitSize$b * yokoNum + offsetX$o;
        const y = unitSize$b * tateNum + offsetY$o;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, (par1 + par2) * hankei2 % hankei2 + 1, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$J(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 3 3-5 \u8272\u3092\u5909\u3048\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter03/5.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const _5$c = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["ssrRender", _sfc_ssrRender$J]]);
const _5$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$c
});
const unitKazu$a = 8;
const unitYokoKazu$a = unitKazu$a;
const unitTateKazu$a = unitKazu$a;
var unitSize$a;
var offsetX$n;
var offsetY$n;
const _sfc_main$I = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      unitSize$a = Math.min(screenWidth, screenHeight) / unitKazu$a;
      const totalLength = unitSize$a * unitKazu$a;
      offsetX$n = (screenWidth - totalLength) / 2;
      offsetY$n = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$a).keys()].forEach((tateNum) => [...Array(unitYokoKazu$a).keys()].forEach((yokoNum) => {
        const x = unitSize$a * yokoNum + offsetX$n;
        const y = unitSize$a * tateNum + offsetY$n;
        const hankei2 = unitSize$a / 2;
        ctx.fillStyle = "rgb(255, 200, 200)";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$I(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-1 \u3007\u3092\u4E26\u3079\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/1.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _1$c = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["ssrRender", _sfc_ssrRender$I]]);
const _1$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$c
});
const unitKazu$9 = 8;
const unitYokoKazu$9 = unitKazu$9;
const unitTateKazu$9 = unitKazu$9 * 4;
var unitSize$9;
var unitSizeX$9;
var unitSizeY$9;
var offsetX$m;
var offsetY$m;
const _sfc_main$H = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$9 = screenSize / unitKazu$9;
      unitSizeX$9 = screenSize / unitYokoKazu$9;
      unitSizeY$9 = screenSize / unitTateKazu$9;
      const totalLength = unitSize$9 * unitKazu$9;
      offsetX$m = (screenWidth - totalLength) / 2;
      offsetY$m = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$9).keys()].forEach((tateNum) => [...Array(unitYokoKazu$9).keys()].forEach((yokoNum) => {
        const x = unitSizeX$9 * yokoNum + offsetX$m;
        const y = unitSizeY$9 * tateNum + offsetY$m;
        const hankei2 = unitSize$9 / 2;
        ctx.fillStyle = "rgba(255, 200, 200, 0.7)";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$H(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-2 \u7E26\u65B9\u5411\u306B\u8A70\u3081\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/2.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const _2$c = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["ssrRender", _sfc_ssrRender$H]]);
const _2$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$c
});
const unitKazu$8 = 8;
const unitYokoKazu$8 = unitKazu$8;
const unitTateKazu$8 = unitKazu$8 * 4;
var unitSize$8;
var unitSizeX$8;
var unitSizeY$8;
var offsetX$l;
var offsetY$l;
const _sfc_main$G = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$8 = screenSize / unitKazu$8;
      unitSizeX$8 = screenSize / unitYokoKazu$8;
      unitSizeY$8 = screenSize / unitTateKazu$8;
      const totalLength = unitSize$8 * unitKazu$8;
      offsetX$l = (screenWidth - totalLength) / 2;
      offsetY$l = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$8 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$8 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$8 / 2;
        const x = unitSizeX$8 * yokoNum + offsetX$l + (tateNum % 2 === 1 ? -unitSize$8 / 2 : 0);
        const y = unitSizeY$8 * (tateNum - 1) + offsetY$l;
        ctx.fillStyle = "rgba(255, 200, 200, 0.7)";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$G(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-3 \u4E92\u3044\u9055\u3044\u306B\u914D\u7F6E\u3059\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/3.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const _3$c = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["ssrRender", _sfc_ssrRender$G]]);
const _3$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$c
});
const unitKazu$7 = 8;
const unitYokoKazu$7 = unitKazu$7;
const unitTateKazu$7 = unitKazu$7 * 4;
var unitSize$7;
var unitSizeX$7;
var unitSizeY$7;
var offsetX$k;
var offsetY$k;
const _sfc_main$F = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$7 = screenSize / unitKazu$7;
      unitSizeX$7 = screenSize / unitYokoKazu$7;
      unitSizeY$7 = screenSize / unitTateKazu$7;
      const totalLength = unitSize$7 * unitKazu$7;
      offsetX$k = (screenWidth - totalLength) / 2;
      offsetY$k = (screenHeight - totalLength) / 2;
      [...Array(unitTateKazu$7 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$7 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$7 / 2;
        const x = unitSizeX$7 * yokoNum + offsetX$k + (tateNum % 2 === 1 ? -unitSize$7 / 2 : 0);
        const y = unitSizeY$7 * (tateNum - 1) + offsetY$k;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), 0, Math.PI * 2, false);
          ctx.stroke();
        });
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$F(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-4 \u9752\u6D77\u6CE2\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/4.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const _4$c = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["ssrRender", _sfc_ssrRender$F]]);
const _4$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$c
});
const unitKazu$6 = 8;
const unitYokoKazu$6 = unitKazu$6;
const unitTateKazu$6 = unitKazu$6 * 4;
var unitSize$6;
var unitSizeX$6;
var unitSizeY$6;
var offsetX$j;
var offsetY$j;
var startTime$a;
const _sfc_main$E = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$6 = screenSize / unitKazu$6;
      unitSizeX$6 = screenSize / unitYokoKazu$6;
      unitSizeY$6 = screenSize / unitTateKazu$6;
      const totalLength = unitSize$6 * unitKazu$6;
      offsetX$j = (screenWidth - totalLength) / 2;
      offsetY$j = (screenHeight - totalLength) / 2;
      startTime$a = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$a) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      [...Array(unitTateKazu$6 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$6 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$6 / 2;
        const x = unitSizeX$6 * yokoNum + offsetX$j + (tateNum % 2 === 1 ? -unitSize$6 / 2 : 0);
        const y = unitSizeY$6 * (tateNum - 1) + offsetY$j;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + 0, kakudoA + kakudo324, false);
          ctx.stroke();
        });
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$E(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-5 \u6CE2\u3092\u4F5C\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/5.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _5$a = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["ssrRender", _sfc_ssrRender$E]]);
const _5$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$a
});
const unitKazu$5 = 8;
const unitYokoKazu$5 = unitKazu$5;
const unitTateKazu$5 = unitKazu$5 * 4;
var unitSize$5;
var unitSizeX$5;
var unitSizeY$5;
var offsetX$i;
var offsetY$i;
var startTime$9;
const _sfc_main$D = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$5 = screenSize / unitKazu$5;
      unitSizeX$5 = screenSize / unitYokoKazu$5;
      unitSizeY$5 = screenSize / unitTateKazu$5;
      const totalLength = unitSize$5 * unitKazu$5;
      offsetX$i = (screenWidth - totalLength) / 2;
      offsetY$i = (screenHeight - totalLength) / 2;
      startTime$9 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$9) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      [...Array(unitTateKazu$5 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$5 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$5 / 2;
        const x = unitSizeX$5 * yokoNum + offsetX$i + (tateNum % 2 === 1 ? -unitSize$5 / 2 : 0);
        const y = unitSizeY$5 * (tateNum - 1) + offsetY$i;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          const kakudoC = (lineIdx + 1) / (arcNum + 1) * Math.PI;
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + kakudoC + 0, kakudoA + kakudoC + kakudo324, false);
          ctx.stroke();
        });
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$D(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-6 \u6CE2\u306E\u89D2\u5EA6\u3092\u305A\u3089\u3059</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/6.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const _6$8 = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["ssrRender", _sfc_ssrRender$D]]);
const _6$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _6$8
});
const unitKazu$4 = 8;
const unitYokoKazu$4 = unitKazu$4;
const unitTateKazu$4 = unitKazu$4 * 4;
var unitSize$4;
var unitSizeX$4;
var unitSizeY$4;
var offsetX$h;
var offsetY$h;
var startTime$8;
const _sfc_main$C = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$4 = screenSize / unitKazu$4;
      unitSizeX$4 = screenSize / unitYokoKazu$4;
      unitSizeY$4 = screenSize / unitTateKazu$4;
      const totalLength = unitSize$4 * unitKazu$4;
      offsetX$h = (screenWidth - totalLength) / 2;
      offsetY$h = (screenHeight - totalLength) / 2;
      startTime$8 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$8) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      var idx = 0;
      [...Array(unitTateKazu$4 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$4 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$4 / 2;
        const x = unitSizeX$4 * yokoNum + offsetX$h + (tateNum % 2 === 1 ? -unitSize$4 / 2 : 0);
        const y = unitSizeY$4 * (tateNum - 1) + offsetY$h;
        const kakudoB = idx++ % (unitYokoKazu$4 + 2) / (unitYokoKazu$4 + 1) * Math.PI * 2;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          const kakudoC = (lineIdx + 1) / (arcNum + 1) * Math.PI;
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + kakudoB + kakudoC + 0, kakudoA + kakudoB + kakudoC + kakudo324, false);
          ctx.stroke();
        });
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$C(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-7 \u305D\u308C\u305E\u308C\u306E\u6CE2\u3092\u305A\u3089\u3059</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/7.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _7$2 = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["ssrRender", _sfc_ssrRender$C]]);
const _7$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _7$2
});
const unitKazu$3 = 8;
const unitYokoKazu$3 = unitKazu$3;
const unitTateKazu$3 = unitKazu$3 * 4;
var unitSize$3;
var unitSizeX$3;
var unitSizeY$3;
var offsetX$g;
var offsetY$g;
var startTime$7;
const _sfc_main$B = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$3 = screenSize / unitKazu$3;
      unitSizeX$3 = screenSize / unitYokoKazu$3;
      unitSizeY$3 = screenSize / unitTateKazu$3;
      const totalLength = unitSize$3 * unitKazu$3;
      offsetX$g = (screenWidth - totalLength) / 2;
      offsetY$g = (screenHeight - totalLength) / 2;
      startTime$7 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = (new Date().getTime() - startTime$7) % 3e3 / 3e3;
      const kakudoA = par2 * Math.PI * 2;
      const kakudo324 = 0.9 * Math.PI * 2;
      var idx = 0;
      [...Array(unitTateKazu$3 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$3 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$3 / 2;
        const x = unitSizeX$3 * yokoNum + offsetX$g + (tateNum % 2 === 1 ? -unitSize$3 / 2 : 0);
        const y = unitSizeY$3 * (tateNum - 1) + offsetY$g;
        const kakudoB = idx++ % (unitYokoKazu$3 + 2) / (unitYokoKazu$3 + 1) * Math.PI * 2;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        const arcNum = 4;
        ctx.lineWidth = hankei2 / (arcNum * 2 + 1);
        ctx.strokeStyle = "red";
        [...Array(arcNum).keys()].forEach((lineIdx) => {
          const kakudoC = (lineIdx + 1) / (arcNum + 1) * Math.PI;
          ctx.beginPath();
          ctx.arc(x + hankei2, y + hankei2, hankei2 / (arcNum + 1) * (lineIdx + 1), kakudoA + kakudoB + kakudoC + 0, kakudoA + kakudoB + kakudoC + kakudo324, false);
          ctx.stroke();
        });
      }));
      ctx.fillStyle = "white";
      if (offsetX$g > 0) {
        ctx.fillRect(0, 0, offsetX$g, screenHeight);
        ctx.fillRect(screenWidth - offsetX$g, 0, offsetX$g, screenHeight);
      }
      if (offsetY$g > 0) {
        ctx.fillRect(0, 0, screenWidth, offsetY$g);
        ctx.fillRect(0, screenHeight - offsetY$g, screenWidth, offsetY$g);
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$B(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 4 4-8 \u30C8\u30EA\u30DF\u30F3\u30B0\u3059\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter04/8.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _8 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["ssrRender", _sfc_ssrRender$B]]);
const _8$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _8
});
var centerX$5;
var centerY$5;
const _sfc_main$A = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$5 = screenWidth / 2;
      centerY$5 = screenHeight / 2;
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = hankei1 * Math.cos(kakudo) + centerX$5;
        const y = hankei1 * Math.sin(kakudo) + centerY$5;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$A(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 5 5-1 \u5186\u5468\u4E0A\u306B\u3007\u3092\u4E26\u3079\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/1.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _1$a = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["ssrRender", _sfc_ssrRender$A]]);
const _1$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$a
});
var centerX$4;
var centerY$4;
const numPattern$3 = 3;
var targetPattern$3 = 0;
const _sfc_main$z = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8"
    };
  },
  methods: {
    onClick() {
      targetPattern$3 = ++targetPattern$3 % numPattern$3;
      console.log(targetPattern$3);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$4 = screenWidth / 2;
      centerY$4 = screenHeight / 2;
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      switch (targetPattern$3) {
        case 0:
          this.loopFunc0(ctx);
          break;
        case 1:
          this.loopFunc1(ctx);
          break;
        case 2:
          this.loopFunc2(ctx);
          break;
      }
    },
    loopFunc0(ctx) {
      const cycle = parseInt(this.numCycle, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$4;
        const y = hankei1 * Math.sin(kakudo) + centerY$4;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    loopFunc1(ctx) {
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = degree;
        const y = hankei1 * Math.sin(kakudo) + centerY$4;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    loopFunc2(ctx) {
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = degree;
        const y = hankei1 * Math.sin(kakudo * 2) + centerY$4;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$z(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 5 5-2 \u3007\u306E\u5927\u304D\u3055\u306E\u5909\u5316\u3092 sin \u30AB\u30FC\u30D6\u306B\u3059\u308B</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycle)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/2.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _2$a = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["ssrRender", _sfc_ssrRender$z]]);
const _2$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$a
});
var centerX$3;
var centerY$3;
const _sfc_main$y = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$3 = screenWidth / 2;
      centerY$3 = screenHeight / 2;
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$3;
        const y = hankei1 * Math.sin(kakudo) + centerY$3;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$y(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 5 5-3 \u5186\u5468\u306E\u534A\u5F84\u3092 sin \u30AB\u30FC\u30D6\u306B\u3059\u308B</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycle)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycleRadius)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/3.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _3$a = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["ssrRender", _sfc_ssrRender$y]]);
const _3$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$a
});
var centerX$2;
var centerY$2;
var startTime$6;
const _sfc_main$x = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$2 = screenWidth / 2;
      centerY$2 = screenHeight / 2;
      startTime$6 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycleSeconds = 2;
      const passedTime = new Date().getTime() - startTime$6;
      const objectKakudo = passedTime / 1e3 * Math.PI * 2 / cycleSeconds;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle + objectKakudo) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$2;
        const y = hankei1 * Math.sin(kakudo) + centerY$2;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$x(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 5 5-4 \u500B\u3005\u306E\u3007\u306E\u534A\u5F84\u3092\u6642\u9593\u306B\u6CBF\u3063\u3066\u52D5\u304B\u3059</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycle)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycleRadius)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/4.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _4$a = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["ssrRender", _sfc_ssrRender$x]]);
const _4$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$a
});
var centerX$1;
var centerY$1;
var startTime$5;
const _sfc_main$w = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX$1 = screenWidth / 2;
      centerY$1 = screenHeight / 2;
      startTime$5 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycleSeconds = 2;
      const passedTime = new Date().getTime() - startTime$5;
      const objectKakudo = passedTime / 1e3 * Math.PI * 2 / cycleSeconds;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20 * (Math.sin(objectKakudo) + 1);
        const hankei2 = haba * (Math.sin(kakudo * cycle + objectKakudo) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX$1;
        const y = hankei1 * Math.sin(kakudo) + centerY$1;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$w(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 5 5-5 \u5168\u4F53\u306E\u3007\u306E\u534A\u5F84\u3092\u6642\u9593\u306B\u6CBF\u3063\u3066\u52D5\u304B\u3059</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycle)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycleRadius)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/5.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _5$8 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["ssrRender", _sfc_ssrRender$w]]);
const _5$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$8
});
var centerX;
var centerY;
var startTime$4;
const _sfc_main$v = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      centerX = screenWidth / 2;
      centerY = screenHeight / 2;
      startTime$4 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const cycleSeconds = 2;
      const passedTime = new Date().getTime() - startTime$4;
      const objectKakudo = passedTime / 1e3 * Math.PI * 2 / cycleSeconds;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = degree / 180 * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius + objectKakudo) + 400;
        const haba = 20 * (Math.sin(objectKakudo) + 1);
        const hankei2 = haba * (Math.sin(kakudo * cycle + objectKakudo) + 1);
        const x = hankei1 * Math.cos(kakudo) + centerX;
        const y = hankei1 * Math.sin(kakudo) + centerY;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$v(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 5 5-6 \u5186\u5468\u306E\u534A\u5F84\u3092\u6642\u9593\u306B\u6CBF\u3063\u3066\u52D5\u304B\u3059</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycle)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.numCycleRadius)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter05/6.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _6$6 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["ssrRender", _sfc_ssrRender$v]]);
const _6$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _6$6
});
function hsbToRgb$3(hueOriginal, satOriginal, briOriginal) {
  const hue = hueOriginal % 360 + (hueOriginal < 0 ? 360 : 0);
  const sat = Math.min(Math.max(satOriginal, 0), 255);
  const bri = Math.min(Math.max(briOriginal, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
var shikiso = 0;
const _sfc_main$u = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      shikiso = ++shikiso % 360;
      const saido = Math.ceil(curYubiX / screenWidth * 255);
      const meido = Math.ceil(curYubiY / screenHeight * 255);
      const rgbCol = hsbToRgb$3(shikiso, saido, meido);
      const squareWidth = screenWidth / 2;
      const squareHeight = screenWidth / 2;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.fillStyle = `rgb(${rgbCol.red},${rgbCol.green},${rgbCol.blue})`;
      ctx.fillRect(squareWidth / 2, screenHeight / 2 - squareHeight / 2, squareWidth, squareHeight);
      ctx.fillStyle = "black";
      ctx.font = "36px serif";
      ctx.fillText(`\u8272\u76F8: ${shikiso}/360`, squareWidth * 1.5 + 10, screenHeight / 2 + squareHeight / 2 - 105);
      ctx.fillText(`\u5F69\u5EA6: ${saido}/255`, squareWidth * 1.5 + 10, screenHeight / 2 + squareHeight / 2 - 55);
      ctx.fillText(`\u660E\u5EA6: ${meido}/255`, squareWidth * 1.5 + 10, screenHeight / 2 + squareHeight / 2 - 5);
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$u(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 6 6-1 HSB \u2192 RGB \u5909\u63DB</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/1.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _1$8 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["ssrRender", _sfc_ssrRender$u]]);
const _1$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$8
});
function hsbToRgb$2(hsb) {
  const hue = hsb.hue % 360 + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
const unitKazu$2 = 8;
const unitYokoKazu$2 = unitKazu$2;
const unitTateKazu$2 = unitKazu$2 * 2;
var unitSize$2;
var unitSizeX$2;
var unitSizeY$2;
var offsetX$f;
var offsetY$f;
const numPattern$2 = 2;
var targetPattern$2 = 0;
var startTime$3;
const _sfc_main$t = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    onClick() {
      targetPattern$2 = ++targetPattern$2 % numPattern$2;
      console.log(targetPattern$2);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      startTime$3 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const passedTime = (new Date().getTime() - startTime$3) / 1e3;
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$2 = screenSize / unitKazu$2;
      unitSizeX$2 = screenSize / unitYokoKazu$2;
      unitSizeY$2 = screenSize / unitTateKazu$2;
      const totalLength = unitSize$2 * unitKazu$2;
      offsetX$f = (screenWidth - totalLength) / 2;
      offsetY$f = (screenHeight - totalLength) / 2;
      const totalCount = (unitTateKazu$2 + 1) * (unitYokoKazu$2 + 1);
      var idx = 0;
      [...Array(unitTateKazu$2 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$2 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$2 / 2;
        const x = unitSizeX$2 * yokoNum + offsetX$f + (tateNum % 2 === 1 ? -unitSize$2 / 2 : 0);
        const y = unitSizeY$2 * (tateNum - 1) + offsetY$f;
        const rgb = hsbToRgb$2({
          hue: idx++ / totalCount * 360 + passedTime * 60 * targetPattern$2,
          sat: curYubiX / screenWidth * 255,
          bri: curYubiY / screenHeight * 255
        });
        ctx.fillStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$t(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 6 6-2 \u8272\u76F8\u3092\u4F4D\u7F6E\u306B\u5C55\u958B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/2.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _2$8 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["ssrRender", _sfc_ssrRender$t]]);
const _2$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$8
});
function hsbToRgb$1(hsb) {
  const hue = hsb.hue % 360 + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
const unitKazu$1 = 8;
const unitYokoKazu$1 = unitKazu$1;
const unitTateKazu$1 = unitKazu$1 * 2;
var unitSize$1;
var unitSizeX$1;
var unitSizeY$1;
var offsetX$e;
var offsetY$e;
const numPattern$1 = 2;
var targetPattern$1 = 0;
var startTime$2;
const _sfc_main$s = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    onClick() {
      targetPattern$1 = ++targetPattern$1 % numPattern$1;
      console.log(targetPattern$1);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      startTime$2 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const passedTime = (new Date().getTime() - startTime$2) / 1e3 * targetPattern$1;
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize$1 = screenSize / unitKazu$1;
      unitSizeX$1 = screenSize / unitYokoKazu$1;
      unitSizeY$1 = screenSize / unitTateKazu$1;
      const totalLength = unitSize$1 * unitKazu$1;
      offsetX$e = (screenWidth - totalLength) / 2;
      offsetY$e = (screenHeight - totalLength) / 2;
      const totalCount = (unitTateKazu$1 + 1) * (unitYokoKazu$1 + 1);
      var idx = 0;
      [...Array(unitTateKazu$1 + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu$1 + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize$1 / 2;
        const x = unitSizeX$1 * yokoNum + offsetX$e + (tateNum % 2 === 1 ? -unitSize$1 / 2 : 0);
        const y = unitSizeY$1 * (tateNum - 1) + offsetY$e;
        const yokoRate = yokoNum / unitYokoKazu$1;
        const rgb = hsbToRgb$1({
          hue: idx++ / totalCount * 360,
          sat: 255,
          bri: ((Math.sin((yokoRate + passedTime) * Math.PI * 2) + 1) / 2 * 0.6 + 0.4) * 255
        });
        ctx.fillStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
        ctx.beginPath();
        ctx.arc(x + hankei2, y + hankei2, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$s(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 6 6-3 \u660E\u5EA6\u306E\u6CE2</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/3.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _3$8 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["ssrRender", _sfc_ssrRender$s]]);
const _3$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$8
});
function hsbToRgb(hsb) {
  const hue = hsb.hue % 360 + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;
  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + (hue - 0) / 60 * (maxVal - minVal),
      blue: minVal
    };
  } else if (hue < 120) {
    return {
      red: maxVal - (hue - 60) / 60 * (maxVal - minVal),
      green: maxVal,
      blue: minVal
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + (hue - 120) / 60 * (maxVal - minVal)
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - (hue - 180) / 60 * (maxVal - minVal),
      blue: maxVal
    };
  } else if (hue < 300) {
    return {
      red: minVal + (hue - 240) / 60 * (maxVal - minVal),
      green: minVal,
      blue: maxVal
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - (hue - 300) / 60 * (maxVal - minVal)
    };
  } else {
    throw "invalid hue";
  }
}
function drawUnitSankuzusi(ctx, hsb, cx, cy, hankei2, mukiEven) {
  ctx.lineWidth = hankei2 * 0.45;
  const xRate = mukiEven ? -1 : 1;
  {
    const rgb = hsbToRgb(hsb);
    ctx.strokeStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    ctx.beginPath();
    ctx.moveTo(cx + hankei2 * 0.76 * xRate, cy - hankei2 * 0.36);
    ctx.lineTo(cx - hankei2 * 0.36 * xRate, cy + hankei2 * 0.76);
    ctx.stroke();
  }
  {
    const rgb = hsbToRgb(__spreadValues(__spreadValues({}, hsb), {
      hue: hsb.hue + 180
    }));
    ctx.strokeStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    ctx.beginPath();
    ctx.moveTo(cx + hankei2 * 0.36 * xRate, cy - hankei2 * 0.76);
    ctx.lineTo(cx - hankei2 * 0.76 * xRate, cy + hankei2 * 0.36);
    ctx.stroke();
  }
}
const unitKazu = 8;
const unitYokoKazu = unitKazu;
const unitTateKazu = unitKazu * 2;
var unitSize;
var unitSizeX;
var unitSizeY;
var offsetX$d;
var offsetY$d;
const numPattern = 2;
var targetPattern = 0;
var startTime$1;
const _sfc_main$r = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    onClick() {
      targetPattern = ++targetPattern % numPattern;
      console.log(targetPattern);
    },
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      startTime$1 = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const passedTime = (new Date().getTime() - startTime$1) / 1e3 * targetPattern;
      const screenSize = Math.min(screenWidth, screenHeight);
      unitSize = screenSize / unitKazu;
      unitSizeX = screenSize / unitYokoKazu;
      unitSizeY = screenSize / unitTateKazu;
      const totalLength = unitSize * unitKazu;
      offsetX$d = (screenWidth - totalLength) / 2;
      offsetY$d = (screenHeight - totalLength) / 2;
      const totalCount = (unitTateKazu + 1) * (unitYokoKazu + 1);
      var idx = 0;
      [...Array(unitTateKazu + 1).keys()].forEach((tateNum) => [...Array(unitYokoKazu + 1).keys()].forEach((yokoNum) => {
        const hankei2 = unitSize / 2;
        const x = unitSizeX * yokoNum + offsetX$d + (tateNum % 2 === 1 ? -unitSize / 2 : 0);
        const y = unitSizeY * (tateNum - 1) + offsetY$d;
        drawUnitSankuzusi(ctx, {
          hue: idx++ / totalCount * 360 + passedTime * 60,
          sat: curYubiX / screenWidth * 255,
          bri: ((Math.sin((yokoNum / (unitYokoKazu + 1) + passedTime / 4) * Math.PI * 2) + 1) / 2 * 0.6 + 0.4) * 255
        }, x + hankei2, y + hankei2, hankei2, tateNum % 2 === 0);
      }));
      ctx.fillStyle = "white";
      if (offsetX$d > 0) {
        ctx.fillRect(0, 0, offsetX$d, screenHeight);
        ctx.fillRect(screenWidth - offsetX$d, 0, offsetX$d, screenHeight);
      }
      if (offsetY$d > 0) {
        ctx.fillRect(0, 0, screenWidth, offsetY$d);
        ctx.fillRect(0, screenHeight - offsetY$d, screenWidth, offsetY$d);
      }
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$r(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 6 6-4 \u4E09\u5D29\u3057\u6A21\u69D8</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter06/4.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _4$8 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["ssrRender", _sfc_ssrRender$r]]);
const _4$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$8
});
class Maru$g {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const offsetX$c = 0;
const offsetY$c = 0;
var unitKyori$g = 0;
var maruArrArr$g = [];
const _sfc_main$q = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$g = yokoInterval;
      maruArrArr$g = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$c + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$c;
        return new Maru$g(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$g.forEach((maruY) => maruY.forEach((maru) => {
        const hankei2 = unitKyori$g / 2;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$q(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 7 7-1 \u3007\u3092\u6577\u304D\u8A70\u3081\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/1.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _1$6 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["ssrRender", _sfc_ssrRender$q]]);
const _1$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$6
});
class Maru$f {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
}
const offsetX$b = 0;
const offsetY$b = 0;
var unitKyori$f = 0;
var maruArrArr$f = [];
const _sfc_main$p = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$f = yokoInterval;
      maruArrArr$f = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$b + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$b;
        return new Maru$f(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$f.forEach((maruY) => maruY.forEach((maru) => {
        const parR = Math.max(1 - maru.kyori(curYubiX, curYubiY) / screenSize, 0);
        const hankei2 = unitKyori$f / 2 * parR;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$p(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 7 7-2 \u8DDD\u96E2\u306B\u3088\u3063\u3066\u3007\u306E\u5927\u304D\u3055\u3092\u5909\u3048\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/2.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _2$6 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["ssrRender", _sfc_ssrRender$p]]);
const _2$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$6
});
class Maru$e {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
}
const offsetX$a = 0;
const offsetY$a = 0;
var unitKyori$e = 0;
var maruArrArr$e = [];
const _sfc_main$o = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$e = yokoInterval;
      maruArrArr$e = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$a + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$a;
        return new Maru$e(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$e.forEach((maruY) => maruY.forEach((maru) => {
        const parR = Math.max(1 - maru.kyori(curYubiX, curYubiY) / screenSize, 0);
        const hankei2 = unitKyori$e / 2 * parR;
        const grayValue = parR * 255;
        ctx.fillStyle = `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, maru.kakudo(curYubiX, curYubiY) - Math.PI / 2, maru.kakudo(curYubiX, curYubiY) + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$o(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 7 7-3 \u65B9\u5411\u3092\u8003\u616E\u3059\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/3.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _3$6 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["ssrRender", _sfc_ssrRender$o]]);
const _3$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$6
});
class Maru$d {
  constructor(x, y) {
    __publicField(this, "touched");
    this.x = x;
    this.y = y;
    this.touched = false;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  setTouched() {
    this.touched = true;
  }
  clearTouched() {
    this.touched = false;
  }
  isTouched() {
    return this.touched;
  }
}
const offsetX$9 = 0;
const offsetY$9 = 0;
var unitKyori$d = 0;
var maruArrArr$d = [];
const _sfc_main$n = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$d = yokoInterval;
      maruArrArr$d = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$9 + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$9;
        return new Maru$d(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$d.forEach((maruY) => maruY.forEach((maru) => {
        const kyori = maru.kyori(curYubiX, curYubiY);
        if (kyori < unitKyori$d / 2) {
          maru.setTouched();
        }
        const parR = Math.max(1 - kyori / screenSize, 0);
        const hankei2 = unitKyori$d / 2 * parR;
        const grayValue = parR * 255;
        ctx.fillStyle = maru.isTouched() ? "red" : `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, maru.kakudo(curYubiX, curYubiY) - Math.PI / 2, maru.kakudo(curYubiX, curYubiY) + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      maruArrArr$d.forEach((maruY) => maruY.forEach((maru) => {
        maru.clearTouched();
      }));
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$n(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 7 7-4 \u306A\u305E\u3063\u305F\u90E8\u5206\u3092\u899A\u3048\u3066\u304A\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/4.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _4$6 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["ssrRender", _sfc_ssrRender$n]]);
const _4$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$6
});
class Maru$c {
  constructor(x, y) {
    __publicField(this, "touched");
    this.x = x;
    this.y = y;
    this.touched = false;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  setTouched() {
    this.touched = true;
  }
  clearTouched() {
    this.touched = false;
  }
  isTouched() {
    return this.touched;
  }
}
const offsetX$8 = 0;
const offsetY$8 = 0;
var unitKyori$c = 0;
var maruArrArr$c = [];
const _sfc_main$m = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$c = yokoInterval;
      maruArrArr$c = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$8 + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$8;
        return new Maru$c(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$c.forEach((maruY) => maruY.forEach((maru) => {
        const kyori = maru.kyori(curYubiX, curYubiY);
        const kakudo = maru.kakudo(curYubiX, curYubiY);
        if (kyori < unitKyori$c / 2) {
          maru.setTouched();
        }
        const parR = Math.max(1 - kyori / screenSize, 0);
        const hankei2 = unitKyori$c / 2 * parR;
        ctx.strokeStyle = "black";
        ctx.lineWidth = parR * 5;
        const x1 = hankei2 * Math.cos(kakudo);
        const y1 = hankei2 * Math.sin(kakudo);
        ctx.beginPath();
        ctx.moveTo(maru.x, maru.y);
        ctx.lineTo(maru.x + x1, maru.y + y1);
        ctx.stroke();
        const grayValue = parR * 255;
        ctx.fillStyle = maru.isTouched() ? "red" : `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, kakudo - Math.PI / 2, kakudo + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      maruArrArr$c.forEach((maruY) => maruY.forEach((maru) => {
        maru.clearTouched();
      }));
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$m(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 7 7-5 \u6307\u306E\u65B9\u5411\u306B\u7DDA\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/5.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _5$6 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$m]]);
const _5$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$6
});
class Maru$b {
  constructor(x, y) {
    __publicField(this, "touched");
    this.x = x;
    this.y = y;
    this.touched = false;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  setTouched() {
    this.touched = true;
  }
  clearTouched() {
    this.touched = false;
  }
  isTouched() {
    return this.touched;
  }
}
const offsetX$7 = 0;
const offsetY$7 = 0;
var unitKyori$b = 0;
var maruArrArr$b = [];
var startTime;
const _sfc_main$l = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval);
      unitKyori$b = yokoInterval;
      maruArrArr$b = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$7 + (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$7;
        return new Maru$b(x, y);
      }));
      startTime = new Date().getTime();
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const second = (new Date().getTime() - startTime) / 1e3;
      const fureKakudo = Math.sin(second * Math.PI * 2) * Math.PI * 0.2;
      const screenSize = Math.min(screenWidth, screenHeight);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$b.forEach((maruY) => maruY.forEach((maru) => {
        const kyori = maru.kyori(curYubiX, curYubiY);
        const kakudo = maru.kakudo(curYubiX, curYubiY);
        if (kyori < unitKyori$b / 2) {
          maru.setTouched();
        }
        const parR = Math.max(1 - kyori / screenSize, 0);
        const hankei2 = unitKyori$b / 2 * parR;
        ctx.strokeStyle = "black";
        ctx.lineWidth = parR * 5;
        const x1 = hankei2 * Math.cos(kakudo + fureKakudo);
        const y1 = hankei2 * Math.sin(kakudo + fureKakudo);
        ctx.beginPath();
        ctx.moveTo(maru.x, maru.y);
        ctx.lineTo(maru.x + x1, maru.y + y1);
        ctx.stroke();
        const grayValue = parR * 255;
        ctx.fillStyle = maru.isTouched() ? "red" : `rgb(${grayValue},${grayValue},${grayValue})`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, kakudo - Math.PI / 2, kakudo + Math.PI / 2, true);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      maruArrArr$b.forEach((maruY) => maruY.forEach((maru) => {
        maru.clearTouched();
      }));
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$l(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 7 7-6 \u6307\u306E\u65B9\u5411\u306E\u7DDA\u304C\u3086\u3089\u3050</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter07/6.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _6$4 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender$l]]);
const _6$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _6$4
});
class Maru$a {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const offsetX$6 = 0;
const offsetY$6 = 0;
var unitKyori$a = 0;
var maruArrArr$a = [];
const _sfc_main$k = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$a = yokoInterval;
      maruArrArr$a = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$6 - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$6;
        return new Maru$a(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$a.forEach((maruY) => maruY.forEach((maru) => {
        const hankei2 = unitKyori$a / 4;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$k(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-1 \u25CF\u3092\u6577\u304D\u8A70\u3081\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/1.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _1$4 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$k]]);
const _1$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$4
});
class Maru$9 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  rotatedMaru(kaiten2) {
    return new Maru$9(this.x * Math.cos(kaiten2) - this.y * Math.sin(kaiten2), this.x * Math.sin(kaiten2) + this.y * Math.cos(kaiten2));
  }
}
const offsetX$5 = 0;
const offsetY$5 = 0;
var unitKyori$9 = 0;
var maruArrArr$9 = [];
var kaiten = 0;
const _sfc_main$j = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$9 = yokoInterval;
      maruArrArr$9 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$5 - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$5;
        return new Maru$9(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      if (yubiTouched) {
        kaiten += Math.PI / 36;
        console.log(kaiten);
      }
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$9.forEach((maruY) => maruY.forEach((maru) => {
        const rotated = maru.rotatedMaru(kaiten);
        const hankei2 = unitKyori$9 / 4;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rotated.x, rotated.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$j(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-2 \u25CF\u5168\u4F53\u3092\u56DE\u8EE2\u3059\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/2.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _2$4 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$j]]);
const _2$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$4
});
class Maru$8 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  rotate(curYubiX, curYubiY, kaiten2) {
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
}
const offsetX$4 = 0;
const offsetY$4 = 0;
var unitKyori$8 = 0;
var maruArrArr$8 = [];
const _sfc_main$i = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$8 = yokoInterval;
      maruArrArr$8 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$4 - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$4;
        return new Maru$8(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$8.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        }
        const hankei2 = unitKyori$8 / 4;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-3 \u6307\u306E\u4F4D\u7F6E\u3067\u25CF\u5168\u4F53\u3092\u56DE\u8EE2\u3059\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/3.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _3$4 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$i]]);
const _3$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$4
});
class Maru$7 {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig) {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
}
const offsetX$3 = 0;
const offsetY$3 = 0;
var unitKyori$7 = 0;
var maruArrArr$7 = [];
const _sfc_main$h = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$7 = yokoInterval;
      maruArrArr$7 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$3 - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$3;
        return new Maru$7(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$7.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        }
        const hankei2 = unitKyori$7 / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-4 \u6307\u3068\u306E\u8DDD\u96E2\u3067\u56DE\u8EE2\u65B9\u5411\u3092\u5909\u3048\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/4.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _4$4 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$h]]);
const _4$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$4
});
class Maru$6 {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    this.x = x;
    this.y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig) {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
}
const offsetX$2 = 0;
const offsetY$2 = 0;
var unitKyori$6 = 0;
var maruArrArr$6 = [];
const _sfc_main$g = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$6 = yokoInterval;
      maruArrArr$6 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$2 - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$2;
        return new Maru$6(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.rect(0, 0, screenWidth, screenHeight);
      ctx.fill();
      maruArrArr$6.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        }
        const hankei2 = unitKyori$6 / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-5 \u6B8B\u50CF\u3092\u6B8B\u3059</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/5.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _5$4 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$g]]);
const _5$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$4
});
class Maru$5 {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    __publicField(this, "moto_x");
    __publicField(this, "moto_y");
    this.x = x;
    this.y = y;
    this.moto_x = x;
    this.moto_y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig) {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
  movoToMoto() {
    this.x += (this.moto_x - this.x) / 10;
    this.y += (this.moto_y - this.y) / 10;
  }
}
const offsetX$1 = 0;
const offsetY$1 = 0;
var unitKyori$5 = 0;
var maruArrArr$5 = [];
const _sfc_main$f = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$5 = yokoInterval;
      maruArrArr$5 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX$1 - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY$1;
        return new Maru$5(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.rect(0, 0, screenWidth, screenHeight);
      ctx.fill();
      maruArrArr$5.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36);
        } else {
          maru.movoToMoto();
        }
        const hankei2 = unitKyori$5 / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-6 \u5F90\u3005\u306B\u8FD1\u3065\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/6.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _6$2 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$f]]);
const _6$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _6$2
});
class Maru$4 {
  constructor(x, y) {
    __publicField(this, "muki", 1);
    __publicField(this, "moto_x");
    __publicField(this, "moto_y");
    this.x = x;
    this.y = y;
    this.moto_x = x;
    this.moto_y = y;
  }
  kyori(curYubiX, curYubiY) {
    return Math.sqrt(Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2));
  }
  kakudo(curYubiX, curYubiY) {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
  rotate(curYubiX, curYubiY, kaitenOrig, bai2) {
    console.log(bai2);
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = (kyoriPar % 2 - 0.5) * 2;
    const kaiten2 = kaitenOrig * this.muki * bai2;
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    const xx2 = xx1 * Math.cos(kaiten2) - yy1 * Math.sin(kaiten2);
    const yy2 = xx1 * Math.sin(kaiten2) + yy1 * Math.cos(kaiten2);
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
  }
  movoToMoto() {
    this.x += (this.moto_x - this.x) / 10;
    this.y += (this.moto_y - this.y) / 10;
  }
}
const offsetX = 0;
const offsetY = 0;
var unitKyori$4 = 0;
var maruArrArr$4 = [];
var bai = 0;
const _sfc_main$e = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const unitYokoKazu2 = 10;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori$4 = yokoInterval;
      maruArrArr$4 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum + offsetX - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum + offsetY;
        return new Maru$4(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      if (yubiTouched) {
        bai = Math.min(bai + 5e-3, 1);
      } else {
        bai = 0;
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.rect(0, 0, screenWidth, screenHeight);
      ctx.fill();
      maruArrArr$4.forEach((maruY) => maruY.forEach((maru) => {
        if (yubiTouched) {
          maru.rotate(curYubiX, curYubiY, Math.PI / 36, bai);
        } else {
          maru.movoToMoto();
        }
        const hankei2 = unitKyori$4 / 4;
        ctx.fillStyle = maru.muki > 0 ? "black" : "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
      }));
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 8 8-7 \u3086\u3063\u304F\u308A\u3068\u52D5\u304D\u51FA\u3059</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter08/7.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _7 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$e]]);
const _7$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _7
});
class Point$8 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var ten$5 = [];
const _sfc_main$d = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$5 = [...Array(4).keys()].map((idx) => {
        return new Point$8(screenWidth / 2, screenHeight / 2);
      });
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$5.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const hankei2 = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ten$5.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      });
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 9 9-1 \u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u30DD\u30A4\u30F3\u30C8\u3092\u4F5C\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/1.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$d]]);
const _1$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1$2
});
class Point$7 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var ten$4 = [];
const _sfc_main$c = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$4 = [...Array(4).keys()].map((idx) => {
        return new Point$7(screenWidth / 2, screenHeight / 2);
      });
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$4.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$4[0].x, ten$4[0].y);
      ctx.bezierCurveTo(ten$4[1].x, ten$4[1].y, ten$4[2].x, ten$4[2].y, ten$4[3].x, ten$4[3].y);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(ten$4[0].x, ten$4[0].y);
      ctx.lineTo(ten$4[1].x, ten$4[1].y);
      ctx.lineTo(ten$4[2].x, ten$4[2].y);
      ctx.lineTo(ten$4[3].x, ten$4[3].y);
      ctx.stroke();
      const hankei2 = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ten$4.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, hankei2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      });
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 9 9-2 \u30D9\u30B8\u30A8\u66F2\u7DDA\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/2.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _2$2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$c]]);
const _2$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2$2
});
class Point$6 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$3 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var ten$3 = [];
var maruArrArr$3 = [];
var unitKyori$3 = 0;
const _sfc_main$b = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$3 = [...Array(4).keys()].map((idx) => {
        return new Point$6(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$3 = yokoInterval;
      maruArrArr$3 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$3(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$3.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const hankei2 = unitKyori$3 / 4;
      maruArrArr$3.forEach((maruY) => maruY.forEach((maru) => {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$3[0].x, ten$3[0].y);
      ctx.bezierCurveTo(ten$3[1].x, ten$3[1].y, ten$3[2].x, ten$3[2].y, ten$3[3].x, ten$3[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$3[0].x, ten$3[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$3[3].x, ten$3[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 9 9-3 \u4E0B\u5730\u3092\u63CF\u304F</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/3.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _3$2 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$b]]);
const _3$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3$2
});
class Point$5 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayuHantei(p0, p1) {
    const x1 = p1.x - p0.x;
    const y1 = p1.y - p0.y;
    const x2 = this.x - p0.x;
    const y2 = this.y - p0.y;
    return Math.sign(x1 * y2 - x2 * y1);
  }
}
var ten$2 = [];
var maruArrArr$2 = [];
var unitKyori$2 = 0;
const _sfc_main$a = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$2 = [...Array(4).keys()].map((idx) => {
        return new Point$5(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$2 = yokoInterval;
      maruArrArr$2 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$2(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$2.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const hankei2 = unitKyori$2 / 4;
      maruArrArr$2.forEach((maruY) => maruY.forEach((maru) => {
        ctx.strokeStyle = maru.sayuHantei(ten$2[3], ten$2[0]) === 1 ? "red" : "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$2[0].x, ten$2[0].y);
      ctx.bezierCurveTo(ten$2[1].x, ten$2[1].y, ten$2[2].x, ten$2[2].y, ten$2[3].x, ten$2[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$2[0].x, ten$2[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$2[3].x, ten$2[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 9 9-4 \u5DE6\u53F3\u5224\u5B9A</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/4.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _4$2 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$a]]);
const _4$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4$2
});
class Point$4 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru$1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayuHantei(p0, p1) {
    const x1 = p1.x - p0.x;
    const y1 = p1.y - p0.y;
    const x2 = this.x - p0.x;
    const y2 = this.y - p0.y;
    return Math.sign(x1 * y2 - x2 * y1);
  }
  sayuHantei4Points(p) {
    const sayu = this.sayuHantei(p[3], p[2]) + this.sayuHantei(p[2], p[1]) + this.sayuHantei(p[1], p[0]);
    if (sayu === 3) {
      return {
        storokeStyle: "red",
        hankeiRate: 0.7
      };
    } else if (sayu === -3) {
      return {
        storokeStyle: "black",
        hankeiRate: 0.7
      };
    } else {
      return {
        storokeStyle: "grey",
        hankeiRate: 0.35
      };
    }
  }
}
var ten$1 = [];
var maruArrArr$1 = [];
var unitKyori$1 = 0;
const _sfc_main$9 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten$1 = [...Array(4).keys()].map((idx) => {
        return new Point$4(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori$1 = yokoInterval;
      maruArrArr$1 = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru$1(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten$1.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr$1.forEach((maruY) => maruY.forEach((maru) => {
        const hanteiResult = maru.sayuHantei4Points(ten$1);
        ctx.strokeStyle = hanteiResult.storokeStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(maru.x, maru.y, unitKyori$1 * hanteiResult.hankeiRate, 0, Math.PI * 2, true);
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten$1[0].x, ten$1[0].y);
      ctx.bezierCurveTo(ten$1[1].x, ten$1[1].y, ten$1[2].x, ten$1[2].y, ten$1[3].x, ten$1[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten$1[0].x, ten$1[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten$1[3].x, ten$1[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 9 9-5 \u66F2\u7DDA\u306E\u5DE6\u53F3\u5224\u5B9A</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/5.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _5$2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$9]]);
const _5$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5$2
});
class Point$3 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Maru {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayuHantei(p0, p1) {
    const x1 = p1.x - p0.x;
    const y1 = p1.y - p0.y;
    const x2 = this.x - p0.x;
    const y2 = this.y - p0.y;
    return Math.sign(x1 * y2 - x2 * y1);
  }
  sayuHantei4Points(p) {
    const sayu = this.sayuHantei(p[3], p[2]) + this.sayuHantei(p[2], p[1]) + this.sayuHantei(p[1], p[0]);
    if (sayu === 3) {
      return {
        storokeStyle: "red",
        hankeiRate: 0.7
      };
    } else if (sayu === -3) {
      return {
        storokeStyle: "black",
        hankeiRate: 0.7
      };
    } else {
      return {
        storokeStyle: "grey",
        hankeiRate: 0.35
      };
    }
  }
  vertexRokkaku(hankei2) {
    return [...Array(6).keys()].map((idx) => {
      return new Point$3(this.x + hankei2 * Math.sin(Math.PI * 2 / 6 * idx), this.y + hankei2 * Math.cos(Math.PI * 2 / 6 * idx));
    });
  }
}
var ten = [];
var maruArrArr = [];
var unitKyori = 0;
const _sfc_main$8 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      ten = [...Array(4).keys()].map((idx) => {
        return new Point$3(screenWidth / 2, screenHeight / 2);
      });
      const unitYokoKazu2 = 20;
      const yokoInterval = screenWidth / (unitYokoKazu2 - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu2 = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori = yokoInterval;
      maruArrArr = [...Array(unitTateKazu2).keys()].map((tateNum) => [...Array(unitYokoKazu2).keys()].map((yokoNum) => {
        const x = yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
        const y = tateInterval * tateNum;
        return new Maru(x, y);
      }));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      var prevTen = null;
      ten.forEach((t) => {
        if (prevTen === null) {
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t;
      });
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr.forEach((maruY) => maruY.forEach((maru) => {
        const hanteiResult = maru.sayuHantei4Points(ten);
        const vertex = maru.vertexRokkaku(unitKyori * hanteiResult.hankeiRate);
        ctx.strokeStyle = hanteiResult.storokeStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(vertex[0].x, vertex[0].y);
        vertex.splice(1).forEach((v) => ctx.lineTo(v.x, v.y));
        ctx.closePath();
        ctx.stroke();
      }));
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten[0].x, ten[0].y);
      ctx.bezierCurveTo(ten[1].x, ten[1].y, ten[2].x, ten[2].y, ten[3].x, ten[3].y);
      ctx.stroke();
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten[0].x, ten[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten[3].x, ten[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 9 9-6 \u4E0B\u5730\u306E\u30D1\u30BF\u30FC\u30F3\u3092\u516D\u89D2\u5F62\u306B\u3059\u308B</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter09/6.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _6 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$8]]);
const _6$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _6
});
class Choten$4 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$4(this.x, this.y, this.z + gc);
  }
  tx(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.x / g.z;
  }
  ty(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.y / g.z;
  }
}
const henLength$4 = 400;
var choten$4 = [
  new Choten$4(henLength$4, henLength$4, henLength$4),
  new Choten$4(henLength$4, henLength$4, -henLength$4),
  new Choten$4(-henLength$4, henLength$4, -henLength$4),
  new Choten$4(-henLength$4, henLength$4, henLength$4),
  new Choten$4(henLength$4, -henLength$4, henLength$4),
  new Choten$4(henLength$4, -henLength$4, -henLength$4),
  new Choten$4(-henLength$4, -henLength$4, -henLength$4),
  new Choten$4(-henLength$4, -henLength$4, henLength$4)
];
const _sfc_main$7 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const gc = 3e3;
      const sc = 2e3;
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(choten$4[0].tx(gc, sc), choten$4[0].ty(gc, sc));
      ctx.lineTo(choten$4[1].tx(gc, sc), choten$4[1].ty(gc, sc));
      ctx.lineTo(choten$4[2].tx(gc, sc), choten$4[2].ty(gc, sc));
      ctx.lineTo(choten$4[3].tx(gc, sc), choten$4[3].ty(gc, sc));
      ctx.lineTo(choten$4[0].tx(gc, sc), choten$4[0].ty(gc, sc));
      ctx.lineTo(choten$4[4].tx(gc, sc), choten$4[4].ty(gc, sc));
      ctx.lineTo(choten$4[5].tx(gc, sc), choten$4[5].ty(gc, sc));
      ctx.lineTo(choten$4[6].tx(gc, sc), choten$4[6].ty(gc, sc));
      ctx.lineTo(choten$4[7].tx(gc, sc), choten$4[7].ty(gc, sc));
      ctx.lineTo(choten$4[4].tx(gc, sc), choten$4[4].ty(gc, sc));
      ctx.moveTo(choten$4[1].tx(gc, sc), choten$4[1].ty(gc, sc));
      ctx.lineTo(choten$4[5].tx(gc, sc), choten$4[5].ty(gc, sc));
      ctx.moveTo(choten$4[2].tx(gc, sc), choten$4[2].ty(gc, sc));
      ctx.lineTo(choten$4[6].tx(gc, sc), choten$4[6].ty(gc, sc));
      ctx.moveTo(choten$4[3].tx(gc, sc), choten$4[3].ty(gc, sc));
      ctx.lineTo(choten$4[7].tx(gc, sc), choten$4[7].ty(gc, sc));
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 10 10-1 \u6295\u5F71\u5909\u63DB</p>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/1.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7]]);
const _1$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1
});
class Choten$3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$3(this.x, this.y, this.z + gc);
  }
  tx(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.x / g.z;
  }
  ty(gc, sc) {
    const g = this.gxyz(gc);
    return sc * g.y / g.z;
  }
}
const henLength$3 = 400;
var choten$3 = [
  new Choten$3(henLength$3, henLength$3, henLength$3),
  new Choten$3(henLength$3, henLength$3, -henLength$3),
  new Choten$3(-henLength$3, henLength$3, -henLength$3),
  new Choten$3(-henLength$3, henLength$3, henLength$3),
  new Choten$3(henLength$3, -henLength$3, henLength$3),
  new Choten$3(henLength$3, -henLength$3, -henLength$3),
  new Choten$3(-henLength$3, -henLength$3, -henLength$3),
  new Choten$3(-henLength$3, -henLength$3, henLength$3)
];
const _sfc_main$6 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(choten$3[0].tx(gc, sc), choten$3[0].ty(gc, sc));
      ctx.lineTo(choten$3[1].tx(gc, sc), choten$3[1].ty(gc, sc));
      ctx.lineTo(choten$3[2].tx(gc, sc), choten$3[2].ty(gc, sc));
      ctx.lineTo(choten$3[3].tx(gc, sc), choten$3[3].ty(gc, sc));
      ctx.lineTo(choten$3[0].tx(gc, sc), choten$3[0].ty(gc, sc));
      ctx.lineTo(choten$3[4].tx(gc, sc), choten$3[4].ty(gc, sc));
      ctx.lineTo(choten$3[5].tx(gc, sc), choten$3[5].ty(gc, sc));
      ctx.lineTo(choten$3[6].tx(gc, sc), choten$3[6].ty(gc, sc));
      ctx.lineTo(choten$3[7].tx(gc, sc), choten$3[7].ty(gc, sc));
      ctx.lineTo(choten$3[4].tx(gc, sc), choten$3[4].ty(gc, sc));
      ctx.moveTo(choten$3[1].tx(gc, sc), choten$3[1].ty(gc, sc));
      ctx.lineTo(choten$3[5].tx(gc, sc), choten$3[5].ty(gc, sc));
      ctx.moveTo(choten$3[2].tx(gc, sc), choten$3[2].ty(gc, sc));
      ctx.lineTo(choten$3[6].tx(gc, sc), choten$3[6].ty(gc, sc));
      ctx.moveTo(choten$3[3].tx(gc, sc), choten$3[3].ty(gc, sc));
      ctx.lineTo(choten$3[7].tx(gc, sc), choten$3[7].ty(gc, sc));
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 10 10-2 \u30AF\u30E9\u30B9\u3078\u306E\u95A2\u6570\u306E\u7D44\u307F\u8FBC\u307F</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.objectDistance)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.screenDistance)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/2.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]);
const _2$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _2
});
class Point$2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Choten$2 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$2(this.x, this.y, this.z + gc);
  }
  toei(gc, sc) {
    const g = this.gxyz(gc);
    return new Point$2(sc * g.x / g.z, sc * g.y / g.z);
  }
  kaiten(kx, ky, kz) {
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;
    return new Choten$2(x2, y2, z2);
  }
}
const henLength$2 = 400;
var choten$2 = [
  new Choten$2(henLength$2, henLength$2, henLength$2),
  new Choten$2(henLength$2, henLength$2, -henLength$2),
  new Choten$2(-henLength$2, henLength$2, -henLength$2),
  new Choten$2(-henLength$2, henLength$2, henLength$2),
  new Choten$2(henLength$2, -henLength$2, henLength$2),
  new Choten$2(henLength$2, -henLength$2, -henLength$2),
  new Choten$2(-henLength$2, -henLength$2, -henLength$2),
  new Choten$2(-henLength$2, -henLength$2, henLength$2)
];
var kakudoX$2 = 0;
var kakudoY$2 = 0;
var kakudoZ$2 = 0;
const _sfc_main$5 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      kakudoX$2 += Math.PI * 0.01;
      kakudoY$2 += -Math.PI * 0.02;
      kakudoZ$2 += -Math.PI * 0.03;
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      const chotenRotated = choten$2.map((c) => c.kaiten(kakudoX$2, kakudoY$2, kakudoZ$2));
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 10 10-3 \u7A7A\u9593\u5185\u3067\u56DE\u8EE2\u3055\u305B\u308B</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.objectDistance)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.screenDistance)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/3.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]);
const _3$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _3
});
class Point$1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Choten$1 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten$1(this.x, this.y, this.z + gc);
  }
  toei(gc, sc) {
    const g = this.gxyz(gc);
    return new Point$1(sc * g.x / g.z, sc * g.y / g.z);
  }
  kaiten(kx, ky, kz) {
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;
    return new Choten$1(x2, y2, z2);
  }
}
const henLength$1 = 400;
var choten$1 = [
  new Choten$1(henLength$1, henLength$1, henLength$1),
  new Choten$1(henLength$1, henLength$1, -henLength$1),
  new Choten$1(-henLength$1, henLength$1, -henLength$1),
  new Choten$1(-henLength$1, henLength$1, henLength$1),
  new Choten$1(henLength$1, -henLength$1, henLength$1),
  new Choten$1(henLength$1, -henLength$1, -henLength$1),
  new Choten$1(-henLength$1, -henLength$1, -henLength$1),
  new Choten$1(-henLength$1, -henLength$1, henLength$1)
];
var kakudoX$1 = 0;
var kakudoY$1 = 0;
var kakudoZ$1 = 0;
var preYubiX$1 = 0;
var preYubiY$1 = 0;
var kakudoXstep$1 = 0;
var kakudoYstep$1 = 0;
var kakudoZstep$1 = 0;
const _sfc_main$4 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      kakudoX$1 += kakudoXstep$1;
      kakudoY$1 += kakudoYstep$1;
      kakudoZ$1 += kakudoZstep$1;
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      const chotenRotated = choten$1.map((c) => c.kaiten(kakudoX$1, kakudoY$1, kakudoZ$1));
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      preYubiX$1 = curYubiX;
      preYubiY$1 = curYubiY;
      kakudoXstep$1 = 0;
      kakudoYstep$1 = 0;
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
      if (yubiTouched) {
        kakudoYstep$1 = (curYubiX - preYubiX$1) * 0.03;
        kakudoXstep$1 = (curYubiY - preYubiY$1) * 0.03;
        preYubiX$1 = curYubiX;
        preYubiY$1 = curYubiY;
      }
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 10 10-4 \u6307\u3067\u56DE\u8EE2\u3055\u305B\u308B</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.objectDistance)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.screenDistance)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/4.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
const _4$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _4
});
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Choten {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  gxyz(gc) {
    return new Choten(this.x, this.y, this.z + gc);
  }
  toei(gc, sc) {
    const g = this.gxyz(gc);
    return new Point(sc * g.x / g.z, sc * g.y / g.z);
  }
  kaiten(kx, ky, kz) {
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;
    return new Choten(x2, y2, z2);
  }
}
class BezierChoten {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }
}
var bezCt = [];
const bezCtLoc = [
  [57, 36.1, 0, 53.5, 41.8, 0, 47, 41.8, 0],
  [43.8, 41.8, 0, 42.6, 40.5, 0, 38, 35.9, 0],
  [35.4, 33.1, 0, 33.1, 33.1, 0, 25.6, 33, 0],
  [25.6, 33, 0, 25.6, 32, 0, 25.6, 32, 0],
  [32.5, 30.3, 0, 36.4, 29.4, 0, 36.4, 23.6, 0],
  [36.4, 15, 0, 25.5, 3.1, 0, 13.5, 3.1, 0],
  [9.9, 3.1, 0, 6, 4.3, 0, 4.5, 4.8, 0],
  [10.5, 9.3, 0, 20.4, 18.6, 0, 20.4, 31.8, 0],
  [20.4, 47.6, 0, 4.1, 52.6, 0, -2.8, 52.6, 0],
  [-5.8, 52.6, 0, -7.9, 52.3, 0, -8.4, 48.6, 0],
  [-9.4, 42.1, 0, -9.6, 40.3, 0, -23.3, 30.9, 0],
  [-23.3, 30.9, 0, -22.6, 30.3, 0, -22.6, 30.3, 0],
  [-19.5, 31.1, 0, -13.75, 32.8, 0, -8.3, 32.8, 0],
  [-5.3, 32.8, 0, 0.4, 32.8, 0, 0.4, 27.3, 0],
  [0.4, 25.9, 0, -0.1, 19.4, 0, -7.8, 11.1, 0],
  [-23.4, 21.1, 0, -30.3, 32.8, 0, -35.9, 42.3, 0],
  [-36.5, 43.3, 0, -40.5, 49.4, 0, -43.9, 49.4, 0],
  [-47.3, 49.4, 0, -54.8, 43.4, 0, -54.8, 33.1, 0],
  [-54.8, 24.4, 0, -50.4, 20.4, 0, -43.9, 14.3, 0],
  [-44.8, 16.8, 0, -45, 17.8, 0, -45, 18.9, 0],
  [-45, 21.25, 0, -44.3, 23.6, 0, -41.6, 23.6, 0],
  [-39.8, 23.6, 0, -38.3, 23.3, 0, -30.3, 18.4, 0],
  [-21.9, 13.1, 0, -15.8, 10.1, 0, -11, 7.8, 0],
  [-19.8, -1, 0, -20.1, -5.1, 0, -20.1, -8.3, 0],
  [-20.1, -15.5, 0, -15.6, -18.9, 0, -13.3, -20.8, 0],
  [-9.4, -23.75, 0, -8.9, -24.1, 0, -8.9, -25.1, 0],
  [-8.9, -26.1, 0, -9.6, -27, 0, -13, -29.3, 0],
  [-19.1, -33.4, 0, -23.1, -41.25, 0, -23.1, -49.1, 0],
  [-23.1, -50.8, 0, -23, -51.9, 0, -22.8, -53.75, 0],
  [-16.4, -43.6, 0, -11.9, -43.4, 0, 2.3, -42.3, 0],
  [8.4, -41.8, 0, 16.25, -35, 0, 16.25, -26.9, 0],
  [16.25, -20.8, 0, 10.9, -19.3, 0, 8.4, -19.3, 0],
  [6.6, -19.3, 0, -1.4, -20.9, 0, -3, -20.9, 0],
  [-9.4, -20.9, 0, -15.5, -17.1, 0, -15.5, -13.5, 0],
  [-15.5, -8.3, 0, -6.8, -2.6, 0, 1.4, 2.6, 0],
  [7.9, 0.3, 0, 14.1, -0.9, 0, 21, -0.9, 0],
  [47.8, -0.9, 0, 57, 19.3, 0, 57, 30.3, 0],
  [57, 36.1, 0, 53.5, 41.8, 0, 47, 41.8, 0]
];
const henLength = 400;
var choten = [
  new Choten(henLength, henLength, henLength),
  new Choten(henLength, henLength, -henLength),
  new Choten(-henLength, henLength, -henLength),
  new Choten(-henLength, henLength, henLength),
  new Choten(henLength, -henLength, henLength),
  new Choten(henLength, -henLength, -henLength),
  new Choten(-henLength, -henLength, -henLength),
  new Choten(-henLength, -henLength, henLength)
];
var kakudoX = 0;
var kakudoY = 0;
var kakudoZ = 0;
var preYubiX = 0;
var preYubiY = 0;
var kakudoXstep = 0;
var kakudoYstep = 0;
var kakudoZstep = 0;
const _sfc_main$3 = vue_cjs_prod.defineComponent({
  components: {
    designingmath: __nuxt_component_0$1
  },
  setup() {
    return {
      objectDistance: "3000",
      screenDistance: "2000"
    };
  },
  methods: {
    setupFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("setupFunc");
      const bezUnit = henLength / 100;
      bezCt = bezCtLoc.map((loc) => new BezierChoten(new Choten(loc[0] * bezUnit, loc[1] * bezUnit, loc[2] * bezUnit), new Choten(loc[3] * bezUnit, loc[4] * bezUnit, loc[5] * bezUnit), new Choten(loc[6] * bezUnit, loc[7] * bezUnit, loc[8] * bezUnit)));
    },
    loopFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("loopFunc");
      kakudoX += kakudoXstep;
      kakudoY += kakudoYstep;
      kakudoZ += kakudoZstep;
      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);
      const chotenRotated = choten.map((c) => c.kaiten(kakudoX, kakudoY, kakudoZ));
      const bezRotated = bezCt.map((bez) => new BezierChoten(bez.p1.kaiten(kakudoX, kakudoY, kakudoZ), bez.p2.kaiten(kakudoX, kakudoY, kakudoZ), bez.p3.kaiten(kakudoX, kakudoY, kakudoZ)));
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      {
        const p3 = bezRotated[0].p3.toei(gc, sc);
        ctx.moveTo(p3.x, p3.y);
      }
      bezRotated.splice(1).forEach((bez) => {
        const p1 = bez.p1.toei(gc, sc);
        const p2 = bez.p2.toei(gc, sc);
        const p3 = bez.p3.toei(gc, sc);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      });
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
    touchOrMouseStartFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseStartFunc");
      preYubiX = curYubiX;
      preYubiY = curYubiY;
      kakudoXstep = 0;
      kakudoYstep = 0;
    },
    touchOrMouseMoveFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseMoveFunc");
      if (yubiTouched) {
        kakudoYstep = (curYubiX - preYubiX) * 0.03;
        kakudoXstep = (curYubiY - preYubiY) * 0.03;
        preYubiX = curYubiX;
        preYubiY = curYubiY;
      }
    },
    touchOrMouseEndFunc(ctx, screenWidth, screenHeight, curYubiX, curYubiY, yubiTouched) {
      console.log("touchOrMouseEndFunc");
    }
  }
});
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_designingmath = __nuxt_component_0$1;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Chapter 10 10-5 \u7A7A\u9593\u5185\u306E\u30D9\u30B8\u30A8\u66F2\u7DDA</p><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.objectDistance)}><input${serverRenderer.exports.ssrRenderAttr("value", _ctx.screenDistance)}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_designingmath, {
    setupFunc: _ctx.setupFunc,
    loopFunc: _ctx.loopFunc,
    touchOrMouseStartFunc: _ctx.touchOrMouseStartFunc,
    touchOrMouseEndFunc: _ctx.touchOrMouseEndFunc,
    touchOrMouseMoveFunc: _ctx.touchOrMouseMoveFunc
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/chapter10/5.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _5 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _5$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _5
});
const _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><p>Hello Nuxt3</p></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/index.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": index
});
const _messages = { "appName": "Nuxt", "title": "Welcome to Nuxt 3!", "documentation": "Documentation", "readDocs": "We highly recommend you take a look at the Nuxt documentation, whether you are new or have previous experience with the framework.", "followTwitter": "Follow the Nuxt Twitter account to get latest news about releases, new modules, tutorials and tips." };
const _render = function({ messages }) {
  var __t, __p = "";
  __p += "<!DOCTYPE html><html><head><title>" + ((__t = messages.title) == null ? "" : __t) + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1,minimum-scale=1" name="viewport"><script>const s=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}};s();<\/script><style>*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e4e4e7}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}code{font-size:1em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}svg{display:block;vertical-align:middle}p{margin:0}strong{font-weight:bolder}ul{list-style:none;margin:0;padding:0}.bg-cloud-surface{--tw-bg-opacity:1;background-color:rgba(230,240,240,var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.border-gray-200{--tw-border-opacity:1;border-color:rgba(228,228,231,var(--tw-border-opacity))}.border-cloud-light{--tw-border-opacity:1;border-color:rgba(146,173,173,var(--tw-border-opacity))}.border-t{border-top-width:1px}.border-l-8{border-left-width:8px}.inline-block{display:inline-block}.flex{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.grid{display:-ms-grid;display:grid}.items-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.justify-center{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.font-bold{font-weight:700}.font-semibold{font-weight:600}.h-6{height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.leading-7{line-height:1.75rem}.list-inside{list-style-position:inside}.list-disc{list-style-type:disc}.mx-auto{margin-left:auto;margin-right:auto}.mt-4{margin-top:1rem}.ml-4{margin-left:1rem}.ml-10{margin-left:2.5rem}.mt-2{margin-top:.5rem}.max-w-4xl{max-width:56rem}.min-h-screen{min-height:100vh}.overflow-hidden{overflow:hidden}.p-6{padding:1.5rem}.pt-8{padding-top:2rem}.pl-4{padding-left:1rem}.pt-1{padding-top:.25rem}.pl-2{padding-left:.5rem}.relative{position:relative}.shadow{--tw-shadow-color:0, 0, 0;--tw-shadow:0 1px 3px 0 rgba(var(--tw-shadow-color), .1), 0 1px 2px 0 rgba(var(--tw-shadow-color), .06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.text-secondary-darker{--tw-text-opacity:1;color:rgba(0,53,67,var(--tw-text-opacity))}.text-cloud-dark{--tw-text-opacity:1;color:rgba(86,107,107,var(--tw-text-opacity))}.text-sky-black{--tw-text-opacity:1;color:rgba(0,30,38,var(--tw-text-opacity))}.text-primary{--tw-text-opacity:1;color:rgba(0,220,130,var(--tw-text-opacity))}.hover\\:underline:hover{-webkit-text-decoration-line:underline;text-decoration-line:underline}.w-6{width:1.5rem}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}@media (min-width: 640px){.sm\\:rounded-lg{border-radius:.5rem}.sm\\:items-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.sm\\:justify-start{-webkit-box-pack:start;-ms-flex-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start}.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\\:pt-0{padding-top:0}}@media (min-width: 768px){.md\\:border-t-0{border-top-width:0px}.md\\:border-l{border-left-width:1px}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width: 1024px){.lg\\:px-8{padding-left:2rem;padding-right:2rem}}@media (prefers-color-scheme: dark){.dark\\:bg-sky-darker{--tw-bg-opacity:1;background-color:rgba(0,53,67,var(--tw-bg-opacity))}.dark\\:bg-sky-darkest{--tw-bg-opacity:1;background-color:rgba(1,42,53,var(--tw-bg-opacity))}.dark\\:border-sky-darkest{--tw-border-opacity:1;border-color:rgba(1,42,53,var(--tw-border-opacity))}.dark\\:border-sky{--tw-border-opacity:1;border-color:rgba(73,122,135,var(--tw-border-opacity))}.dark\\:text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.dark\\:text-cloud-light{--tw-text-opacity:1;color:rgba(146,173,173,var(--tw-text-opacity))}}</style></head><body class="text-secondary-darker dark:text-white bg-cloud-surface dark:bg-sky-darkest"><div class="relative flex items-top justify-center min-h-screen sm:items-center sm:pt-0"><div class="max-w-4xl mx-auto sm:px-6 lg:px-8"><div class="flex justify-center pt-8 sm:justify-start sm:pt-0"><svg width="221" height="65" viewBox="0 0 221 65" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M76.333 20.5005H82.8185L96.5631 42.4764V20.5005H102.55V51.6393H96.1087L82.3198 29.7091V51.6393H76.333V20.5005Z" fill="currentColor"></path><path d="M129.311 51.6393H123.732V48.1611C122.462 50.6089 119.877 51.9871 116.612 51.9871C111.441 51.9871 108.083 48.3393 108.083 43.0894V29.2178H113.662V41.9416C113.662 45.0111 115.568 47.1459 118.425 47.1459C121.555 47.1459 123.732 44.7437 123.732 41.4524V29.2178H129.311V51.6393Z" fill="currentColor"></path><path d="M148.724 51.2848L143.372 43.811L138.019 51.2848H132.076L140.333 39.5849L132.712 28.8633H138.79L143.372 35.3154L147.906 28.8633H154.031L146.364 39.5849L154.62 51.2848H148.724Z" fill="currentColor"></path><path d="M165.96 22.4565V29.2173H172.311V33.7999H165.96V44.9302C165.96 45.304 166.111 45.6626 166.381 45.9271C166.65 46.1916 167.015 46.3405 167.397 46.3411H172.311V51.6302H168.636C163.646 51.6302 160.381 48.7824 160.381 43.8042V33.8043H155.891V29.2173H158.708C160.022 29.2173 160.787 28.45 160.787 27.1804V22.4565H165.96Z" fill="currentColor"></path><path d="M186.374 44.5872V20.5005H192.359V42.7416C192.359 48.748 189.411 51.6393 184.422 51.6393H177.455V46.3502H184.577C185.053 46.3502 185.511 46.1645 185.848 45.8339C186.185 45.5032 186.374 45.0548 186.374 44.5872" fill="currentColor"></path><path d="M195.945 41.1847H201.708C202.027 44.6629 204.386 46.8781 208.196 46.8781C211.598 46.8781 213.959 45.5455 213.959 42.7869C213.959 36.113 196.892 40.739 196.892 28.8174C196.896 23.7023 201.387 20.1479 207.839 20.1479C214.553 20.1479 219.088 23.9283 219.365 29.7565H213.633C213.363 27.0435 211.195 25.2196 207.828 25.2196C204.698 25.2196 202.748 26.6435 202.748 28.8218C202.748 35.7174 220.037 30.5609 220.037 42.7021C220.037 48.4846 215.182 51.9998 208.198 51.9998C200.986 51.9998 196.269 47.7281 195.952 41.189" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M29.7513 14.261C28.0767 11.3817 23.8903 11.3817 22.2157 14.261L3.96535 45.641C2.29077 48.5204 4.38399 52.1195 7.73316 52.1195H21.9804C20.5493 50.8688 20.0193 48.7051 21.1023 46.8487L34.9243 23.1556L29.7513 14.261Z" fill="#80EEC0"></path><path d="M41.3151 21.1443C42.701 18.7885 46.1656 18.7885 47.5515 21.1443L62.6552 46.8188C64.0411 49.1746 62.3088 52.1194 59.537 52.1194H29.3296C26.5579 52.1194 24.8255 49.1746 26.2114 46.8188L41.3151 21.1443Z" fill="#00DC82"></path></svg></div><div class="mt-4 bg-white dark:bg-sky-darker overflow-hidden shadow sm:rounded-lg"><div class="grid grid-cols-1 md:grid-cols-2"><div class="p-6"><div class="flex items-center"><svg class="w-6 h-6 text-cloud-dark dark:text-cloud-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg><div class="ml-4 text-lg leading-7 font-semibold"><a href="https://v3.nuxtjs.org" target="_blank" rel="noopener" class="hover:underline text-sky-black dark:text-white">` + ((__t = messages.documentation) == null ? "" : __t) + '</a></div></div><div class="ml-10"><div class="mt-2 text-cloud-dark dark:text-cloud-light text-sm">' + ((__t = messages.readDocs) == null ? "" : __t) + '<br><a href="https://v3.nuxtjs.org" class="inline-block mt-2 text-primary hover:underline" target="_blank" rel="noopener">' + ((__t = messages.documentation) == null ? "" : __t) + '</a></div></div></div><div class="p-6 border-t border-gray-200 dark:border-sky-darkest md:border-t-0 md:border-l"><div class="flex items-center"><svg class="w-6 h-6 text-cloud-dark dark:text-cloud-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg><div class="ml-4 text-lg leading-7 font-semibold"><a href="https://twitter.com/nuxt_js" target="_blank" rel="noopener" class="hover:underline text-sky-black dark:text-white">Twitter</a></div></div><div class="ml-10"><div class="mt-2 text-cloud-dark dark:text-cloud-light text-sm">' + ((__t = messages.followTwitter) == null ? "" : __t) + '<br><a href="https://twitter.com/nuxt_js" target="_blank" class="inline-block mt-2 text-primary hover:underline" rel="noopener">@nuxt_js</a></div></div></div></div></div><div class="mt-4 text-sm bg-white border-l-8 border-cloud-light dark:bg-sky-darker dark:border-sky overflow-hidden shadow sm:rounded-lg p-6 pl-4"><p>To remove this welcome page, <strong class="font-bold">you have 2 options</strong>:</p><ul class="list-inside list-disc pt-1 pl-2"><li>Create an <code class="text-primary">app.vue</code></li><li>Create a <code class="text-primary">pages/index.vue</code></li></ul></div></div></div></body></html>';
  return __p;
};
const _template = (messages) => _render({ messages: __spreadValues(__spreadValues({}, _messages), messages) });
const template = _template;
const _sfc_main$1 = {
  computed: {
    html: () => template({})
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>${$options.html}</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("node_modules/nuxt3/dist/app/components/nuxt-welcome.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtWelcome = __nuxt_component_0;
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtWelcome, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("pages/welcome.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const welcome = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
const welcome$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": welcome
});

export { entry$1 as default };
