// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"dPgNG":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "d35b1d94514bd8fd";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && ![
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
    ].includes(hostname) ? 'wss' : 'ws';
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        disposedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === 'reload') fullReload();
        else if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
                await hmrApplyUpdates(assets);
                hmrDisposeQueue();
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                let processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ('reload' in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"8Ty8R":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _sudokuWasmJs = require("../wasm/pkg/sudoku_wasm.js");
var _sudokuWasmJsDefault = parcelHelpers.interopDefault(_sudokuWasmJs);
var _themeJs = require("./theme.js");
var _typesJs = require("./types.js");
var _gameControllerJs = require("./game_controller.js");
var _gameJs = require("./game.js");
async function waitForDifficultyInput() {
    return new Promise((resolve)=>{
        const btns = document.getElementsByClassName('btn-difficulty');
        Array.from(btns).forEach((btn)=>{
            const val = parseInt(btn.dataset['value']);
            if (Number.isNaN(val)) {
                console.error('Invalid value');
                return;
            }
            btn.addEventListener('click', ()=>{
                resolve(val);
            });
        });
    });
}
// Switches to page `to` and hide other pages.
function switchPage(to) {
    Array.from(to.parentElement.children).forEach((node)=>{
        node.classList.remove('visible');
    });
    to.classList.add('visible');
}
async function main() {
    _themeJs.init();
    const initPageDom = document.getElementById('init-page');
    const loadingPageDom = document.getElementById('loading-page');
    const gamePageDom = document.getElementById('game-page');
    // Show the init page at first.
    switchPage(initPageDom);
    // Get the difficulty selected by the user.
    const difficulty = await waitForDifficultyInput();
    // Show the loading page.
    switchPage(loadingPageDom);
    await (0, _sudokuWasmJsDefault.default)().catch((error)=>{
        console.error('Error initializing WASM module:', error);
    });
    // So that panic output will look better in the console.
    _sudokuWasmJs.init_panic_hook();
    console.debug('wasm loaded');
    // Create a random game.
    console.debug('Generating game with difficulty: %d', difficulty);
    const puzzleArr = new Uint8Array(_typesJs.CELLS_NUMBER);
    const score = _sudokuWasmJs.generate(difficulty, puzzleArr);
    console.debug('Puzzle generated: ', puzzleArr);
    console.info('Puzzle score: ', score);
    const answerArr = new Uint8Array(puzzleArr);
    _sudokuWasmJs.fast_solve(answerArr);
    console.debug('Answer generated: ', answerArr);
    const answer = _typesJs.GenericBoard.createBoardFromUint8Array(answerArr);
    const puzzle = _typesJs.GenericBoard.createBoardFromUint8Array(puzzleArr);
    const game = new (0, _gameJs.Game)(answer, puzzle);
    const controller = new (0, _gameControllerJs.GameController)(game, gamePageDom);
    // Register global keyboard and mouse event.
    // We can add logic to remove this listener when necessary in the future.
    window.addEventListener('keydown', (ev)=>{
        if (controller.handleKeyDownEvent(ev)) ev.preventDefault();
    });
    window.addEventListener('click', ()=>{
        controller.handleOutOfBoundClick();
    });
    // Show the game page.
    switchPage(gamePageDom);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

},{"../wasm/pkg/sudoku_wasm.js":"4KiEL","./theme.js":"2sCQE","./types.js":"9hJrD","./game.js":"9G2KO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./game_controller.js":"kXpVr"}],"4KiEL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "init_panic_hook", ()=>init_panic_hook);
/**
 * @param {Uint8Array} board
 * @returns {number}
 */ parcelHelpers.export(exports, "fast_solve", ()=>fast_solve);
/**
 * @param {number} difficulty
 * @param {Uint8Array} output_puzzle
 * @returns {number}
 */ parcelHelpers.export(exports, "generate", ()=>generate);
parcelHelpers.export(exports, "initSync", ()=>initSync);
var global = arguments[3];
let wasm;
function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}
function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}
const cachedTextDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', {
    ignoreBOM: true,
    fatal: true
}) : {
    decode: ()=>{
        throw Error('TextDecoder not available');
    }
};
if (typeof TextDecoder !== 'undefined') cachedTextDecoder.decode();
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    return cachedUint8ArrayMemory0;
}
function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
let WASM_VECTOR_LEN = 0;
const cachedTextEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : {
    encode: ()=>{
        throw Error('TextEncoder not available');
    }
};
const encodeString = typeof cachedTextEncoder.encodeInto === 'function' ? function(arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};
function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
    let offset = 0;
    for(; offset < len; offset++){
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) arg = arg.slice(offset);
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    return cachedDataViewMemory0;
}
function isLikeNone(x) {
    return x === undefined || x === null;
}
function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function init_panic_hook() {
    wasm.init_panic_hook();
}
function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
function fast_solve(board) {
    var ptr0 = passArray8ToWasm0(board, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.fast_solve(ptr0, len0, board);
    if (ret[2]) throw takeFromExternrefTable0(ret[1]);
    return ret[0] >>> 0;
}
function generate(difficulty, output_puzzle) {
    var ptr0 = passArray8ToWasm0(output_puzzle, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.generate(difficulty, ptr0, len0, output_puzzle);
    return ret;
}
async function __wbg_load(module1, imports) {
    if (typeof Response === 'function' && module1 instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') try {
            return await WebAssembly.instantiateStreaming(module1, imports);
        } catch (e) {
            if (module1.headers.get('Content-Type') != 'application/wasm') console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
            else throw e;
        }
        const bytes = await module1.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module1, imports);
        if (instance instanceof WebAssembly.Instance) return {
            instance,
            module: module1
        };
        else return instance;
    }
}
function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_buffer_61b7ce01341d7f88 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_500db948e69c7330 = function() {
        return handleError(function(arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments);
    };
    imports.wbg.__wbg_call_b0d8e36992d9900d = function() {
        return handleError(function(arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments);
    };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally{
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() {
        return handleError(function(arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments);
    };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_new_3ff5b33b1ce712df = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_newnoargs_fd9e4bf8be2bc16d = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ba35896968751d91 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_34ce8f1051e74449 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_now_2c95c9de01293173 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
        const ret = arg0.performance;
        return ret;
    };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() {
        return handleError(function(arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments);
    };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() {
        return handleError(function() {
            const ret = module.require;
            return ret;
        }, arguments);
    };
    imports.wbg.__wbg_set_23d69db4e5c66a6e = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4, len1, true);
        getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_0be7472e492ad3e3 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_1a6eb482d12c9bfb = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_1dc398a895c82351 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_ae1c80c7eea8d64a = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_subarray_46adeb9b86949d12 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
        new Uint8Array(arg2.buffer, arg2.byteOffset, arg2.byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof arg0 === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof val === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof arg0 === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    return imports;
}
function __wbg_init_memory(imports, memory) {}
function __wbg_finalize_init(instance, module1) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module1;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}
function initSync(module1) {
    if (wasm !== undefined) return wasm;
    if (typeof module1 !== 'undefined') {
        if (Object.getPrototypeOf(module1) === Object.prototype) ({ module: module1 } = module1);
        else console.warn('using deprecated parameters for `initSync()`; pass a single object instead');
    }
    const imports = __wbg_get_imports();
    __wbg_init_memory(imports);
    if (!(module1 instanceof WebAssembly.Module)) module1 = new WebAssembly.Module(module1);
    const instance = new WebAssembly.Instance(module1, imports);
    return __wbg_finalize_init(instance, module1);
}
async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;
    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) ({ module_or_path } = module_or_path);
        else console.warn('using deprecated parameters for the initialization function; pass a single object instead');
    }
    if (typeof module_or_path === 'undefined') module_or_path = new URL(require("546f49a4ba1dcb3f"));
    const imports = __wbg_get_imports();
    if (typeof module_or_path === 'string' || typeof Request === 'function' && module_or_path instanceof Request || typeof URL === 'function' && module_or_path instanceof URL) module_or_path = fetch(module_or_path);
    __wbg_init_memory(imports);
    const { instance, module: module1 } = await __wbg_load(await module_or_path, imports);
    return __wbg_finalize_init(instance, module1);
}
exports.default = __wbg_init;

},{"546f49a4ba1dcb3f":"1lXr6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1lXr6":[function(require,module,exports,__globalThis) {
module.exports = require("562e2940dfd43e7c").getBundleURL('i92DL') + "sudoku_wasm_bg.c2b7e331.wasm" + "?" + Date.now();

},{"562e2940dfd43e7c":"lgJ39"}],"lgJ39":[function(require,module,exports,__globalThis) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return '/';
}
function getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}
// TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ('' + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"gkKU3":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"2sCQE":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getCurrentTheme", ()=>getCurrentTheme);
// This function should be called on init.
parcelHelpers.export(exports, "init", ()=>init);
const CURRENT_THEME = {
    colorPrefilled: '#050505',
    colorSolved: '#156363',
    colorDraft: '#447862',
    colorHighlightFg: '#007896',
    colorHighlightBg1: rgba('#dcc1c3', 1),
    colorHighlightBg2: rgba('#dcd1d1', 0.5),
    colorBg: '#fefefe'
};
function getCurrentTheme() {
    return CURRENT_THEME;
}
function rgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const CSS_JS_VAR_MAP = {
    'color-prefilled': 'colorPrefilled',
    'color-solved': 'colorSolved',
    'color-draft': 'colorDraft',
    'color-highlight-fg': 'colorHighlightFg',
    'color-highlight-bg1': 'colorHighlightBg1',
    'color-highlight-bg2': 'colorHighlightBg2',
    'color-bg': 'colorBg'
};
function init() {
    setTheme('default');
}
function setTheme(name) {
    for(const cssProp in CSS_JS_VAR_MAP){
        const jsProp = CSS_JS_VAR_MAP[cssProp];
        const cssVar = `--${name}-${cssProp}`;
        const val = window.getComputedStyle(document.body).getPropertyValue(cssVar);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        CURRENT_THEME[jsProp] = val;
        document.documentElement.style.setProperty(`--${cssProp}`, val);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9hJrD":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MAX_NUMBER", ()=>MAX_NUMBER);
parcelHelpers.export(exports, "CELLS_NUMBER", ()=>CELLS_NUMBER);
parcelHelpers.export(exports, "Coordinates", ()=>Coordinates);
parcelHelpers.export(exports, "Cell", ()=>Cell);
parcelHelpers.export(exports, "printCells", ()=>printCells);
parcelHelpers.export(exports, "validateCells", ()=>validateCells);
parcelHelpers.export(exports, "SolvingCellState", ()=>SolvingCellState);
parcelHelpers.export(exports, "SolvingCell", ()=>SolvingCell);
parcelHelpers.export(exports, "GenericBoard", ()=>GenericBoard);
parcelHelpers.export(exports, "mergeCellLists", ()=>mergeCellLists);
const MAX_NUMBER = 9;
const CELLS_NUMBER = MAX_NUMBER * MAX_NUMBER;
const CHAR_FOR_EMPTY_CELL = '.';
const NUMBER_FOR_EMPTY_CELL = 0;
function assertIndexInRange(value, desc) {
    if (!Number.isInteger(value) || value < 0 || value >= MAX_NUMBER) throw new RangeError(`Invalid ${desc}: ${value}`);
}
function assertCellValueInRange(value) {
    if (!Number.isInteger(value) || value < 1 || value > MAX_NUMBER) throw new RangeError(`Invalid cell value: ${value}`);
}
class CellValueSet {
    bitmap;
    constructor(initValue = false){
        this.bitmap = new Array(MAX_NUMBER + 1).fill(initValue);
    }
    clone() {
        const ret = new CellValueSet();
        for(let i = 0; i < this.bitmap.length; i++)ret.bitmap[i] = this.bitmap[i];
        return ret;
    }
    add(value) {
        this.bitmap[value] = true;
        return this;
    }
    delete(value) {
        const ret = this.bitmap[value];
        this.bitmap[value] = false;
        return ret;
    }
    has(value) {
        return this.bitmap[value];
    }
    clear() {
        this.bitmap.fill(false);
    }
    addAll() {
        this.bitmap.fill(true);
    }
    hasAll() {
        for(let i = 1; i <= MAX_NUMBER; i++){
            if (!this.bitmap[i]) return false;
        }
        return true;
    }
    getUnique() {
        let ret = null;
        for(let i = 1; i <= MAX_NUMBER; i++){
            if (!this.bitmap[i]) continue;
            if (ret === null) ret = i;
            else return null;
        }
        return ret;
    }
    toString() {
        let ret = '';
        for(let i = 1; i <= MAX_NUMBER; i++)if (this.bitmap[i]) ret += `${i} `;
        return ret + `: ${this.getUnique()}`;
    }
}
class Coordinates {
    x;
    y;
    linearIndex;
    squareIndex;
    constructor(x, y){
        assertIndexInRange(x, 'x');
        assertIndexInRange(y, 'y');
        this.x = x;
        this.y = y;
        this.linearIndex = x + y * MAX_NUMBER;
        this.squareIndex = Math.floor(x / 3) + Math.floor(y / 3) * 3;
    }
    static fromLinearIndex(i) {
        return new Coordinates(i % MAX_NUMBER, Math.floor(i / MAX_NUMBER));
    }
    toString() {
        return `(x: ${this.x}, y: ${this.y}, square: ${this.squareIndex})`;
    }
}
class Cell {
    coordinate;
    value;
    constructor(coordinate, value){
        if (value !== null) assertCellValueInRange(value);
        this.coordinate = coordinate;
        this.value = value;
    }
    toChar() {
        return this.value === null ? CHAR_FOR_EMPTY_CELL : this.value.toString();
    }
    static fromChar(coordinate, char) {
        if (char === CHAR_FOR_EMPTY_CELL) return new Cell(coordinate, null);
        return new Cell(coordinate, parseInt(char));
    }
    static fromNumber(coordinate, val) {
        if (val === NUMBER_FOR_EMPTY_CELL) return new Cell(coordinate, null);
        return new Cell(coordinate, val);
    }
}
function printCells(cells) {
    return cells.map((cell)=>cell.toChar()).join('');
}
function validateCells(cells, strict = false) {
    if (cells.length !== MAX_NUMBER) throw new Error(`Got cell size ${cells.length}, want ${MAX_NUMBER}`);
    const values = new CellValueSet();
    for (const cell of cells){
        if (cell.value === null) continue;
        if (values.has(cell.value)) return false;
    }
    return !strict || values.hasAll();
}
var SolvingCellState;
(function(SolvingCellState) {
    SolvingCellState["PREFILLED"] = "Prefilled";
    SolvingCellState["SOLVING"] = "Solving";
    SolvingCellState["SOLVED"] = "Solved";
})(SolvingCellState || (SolvingCellState = {}));
class SolvingCell extends Cell {
    state;
    draftNumbers;
    static newPrefilled(coordinate, value) {
        return new SolvingCell(coordinate, SolvingCellState.PREFILLED, value);
    }
    static newSolving(coordinate) {
        return new SolvingCell(coordinate, SolvingCellState.SOLVING, null);
    }
    constructor(coordinate, state, value){
        super(coordinate, value);
        this.state = state;
        this.draftNumbers = new CellValueSet(false);
    }
    clone() {
        const ret = new SolvingCell(this.coordinate, this.state, this.value);
        ret.draftNumbers = this.draftNumbers.clone();
        return ret;
    }
    hasNumber() {
        switch(this.state){
            case SolvingCellState.PREFILLED:
            case SolvingCellState.SOLVED:
                return true;
            case SolvingCellState.SOLVING:
                return false;
        }
    }
    addAllDraftNumber() {
        for(let i = 1; i <= MAX_NUMBER; i++)this.draftNumbers.add(i);
    }
    hasDraftNumber(value) {
        return this.draftNumbers.has(value);
    }
    addDraftNumber(value) {
        this.draftNumbers.add(value);
    }
    removeDraftNumber(value) {
        this.draftNumbers.delete(value);
    }
    fillNumber(value) {
        assertCellValueInRange(value);
        this.value = value;
        this.draftNumbers.clear();
        this.state = SolvingCellState.SOLVED;
    }
    toString() {
        return `${this.coordinate} state: ${this.state}, possibleValues: ${this.draftNumbers}`;
    }
}
class GenericBoard {
    cells;
    constructor(cells){
        for(let i = 0; i < CELLS_NUMBER; i++){
            if (cells[i].coordinate.linearIndex !== i) throw new Error(`Invalid cell ${cells[i]}`);
        }
        this.cells = cells;
    }
    static createBoardFromString(chars) {
        // Drop all empty chars.
        chars = chars.replace(/\s/g, '');
        if (chars.length !== CELLS_NUMBER) throw new Error(`Input char length ${chars.length}, want ${CELLS_NUMBER}`);
        const cells = new Array();
        for(let i = 0; i < CELLS_NUMBER; i++)cells.push(Cell.fromChar(Coordinates.fromLinearIndex(i), chars[i]));
        return new GenericBoard(cells);
    }
    static createBoardFromUint8Array(numbers) {
        if (numbers.length !== CELLS_NUMBER) throw new Error(`Input char length ${numbers.length}, want ${CELLS_NUMBER}`);
        const cells = new Array();
        for(let i = 0; i < CELLS_NUMBER; i++)cells.push(Cell.fromNumber(Coordinates.fromLinearIndex(i), numbers[i]));
        return new GenericBoard(cells);
    }
    printBoard() {
        let ret = '';
        for(let i = 0; i < CELLS_NUMBER; i++){
            ret += this.cells[i].toChar();
            if (i % MAX_NUMBER === MAX_NUMBER - 1) ret += '\n';
        }
        return ret;
    }
    getCellByCoord(coord) {
        return this.cells[coord.linearIndex];
    }
    getCellsByRow(rowIndex) {
        assertIndexInRange(rowIndex, 'rowIndex');
        const ret = new Array();
        for(let i = 0; i < MAX_NUMBER; i++)ret.push(this.cells[rowIndex * MAX_NUMBER + i]);
        return ret;
    }
    getCellsByColumn(columnIndex) {
        assertIndexInRange(columnIndex, 'columnIndex');
        const ret = new Array();
        for(let i = 0; i < MAX_NUMBER; i++)ret.push(this.cells[i * MAX_NUMBER + columnIndex]);
        return ret;
    }
    getCellsBySquare(squareIndex) {
        assertIndexInRange(squareIndex, 'squareIndex');
        return this.cells.filter((cell)=>cell.coordinate.squareIndex === squareIndex);
    }
    getCellsByNeighborToCoord(coord) {
        return mergeCellLists([
            this.getCellsByColumn(coord.x),
            this.getCellsByRow(coord.y),
            this.getCellsBySquare(coord.squareIndex)
        ]);
    }
    validate(strict) {
        for(let i = 0; i < MAX_NUMBER; i++){
            if (!validateCells(this.getCellsByRow(i), strict)) return false;
            if (!validateCells(this.getCellsByColumn(i), strict)) return false;
            if (!validateCells(this.getCellsBySquare(i), strict)) return false;
        }
        return true;
    }
}
function mergeCellLists(arrays) {
    const seen = new Set();
    const merged = [];
    for (const arr of arrays){
        if (arr) for (const cell of arr){
            if (cell) {
                if (!seen.has(cell)) {
                    seen.add(cell);
                    merged.push(cell);
                }
            }
        }
    }
    return merged;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9G2KO":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Game contains the logic related to one round of game. It's supposed to be independent of UI.
parcelHelpers.export(exports, "Game", ()=>Game);
var _solveJs = require("./solve.js");
class Game {
    answerBoard;
    puzzleBoard;
    // Game start time and end time.
    startTime;
    endTime = null;
    // Saved state.
    savedPuzzleBoard = null;
    // Number of the wrong input.
    mistakes = 0;
    constructor(answer, puzzle){
        this.answerBoard = answer;
        this.puzzleBoard = (0, _solveJs.SolvingBoard).createFromBoard(puzzle);
        this.startTime = performance.now();
    }
    // Fills in `value` at `coord`.
    fillInNumber(coord, value) {
        const cell = this.puzzleBoard.cells[coord.linearIndex];
        if (cell.hasNumber()) {
            console.debug('%s already have number', coord);
            return;
        }
        // TODO: This part should be able to be controlled by rules.
        if (this.answerBoard.cells[coord.linearIndex].value !== value) {
            alert('Not correct :)');
            this.mistakes++;
            return;
        }
        cell.fillNumber(value);
        // Remove all draft numbers which are no longer possible after this action.
        const actions = (0, _solveJs.eliminatePossibleStates)(this.puzzleBoard);
        this.puzzleBoard.takeActions(actions);
        // All values have been filled.
        if (this.isAllCorrect()) {
            this.endTime = performance.now();
            alert('Congratulations!!!');
        }
    }
    toggleDraftNumber(coord, value) {
        const cell = this.puzzleBoard.cells[coord.linearIndex];
        if (cell.hasNumber()) {
            console.debug('%s already have number', coord);
            return;
        }
        if (cell.hasDraftNumber(value)) cell.removeDraftNumber(value);
        else cell.addDraftNumber(value);
    }
    recalculateDraftNumbers() {
        for (const cell of this.puzzleBoard.cells)if (!cell.hasNumber()) cell.addAllDraftNumber();
        const actions = (0, _solveJs.eliminatePossibleStates)(this.puzzleBoard);
        this.puzzleBoard.takeActions(actions);
    }
    getEmptyCellsCount() {
        let cnt = 0;
        for (const cell of this.puzzleBoard.cells)if (!cell.hasNumber()) cnt++;
        return cnt;
    }
    getElapsedSeconds() {
        let end = performance.now();
        if (this.endTime !== null) end = this.endTime;
        return Math.round((end - this.startTime) / 1000);
    }
    isAllCorrect() {
        for(let i = 0; i < 81; ++i){
            if (this.puzzleBoard.cells[i].value !== this.answerBoard.cells[i].value) return false;
        }
        return true;
    }
    saveState() {
        this.savedPuzzleBoard = this.puzzleBoard.clone();
    }
    loadState() {
        if (this.savedPuzzleBoard === null) {
            console.error('No saved data');
            return;
        }
        this.puzzleBoard = this.savedPuzzleBoard;
        this.savedPuzzleBoard = null;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./solve.js":"8BHvx"}],"8BHvx":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SolvingBoard", ()=>SolvingBoard);
parcelHelpers.export(exports, "eliminatePossibleStates", ()=>eliminatePossibleStates);
parcelHelpers.export(exports, "solve", ()=>solve);
var _typesJs = require("./types.js");
class SolvingBoard extends _typesJs.GenericBoard {
    static createFromBoard(board) {
        const cells = new Array();
        for (const cell of board.cells)if (cell.value === null) cells.push((0, _typesJs.SolvingCell).newSolving(cell.coordinate));
        else cells.push((0, _typesJs.SolvingCell).newPrefilled(cell.coordinate, cell.value));
        return new SolvingBoard(cells);
    }
    clone() {
        return new SolvingBoard(this.cells.map((c)=>c.clone()));
    }
    getEmptyCellsCount() {
        return this.cells.filter((cell)=>cell.state === (0, _typesJs.SolvingCellState).SOLVING).length;
    }
    getAvailableNumbersForCell(coord) {
        const cell = this.cells[coord.linearIndex];
        if (cell.hasNumber()) return new Set();
        const neighColors = new Set();
        this.getCellsByNeighborToCoord(coord).forEach((x)=>{
            if (x.value) neighColors.add(x.value);
        });
        const ret = new Set();
        for(let i = 1; i <= 9; ++i)if (!neighColors.has(i)) ret.add(i);
        return ret;
    }
    takeAction(action) {
        console.debug(actionToString(action));
        const cell = this.getCellByCoord(action.coordinate);
        switch(action.type){
            case ActionType.REMOVE_DRAFT_NUMBER:
                cell.removeDraftNumber(action.value);
                break;
            case ActionType.FILL_IN_NUMBER:
                cell.fillNumber(action.value);
                break;
        }
    }
    takeActions(actions) {
        for (const action of actions)this.takeAction(action);
    }
}
var ActionType;
(function(ActionType) {
    ActionType["REMOVE_DRAFT_NUMBER"] = "remove draft number";
    ActionType["FILL_IN_NUMBER"] = "fill in number";
})(ActionType || (ActionType = {}));
function actionToString(a) {
    return `${a.coordinate.toString()}: ${a.type} value ${a.value}, reason: ${a.reasonString}`;
}
function eliminatePossibleStates(board) {
    const ret = new Array();
    const addAction = function(targetCell, value, sourceCell) {
        if (targetCell.state === (0, _typesJs.SolvingCellState).SOLVING && targetCell.draftNumbers.has(value)) ret.push({
            coordinate: targetCell.coordinate,
            type: ActionType.REMOVE_DRAFT_NUMBER,
            value: value,
            reasonString: `Conflict with ${sourceCell.toString()}`
        });
    };
    for(let i = 0; i < (0, _typesJs.CELLS_NUMBER); i++){
        const coord = _typesJs.Coordinates.fromLinearIndex(i);
        const cell = board.cells[i];
        if (cell.state === (0, _typesJs.SolvingCellState).SOLVING) continue;
        if (cell.value === null) throw new Error('Invalid state');
        const valueToRemove = cell.value;
        for (const targetCell of board.getCellsByColumn(coord.x))addAction(targetCell, valueToRemove, cell);
        for (const targetCell of board.getCellsByRow(coord.y))addAction(targetCell, valueToRemove, cell);
        for (const targetCell of board.getCellsBySquare(coord.squareIndex))addAction(targetCell, valueToRemove, cell);
    }
    return ret;
}
function uniqueValueSetter(board) {
    const ret = new Array();
    const addAction = function(cell, value) {
        ret.push({
            coordinate: cell.coordinate,
            type: ActionType.FILL_IN_NUMBER,
            value: value,
            reasonString: null
        });
    };
    for(let i = 0; i < (0, _typesJs.CELLS_NUMBER); i++){
        const cell = board.cells[i];
        if (cell.state !== (0, _typesJs.SolvingCellState).SOLVING) continue;
        const value = cell.draftNumbers.getUnique();
        if (value !== null) addAction(cell, value);
    }
    return ret;
}
function solve(board) {
    const solvingBoard = SolvingBoard.createFromBoard(board);
    // eslint-disable-next-line no-constant-condition
    while(true){
        const solvers = [
            {
                solve: eliminatePossibleStates
            },
            {
                solve: uniqueValueSetter
            }
        ];
        const before = solvingBoard.getEmptyCellsCount();
        for (const solver of solvers){
            const actions = solver.solve(solvingBoard);
            console.debug(actions.length);
            solvingBoard.takeActions(actions);
        }
        const after = solvingBoard.getEmptyCellsCount();
        console.debug(solvingBoard.printBoard());
        if (before === after) break;
    }
}

},{"./types.js":"9hJrD","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kXpVr":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * In the UI of the game page, there are mainly 3 parts.
 * - Banner: contains the game statistics;
 * - Board: displays the puzzle;
 * - Buttons: contains actions for the game.
 */ parcelHelpers.export(exports, "GameController", ()=>GameController);
var _boardUiJs = require("./board_ui.js");
function secondsToHumanReadable(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
function keyCodeToDirection(code) {
    switch(code){
        case 'ArrowUp':
            return (0, _boardUiJs.MoveDirection).UP;
        case 'ArrowDown':
            return (0, _boardUiJs.MoveDirection).DOWN;
        case 'ArrowLeft':
            return (0, _boardUiJs.MoveDirection).LEFT;
        case 'ArrowRight':
            return (0, _boardUiJs.MoveDirection).RIGHT;
        default:
            throw new Error('Unreachable');
    }
}
const HTML_CONTENT = `
<p id="notification" class="hidden">Prompt</p>
<div id="board-banner">
  <span>Time:&nbsp;<span id="value-timer">0:00</span></span>
  <span>Mistakes:&nbsp;<span id="value-mistakes">0</span></span>
  <span>Remaining:&nbsp;<span id="value-remaining">0</span></span>
</div>
<div id="board" style="position: relative;"></div>
<div id="board-buttons">
  <span class="btn-default enabled" id="btn-new-game">New Game</span>
  <span class="btn-default enabled" id="btn-quick-draft">Quick Draft</span>
  <span class="btn-default enabled" id="btn-save">Save</span>
  <span class="btn-default enabled" id="btn-load">Load</span>
</div>`;
class GameController {
    game;
    pageDom;
    boardUi;
    constructor(game, pageDom){
        this.game = game;
        this.pageDom = pageDom;
        // Update the internal html.
        this.pageDom.setHTMLUnsafe(HTML_CONTENT);
        // Initialize the banner.
        this.refreshBanner();
        // Create the board drawing.
        const boardDom = document.getElementById('board');
        this.boardUi = new (0, _boardUiJs.BoardUi)(boardDom, game.puzzleBoard, this.handleNumberInput.bind(this), {
            size: boardDom.clientWidth,
            highlightCursorNeighbors: true,
            highlightNumber: true,
            highlightNumberNeighbors: true
        });
        // Set up button actions.
        const quickDraftBtn = document.getElementById('btn-quick-draft');
        quickDraftBtn?.addEventListener('click', (ev)=>{
            ev.stopPropagation();
            this.game.recalculateDraftNumbers();
            this.boardUi.updateBoard();
        });
        const newGameBtn = document.getElementById('btn-new-game');
        newGameBtn.addEventListener('click', (ev)=>{
            ev.stopPropagation();
            if (confirm('Abort the current game and start a new one?') === true) location.reload();
        });
        const saveBtn = document.getElementById('btn-save');
        const loadBtn = document.getElementById('btn-load');
        const updateSaveLoadBtnState = ()=>{
            if (game.savedPuzzleBoard !== null) {
                loadBtn.classList.add('enabled');
                loadBtn.classList.remove('disabled');
            } else {
                loadBtn.classList.remove('enabled');
                loadBtn.classList.add('disabled');
            }
        };
        updateSaveLoadBtnState();
        saveBtn.addEventListener('click', (ev)=>{
            ev.stopPropagation();
            game.saveState();
            updateSaveLoadBtnState();
            this.showNotification('Saved');
        });
        loadBtn.addEventListener('click', (ev)=>{
            ev.stopPropagation();
            if (!loadBtn.classList.contains('enabled')) return;
            if (confirm('Load previously saved state?') === true) {
                game.loadState();
                this.boardUi.updateBoard(game.puzzleBoard);
                updateSaveLoadBtnState();
                this.showNotification('Loaded');
            }
        });
    }
    // Handle keyboard event for the game. Returns whether the event is consumed by this component.
    handleKeyDownEvent(ev) {
        console.debug(ev);
        switch(ev.code){
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.boardUi.moveCursor(keyCodeToDirection(ev.code));
                return true;
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
            case 'Digit8':
            case 'Digit9':
                this.handleDigitKeyEvent(ev);
                return true;
            case 'KeyD':
                this.game.recalculateDraftNumbers();
                this.boardUi.updateBoard();
                return true;
            default:
                // Do nothing now.
                return false;
        }
    }
    // Note: We cannot declare vars in a case branch, so have a separate function here.
    handleDigitKeyEvent(ev) {
        const value = parseInt(ev.code.charAt(5));
        if (this.boardUi.cursorCoord !== null) this.handleNumberInput(value, !ev.shiftKey);
    }
    handleNumberInput(value, draftMode) {
        if (this.boardUi.cursorCoord === null) return;
        console.debug('hit %d', value);
        if (!draftMode) this.game.fillInNumber(this.boardUi.cursorCoord, value);
        else this.game.toggleDraftNumber(this.boardUi.cursorCoord, value);
        this.boardUi.updateBoard();
        this.refreshBanner(true);
    }
    handleOutOfBoundClick() {
        // Reset cursor if we lost the focus.
        this.boardUi.updateCursor(null);
    }
    showNotification(msg) {
        const dom = document.getElementById('notification');
        dom.innerText = msg;
        dom.classList.remove('hidden');
        setTimeout(()=>{
            dom.classList.add('hidden');
        }, 2500);
    }
    refreshBanner(once = false) {
        const timerDom = document.getElementById('value-timer');
        const mistakesDom = document.getElementById('value-mistakes');
        const remainingDom = document.getElementById('value-remaining');
        timerDom.textContent = `${secondsToHumanReadable(this.game.getElapsedSeconds())}`;
        mistakesDom.textContent = `${this.game.mistakes}`;
        remainingDom.textContent = `${this.game.getEmptyCellsCount()}`;
        // TODO: Add stop condition.
        if (!once) // We are showing a timer on the UI, so refresh it every second.
        setTimeout(()=>this.refreshBanner(), 1000);
    }
}

},{"./board_ui.js":"1E9Ho","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1E9Ho":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MoveDirection", ()=>MoveDirection);
parcelHelpers.export(exports, "BoardUi", ()=>BoardUi);
var _typesJs = require("./types.js");
var _themeJs = require("./theme.js");
function drawLine(ctx, x1, y1, x2, y2, style) {
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width ? style.width : 1;
    // Square is better for drawing border of the grid.
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function getCanvas2DContext(canvas) {
    return canvas.getContext('2d');
}
function clearCanvas(canvas) {
    const ctx = getCanvas2DContext(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
var MoveDirection;
(function(MoveDirection) {
    MoveDirection[MoveDirection["UP"] = 0] = "UP";
    MoveDirection[MoveDirection["DOWN"] = 1] = "DOWN";
    MoveDirection[MoveDirection["RIGHT"] = 2] = "RIGHT";
    MoveDirection[MoveDirection["LEFT"] = 3] = "LEFT";
})(MoveDirection || (MoveDirection = {}));
const CANVAS_MARGIN = 5;
const VIRTUAL_KB_HTML = `
<div id="draft-mode-line">
  <label class="switch">
    <input type="checkbox" id="kb-draft-mode-switch" checked="true">
    <span class="slider"></span>
  </label>
  <span>Draft mode</span>
</div>
<div div class="keyboard" id="keyboard"></div>
`;
const VIRTUAL_KEYBOARD_ID = 'num-keyboard';
// Shows a keyboard for inputting digits for the Sudoku game.
class VirtualKeyboard {
    cb;
    container;
    width;
    height;
    constructor(parent, keyInputCallback){
        this.container = document.createElement('div');
        this.container.id = VIRTUAL_KEYBOARD_ID;
        parent.appendChild(this.container);
        this.container.setHTMLUnsafe(VIRTUAL_KB_HTML);
        this.container.classList.add('fading-fast');
        this.cb = keyInputCallback;
        const keyboard = document.getElementById('keyboard');
        const keyboardDraftModeSwitch = document.getElementById('kb-draft-mode-switch');
        for(let i = 1; i <= 9; i++){
            const key = document.createElement('div');
            key.classList.add('key');
            key.classList.add('btn-default');
            key.textContent = `${i}`;
            key.dataset['value'] = `${i}`;
            key.addEventListener('click', (ev)=>{
                ev.preventDefault();
                ev.stopPropagation();
                if (key.classList.contains('disabled')) return;
                this.cb(i, keyboardDraftModeSwitch.checked);
            });
            keyboard.appendChild(key);
        }
        // Scope the click events.
        this.container.addEventListener('click', (ev)=>{
            ev.stopPropagation();
        });
        // This needs to be called before hide(), otherwise they will be all 0s.
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.hide();
        this.configureDraggable();
    }
    // Make the virtual keyboard draggable.
    configureDraggable() {
        let isDragging = false;
        const c = this.container;
        let offsetX = 0;
        let offsetY = 0;
        const handleStart = (e)=>{
            isDragging = true;
            c.classList.remove('fading-fast');
            offsetX = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - c.offsetLeft;
            offsetY = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - c.offsetTop;
        };
        const handleMove = (e)=>{
            if (!isDragging) return;
            const x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - offsetX;
            const y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - offsetY;
            const maxX = window.innerWidth - c.offsetWidth;
            const maxY = window.innerHeight - c.offsetHeight;
            requestAnimationFrame(()=>{
                c.style.left = Math.min(Math.max(0, x), maxX) + 'px';
                c.style.top = Math.min(Math.max(0, y), maxY) + 'px';
            });
        };
        const handleEnd = ()=>{
            isDragging = false;
            c.classList.add('fading-fast');
        };
        c.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('mouseleave', handleEnd);
        c.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        document.addEventListener('touchcancel', handleEnd);
    }
    show(boardUi, coord) {
        // Calculate the location.
        const w = this.width;
        const h = this.height;
        const x1 = boardUi.getCanvasPosForIdx(coord.x);
        const x2 = boardUi.getCanvasPosForIdx(coord.x + 1);
        const y1 = boardUi.getCanvasPosForIdx(coord.y);
        const y2 = boardUi.getCanvasPosForIdx(coord.y + 1);
        const MARGIN = 8;
        const x = x1 - w - MARGIN > 0 ? x1 - w - MARGIN : x2 + MARGIN / 2;
        const y = y2 + h < boardUi.config.size ? y2 + MARGIN / 2 : y1 - MARGIN - h;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
        this.refreshNumbers(boardUi, coord);
        // Show it.
        const c = this.container;
        c.classList.remove('hidden');
        console.debug('display virtual keyboard at (%d, %d)', x, y);
    }
    refreshNumbers(boardUi, coord) {
        // Hide unavailable numbers.
        const draftNumbers = boardUi.gameBoard.getCellByCoord(coord).draftNumbers;
        const availableNumbers = boardUi.gameBoard.getAvailableNumbersForCell(coord);
        const keyboard = document.getElementById('keyboard');
        keyboard.childNodes.forEach((node)=>{
            const dom = node;
            const value = parseInt(dom.dataset['value']);
            if (availableNumbers.has(value)) {
                dom.classList.add('enabled');
                dom.classList.remove('disabled');
            } else {
                dom.classList.add('disabled');
                dom.classList.remove('enabled');
            }
            if (draftNumbers.has(value)) dom.classList.add('highlight');
            else dom.classList.remove('highlight');
        });
    }
    hide() {
        console.debug('hide virtual keyboard');
        this.container.classList.add('hidden');
    }
}
class BoardUi {
    config;
    container;
    gameBoard;
    virtualKeyboard;
    gridCanvas;
    neighHighlightCanvas;
    numberHighlightCanvas;
    // The canvas layer for displaying numbers.
    numbersCanvas;
    // The canvas layer for displaying cursor.
    cursorCanvas;
    // The canvas layer for handling mouse event.
    clickCanvas;
    cursorCoord = null;
    focusedNumber = null;
    focusedLevel = 0;
    constructor(container, gameBoard, digitInputCallback, config){
        this.container = container;
        this.gameBoard = gameBoard;
        this.virtualKeyboard = new VirtualKeyboard(this.container, (v, b)=>{
            // Do not hide in draft mode.
            if (!b) this.virtualKeyboard.hide();
            digitInputCallback(v, b);
            if (this.cursorCoord) this.virtualKeyboard.refreshNumbers(this, this.cursorCoord);
        });
        this.updateConfig(config);
        container.style.height = `${container.clientWidth}px`;
    }
    getTheme() {
        return _themeJs.getCurrentTheme();
    }
    getCellSize() {
        return (this.config.size - CANVAS_MARGIN * 2) / 9;
    }
    getCanvasPosForIdx(index) {
        return CANVAS_MARGIN + this.getCellSize() * index;
    }
    getIdxForCanvasPos(pos) {
        for(let i = 0; i < 9; ++i){
            if (pos < this.getCanvasPosForIdx(i + 1) && pos > this.getCanvasPosForIdx(i)) return i;
        }
        return null;
    }
    updateBoard(board = null) {
        if (board !== null) this.gameBoard = board;
        this.redrawNumbers();
        this.redrawHighlight();
    }
    updateConfig(config) {
        this.config = config;
        // Remove all canvas children at first.
        Array.from(this.container.children).forEach((child)=>{
            if (!(child instanceof HTMLCanvasElement)) return;
            this.container.removeChild(child);
        });
        this.numberHighlightCanvas = this.createCanvas(1);
        this.neighHighlightCanvas = this.createCanvas(2);
        this.gridCanvas = this.createCanvas(3);
        this.numbersCanvas = this.createCanvas(4);
        this.cursorCanvas = this.createCanvas(5);
        this.clickCanvas = this.createCanvas(6);
        this.redrawGrid();
        this.redrawNumbers();
        this.clickCanvas.addEventListener('click', (ev)=>{
            ev.preventDefault();
            ev.stopPropagation();
            this.virtualKeyboard.hide();
            const rect = this.clickCanvas.getBoundingClientRect();
            const x = this.getIdxForCanvasPos(ev.clientX - rect.left);
            const y = this.getIdxForCanvasPos(ev.clientY - rect.top);
            // Reset cursor if the click is out of bound.
            if (x === null || y === null) this.updateCursor(null);
            else {
                const coord = new (0, _typesJs.Coordinates)(x, y);
                this.updateCursor(coord);
                // If the cell is empty, show keyboard.
                const cell = this.gameBoard.getCellByCoord(coord);
                if (cell.value === null) this.virtualKeyboard.show(this, coord);
                else this.updateFocusedNumber(cell.value, 0);
            }
        });
        this.clickCanvas.addEventListener('dblclick', (ev)=>{
            ev.preventDefault();
            ev.stopPropagation();
            const rect = this.clickCanvas.getBoundingClientRect();
            const x = this.getIdxForCanvasPos(ev.clientX - rect.left);
            const y = this.getIdxForCanvasPos(ev.clientY - rect.top);
            // Reset cursor if the click is out of bound.
            if (x === null || y === null) this.updateFocusedNumber(null);
            else {
                const cell = this.gameBoard.getCellByCoord(new (0, _typesJs.Coordinates)(x, y));
                // Allow double click to cancel selection.
                this.updateFocusedNumber(cell.value === this.focusedNumber && this.focusedLevel === 1 ? null : cell.value, 1);
            }
        });
    }
    updateCursor(coord) {
        console.debug('Set cursor to %s', coord);
        if (coord === null) this.virtualKeyboard.hide();
        // TODO: If the pos did not change, we can skip the following logic.
        this.cursorCoord = coord;
        this.redrawCursor();
        this.redrawHighlight();
    }
    moveCursor(d) {
        if (!this.cursorCoord) return;
        this.virtualKeyboard.hide();
        let x = this.cursorCoord.x;
        let y = this.cursorCoord.y;
        switch(d){
            case MoveDirection.UP:
                y -= 1;
                break;
            case MoveDirection.DOWN:
                y += 1;
                break;
            case MoveDirection.LEFT:
                x -= 1;
                break;
            case MoveDirection.RIGHT:
                x += 1;
                break;
        }
        if (x < 9 && x >= 0 && y < 9 && y >= 0) this.updateCursor(new (0, _typesJs.Coordinates)(x, y));
    }
    updateFocusedNumber(value, focusedLevel = 0) {
        this.focusedNumber = value;
        this.focusedLevel = focusedLevel;
        this.redrawHighlight();
        this.redrawNumbers();
    }
    createCanvas(zIndex) {
        const canvas = document.createElement('canvas');
        const size = this.config.size;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.zIndex = `${zIndex}`;
        // Scale the canvas properly.
        const ratio = window.devicePixelRatio;
        canvas.width = size * ratio;
        canvas.height = size * ratio;
        const ctx = getCanvas2DContext(canvas);
        ctx.scale(ratio, ratio);
        this.container.appendChild(canvas);
        return canvas;
    }
    redrawHighlight() {
        clearCanvas(this.neighHighlightCanvas);
        clearCanvas(this.numberHighlightCanvas);
        const highlightCell = (ctx, coord, color)=>{
            const x = this.getCanvasPosForIdx(coord.x);
            const y = this.getCanvasPosForIdx(coord.y);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, this.getCellSize(), this.getCellSize());
        };
        const highlightDraftCell = (ctx, coord, value, color)=>{
            const boxSize = this.getCellSize() / 3;
            const x = this.getCanvasPosForIdx(coord.x) + Math.floor((value - 1) % 3) * boxSize;
            const y = this.getCanvasPosForIdx(coord.y) + Math.floor((value - 1) / 3) * boxSize;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, boxSize, boxSize);
        };
        const cursor = this.cursorCoord;
        if (cursor && this.config.highlightCursorNeighbors) {
            const ctx = getCanvas2DContext(this.neighHighlightCanvas);
            const cells = this.gameBoard.getCellsByNeighborToCoord(cursor);
            for (const cell of cells)highlightCell(ctx, cell.coordinate, this.getTheme().colorHighlightBg1);
        }
        if (this.focusedNumber !== null && (this.config.highlightNumberNeighbors || this.config.highlightNumber)) {
            const ctx = getCanvas2DContext(this.numberHighlightCanvas);
            const numberCells = this.gameBoard.cells.filter((c)=>{
                return c.value === this.focusedNumber;
            });
            let cells = numberCells.slice();
            if (this.config.highlightNumberNeighbors && this.focusedLevel === 1) {
                const cellArrays = numberCells.map((c)=>{
                    return this.gameBoard.getCellsByNeighborToCoord(c.coordinate);
                });
                cells = (0, _typesJs.mergeCellLists)(cellArrays);
            }
            for (const cell of cells)highlightCell(ctx, cell.coordinate, this.getTheme().colorHighlightBg2);
            // Also highlight all draft values.
            for (const cell of this.gameBoard.cells)if (cell.hasDraftNumber(this.focusedNumber)) highlightDraftCell(ctx, cell.coordinate, this.focusedNumber, this.getTheme().colorHighlightBg1);
        }
    }
    redrawGrid() {
        const ctx = getCanvas2DContext(this.gridCanvas);
        if (!ctx) {
            console.error('Context not available');
            return;
        }
        const startPos = this.getCanvasPosForIdx(0);
        const endPos = this.getCanvasPosForIdx(9);
        const style = {
            color: this.getTheme().colorPrefilled
        };
        const sqrBorderStyle = {
            color: this.getTheme().colorPrefilled,
            width: 3
        };
        for(let i = 0; i <= 9; i++){
            const pos = this.getCanvasPosForIdx(i);
            drawLine(ctx, startPos, pos, endPos, pos, i % 3 ? style : sqrBorderStyle);
            drawLine(ctx, pos, startPos, pos, endPos, i % 3 ? style : sqrBorderStyle);
        }
    }
    redrawNumbers() {
        if (!this.gameBoard) return;
        const ctx = this.numbersCanvas.getContext('2d');
        if (!ctx) {
            console.error('Context not available');
            return;
        }
        clearCanvas(this.numbersCanvas);
        const drawNumber = (val, coord, small, defaultColor)=>{
            const boxSize = this.getCellSize() / (small ? 3 : 1);
            const fontSize = boxSize * 0.8;
            let x = this.getCanvasPosForIdx(coord.x) + boxSize / 2;
            let y = this.getCanvasPosForIdx(coord.y) + boxSize / 2 + fontSize * 0.07;
            if (small) {
                x += Math.floor((val - 1) % 3) * boxSize;
                y += Math.floor((val - 1) / 3) * boxSize;
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = defaultColor;
            if (val === this.focusedNumber) ctx.fillStyle = this.getTheme().colorHighlightFg;
            ctx.fillText(val.toString(), x, y);
        };
        for (const cell of this.gameBoard.cells){
            if (cell.state === (0, _typesJs.SolvingCellState).PREFILLED) drawNumber(cell.value, cell.coordinate, false, this.getTheme().colorPrefilled);
            if (cell.state === (0, _typesJs.SolvingCellState).SOLVED) drawNumber(cell.value, cell.coordinate, false, this.getTheme().colorSolved);
            if (cell.state === (0, _typesJs.SolvingCellState).SOLVING) {
                for(let i = 1; i <= 9; ++i)if (cell.draftNumbers.has(i)) drawNumber(i, cell.coordinate, true, this.getTheme().colorDraft);
            }
        }
    }
    redrawCursor() {
        const ctx = getCanvas2DContext(this.cursorCanvas);
        // Clear the current drawing at first.
        clearCanvas(this.cursorCanvas);
        const coord = this.cursorCoord;
        if (coord === null) return;
        // Redraw cursor box.
        const x1 = this.getCanvasPosForIdx(coord.x);
        const x2 = this.getCanvasPosForIdx(coord.x + 1);
        const y1 = this.getCanvasPosForIdx(coord.y);
        const y2 = this.getCanvasPosForIdx(coord.y + 1);
        const style = {
            color: this.getTheme().colorHighlightFg,
            width: 3
        };
        drawLine(ctx, x1, y1, x2, y1, style);
        drawLine(ctx, x1, y2, x2, y2, style);
        drawLine(ctx, x1, y1, x1, y2, style);
        drawLine(ctx, x2, y1, x2, y2, style);
    }
}

},{"./types.js":"9hJrD","./theme.js":"2sCQE","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["dPgNG","8Ty8R"], "8Ty8R", "parcelRequire94c2")

//# sourceMappingURL=index.514bd8fd.js.map
