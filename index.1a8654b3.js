let e;var t,r,n,o,i,l,a=globalThis,s={},u={},c=a.parcelRequire94c2;function d(t){let r=e.__externref_table_alloc();return e.__wbindgen_export_2.set(r,t),r}function h(t,r){try{return t.apply(this,r)}catch(r){let t=d(r);e.__wbindgen_exn_store(t)}}null==c&&((c=function(e){if(e in s)return s[e].exports;if(e in u){var t=u[e];delete u[e];var r={id:e,exports:{}};return s[e]=r,t.call(r.exports,r,r.exports),r.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,t){u[e]=t},a.parcelRequire94c2=c),(0,c.register)("27Lyk",function(e,t){Object.defineProperty(e.exports,"register",{get:()=>r,set:e=>r=e,enumerable:!0,configurable:!0});var r,n=new Map;r=function(e,t){for(var r=0;r<t.length-1;r+=2)n.set(t[r],{baseUrl:e,path:t[r+1]})}}),c("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["f7twW","index.1a8654b3.js","8uHta","sudoku_wasm_bg.970e23ea.wasm"]'));const g="undefined"!=typeof TextDecoder?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};"undefined"!=typeof TextDecoder&&g.decode();let f=null;function b(){return(null===f||0===f.byteLength)&&(f=new Uint8Array(e.memory.buffer)),f}function _(e,t){return e>>>=0,g.decode(b().subarray(e,e+t))}let m=0;const w="undefined"!=typeof TextEncoder?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},p="function"==typeof w.encodeInto?function(e,t){return w.encodeInto(e,t)}:function(e,t){let r=w.encode(e);return t.set(r),{read:e.length,written:r.length}};let C=null;function y(){return(null===C||!0===C.buffer.detached||void 0===C.buffer.detached&&C.buffer!==e.memory.buffer)&&(C=new DataView(e.memory.buffer)),C}function v(e,t){let r=t(1*e.length,1)>>>0;return b().set(e,r/1),m=e.length,r}function x(t){var r=v(t,e.__wbindgen_malloc),n=m;let o=e.fast_resolve(r,n,t);if(o[2])throw function(t){let r=e.__wbindgen_export_2.get(t);return e.__externref_table_dealloc(t),r}(o[1]);return o[0]>>>0}async function I(e,t){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if("application/wasm"!=e.headers.get("Content-Type"))console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t);else throw t}let r=await e.arrayBuffer();return await WebAssembly.instantiate(r,t)}{let r=await WebAssembly.instantiate(e,t);return r instanceof WebAssembly.Instance?{instance:r,module:e}:r}}var N={};async function E(t){if(void 0!==e)return e;void 0!==t&&(Object.getPrototypeOf(t)===Object.prototype?{module_or_path:t}=t:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),void 0===t&&(t=new URL(N));let r=function(){let t={};return t.wbg={},t.wbg.__wbg_buffer_61b7ce01341d7f88=function(e){return e.buffer},t.wbg.__wbg_call_500db948e69c7330=function(){return h(function(e,t,r){return e.call(t,r)},arguments)},t.wbg.__wbg_call_b0d8e36992d9900d=function(){return h(function(e,t){return e.call(t)},arguments)},t.wbg.__wbg_crypto_ed58b8e10a292839=function(e){return e.crypto},t.wbg.__wbg_error_7534b8e9a36f1ab4=function(t,r){let n,o;try{n=t,o=r,console.error(_(t,r))}finally{e.__wbindgen_free(n,o,1)}},t.wbg.__wbg_getRandomValues_bcb4912f16000dc4=function(){return h(function(e,t){e.getRandomValues(t)},arguments)},t.wbg.__wbg_msCrypto_0a36e2ec3a343d26=function(e){return e.msCrypto},t.wbg.__wbg_new_3ff5b33b1ce712df=function(e){return new Uint8Array(e)},t.wbg.__wbg_new_8a6f238a6ece86ea=function(){return Error()},t.wbg.__wbg_newnoargs_fd9e4bf8be2bc16d=function(e,t){return Function(_(e,t))},t.wbg.__wbg_newwithbyteoffsetandlength_ba35896968751d91=function(e,t,r){return new Uint8Array(e,t>>>0,r>>>0)},t.wbg.__wbg_newwithlength_34ce8f1051e74449=function(e){return new Uint8Array(e>>>0)},t.wbg.__wbg_node_02999533c4ea02e3=function(e){return e.node},t.wbg.__wbg_now_2c95c9de01293173=function(e){return e.now()},t.wbg.__wbg_performance_7a3ffd0b17f663ad=function(e){return e.performance},t.wbg.__wbg_process_5c1d670bc53614b8=function(e){return e.process},t.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740=function(){return h(function(e,t){e.randomFillSync(t)},arguments)},t.wbg.__wbg_require_79b1e9274cde3c87=function(){return h(function(){return module.require},arguments)},t.wbg.__wbg_set_23d69db4e5c66a6e=function(e,t,r){e.set(t,r>>>0)},t.wbg.__wbg_stack_0ed75d68575b0f3c=function(t,r){let n=function(e,t,r){if(void 0===r){let r=w.encode(e),n=t(r.length,1)>>>0;return b().subarray(n,n+r.length).set(r),m=r.length,n}let n=e.length,o=t(n,1)>>>0,i=b(),l=0;for(;l<n;l++){let t=e.charCodeAt(l);if(t>127)break;i[o+l]=t}if(l!==n){0!==l&&(e=e.slice(l)),o=r(o,n,n=l+3*e.length,1)>>>0;let t=p(e,b().subarray(o+l,o+n));l+=t.written,o=r(o,n,l,1)>>>0}return m=l,o}(r.stack,e.__wbindgen_malloc,e.__wbindgen_realloc),o=m;y().setInt32(t+4,o,!0),y().setInt32(t+0,n,!0)},t.wbg.__wbg_static_accessor_GLOBAL_0be7472e492ad3e3=function(){let e=void 0===a?null:a;return null==e?0:d(e)},t.wbg.__wbg_static_accessor_GLOBAL_THIS_1a6eb482d12c9bfb=function(){let e="undefined"==typeof globalThis?null:globalThis;return null==e?0:d(e)},t.wbg.__wbg_static_accessor_SELF_1dc398a895c82351=function(){let e="undefined"==typeof self?null:self;return null==e?0:d(e)},t.wbg.__wbg_static_accessor_WINDOW_ae1c80c7eea8d64a=function(){let e="undefined"==typeof window?null:window;return null==e?0:d(e)},t.wbg.__wbg_subarray_46adeb9b86949d12=function(e,t,r){return e.subarray(t>>>0,r>>>0)},t.wbg.__wbg_versions_c71aa1626a93e0a1=function(e){return e.versions},t.wbg.__wbindgen_copy_to_typed_array=function(e,t,r){var n;new Uint8Array(r.buffer,r.byteOffset,r.byteLength).set((n=e>>>0,b().subarray(n/1,n/1+t)))},t.wbg.__wbindgen_error_new=function(e,t){return Error(_(e,t))},t.wbg.__wbindgen_init_externref_table=function(){let t=e.__wbindgen_export_2,r=t.grow(4);t.set(0,void 0),t.set(r+0,void 0),t.set(r+1,null),t.set(r+2,!0),t.set(r+3,!1)},t.wbg.__wbindgen_is_function=function(e){return"function"==typeof e},t.wbg.__wbindgen_is_object=function(e){return"object"==typeof e&&null!==e},t.wbg.__wbindgen_is_string=function(e){return"string"==typeof e},t.wbg.__wbindgen_is_undefined=function(e){return void 0===e},t.wbg.__wbindgen_memory=function(){return e.memory},t.wbg.__wbindgen_string_new=function(e,t){return _(e,t)},t.wbg.__wbindgen_throw=function(e,t){throw Error(_(e,t))},t}();("string"==typeof t||"function"==typeof Request&&t instanceof Request||"function"==typeof URL&&t instanceof URL)&&(t=fetch(t));let{instance:n,module:o}=await I(await t,r);return e=n.exports,E.__wbindgen_wasm_module=o,C=null,f=null,e.__wbindgen_start(),e}function B(e,t){if(!Number.isInteger(e)||e<0||e>=9)throw RangeError(`Invalid ${t}: ${e}`)}function R(e){if(!Number.isInteger(e)||e<1||e>9)throw RangeError(`Invalid cell value: ${e}`)}N=new URL("sudoku_wasm_bg.970e23ea.wasm",import.meta.url).toString();class S{bitmap;constructor(e=!1){this.bitmap=Array(10).fill(e)}add(e){return this.bitmap[e]=!0,this}delete(e){let t=this.bitmap[e];return this.bitmap[e]=!1,t}has(e){return this.bitmap[e]}clear(){this.bitmap.fill(!1)}addAll(){this.bitmap.fill(!0)}hasAll(){for(let e=1;e<=9;e++)if(!this.bitmap[e])return!1;return!0}getUnique(){let e=null;for(let t=1;t<=9;t++)if(this.bitmap[t]){if(null!==e)return null;e=t}return e}toString(){let e="";for(let t=1;t<=9;t++)this.bitmap[t]&&(e+=`${t} `);return e+`: ${this.getUnique()}`}}class F{x;y;linearIndex;squareIndex;constructor(e,t){B(e,"x"),B(t,"y"),this.x=e,this.y=t,this.linearIndex=e+9*t,this.squareIndex=Math.floor(e/3)+3*Math.floor(t/3)}static fromLinearIndex(e){return new F(e%9,Math.floor(e/9))}toString(){return`(x: ${this.x}, y: ${this.y}, square: ${this.squareIndex})`}}class D{coordinate;value;constructor(e,t){null!==t&&R(t),this.coordinate=e,this.value=t}toChar(){return null===this.value?".":this.value.toString()}static fromChar(e,t){return"."===t?new D(e,null):new D(e,parseInt(t))}}function L(e,t=!1){if(9!==e.length)throw Error(`Got cell size ${e.length}, want 9`);let r=new S;for(let t of e)if(null!==t.value&&r.has(t.value))return!1;return!t||r.hasAll()}(t=o||(o={})).PREFILLED="Prefilled",t.RESOLVING="Resolving",t.RESOLVED="Resolved";class T extends D{state;draftNumbers;static newPrefilled(e,t){return new T(e,o.PREFILLED,t)}static newResolving(e){return new T(e,o.RESOLVING,null)}constructor(e,t,r){super(e,r),this.state=t,this.draftNumbers=new S(!1)}hasNumber(){switch(this.state){case o.PREFILLED:case o.RESOLVED:return!0;case o.RESOLVING:return!1}}addAllDraftNumber(){for(let e=1;e<=9;e++)this.draftNumbers.add(e)}hasDraftNumber(e){return this.draftNumbers.has(e)}addDraftNumber(e){this.draftNumbers.add(e)}removeDraftNumber(e){this.draftNumbers.delete(e)}fillNumber(e){R(e),this.value=e,this.draftNumbers.clear(),this.state=o.RESOLVED}toString(){return`${this.coordinate} state: ${this.state}, possibleValues: ${this.draftNumbers}`}}class A{cells;constructor(e){for(let t=0;t<81;t++)if(e[t].coordinate.linearIndex!==t)throw Error(`Invalid cell ${e[t]}`);this.cells=e}static createBoardFromString(e){if(81!==(e=e.replace(/\s/g,"")).length)throw Error(`Input char length ${e.length}, want 81`);let t=[];for(let r=0;r<81;r++)t.push(D.fromChar(F.fromLinearIndex(r),e[r]));return new A(t)}printBoard(){let e="";for(let t=0;t<81;t++)e+=this.cells[t].toChar(),t%9==8&&(e+="\n");return e}getCellByCoord(e){return this.cells[e.linearIndex]}getCellsByRow(e){B(e,"rowIndex");let t=[];for(let r=0;r<9;r++)t.push(this.cells[9*e+r]);return t}getCellsByColumn(e){B(e,"columnIndex");let t=[];for(let r=0;r<9;r++)t.push(this.cells[9*r+e]);return t}getCellsBySquare(e){return B(e,"squareIndex"),this.cells.filter(t=>t.coordinate.squareIndex===e)}getCellsByNeighborToCoord(e){return k([this.getCellsByColumn(e.x),this.getCellsByRow(e.y),this.getCellsBySquare(e.squareIndex)])}validate(e){for(let t=0;t<9;t++)if(!L(this.getCellsByRow(t),e)||!L(this.getCellsByColumn(t),e)||!L(this.getCellsBySquare(t),e))return!1;return!0}}function k(e){let t=new Set,r=[];for(let n of e)if(n)for(let e of n)e&&!t.has(e)&&(t.add(e),r.push(e));return r}const P={color_prefilled:"#050505",color_resolved:"#156363",color_draft:"#447862",color_highlight_foreground:"#007896",color_highlight_bg1:z("#dcc1c3",1),color_highlight_bg2:z("#dcd1d1",.5),color_background:"#fefefe"};function z(e,t){let r=parseInt((e=e.replace("#","")).substring(0,2),16),n=parseInt(e.substring(2,4),16),o=parseInt(e.substring(4,6),16);return`rgba(${r}, ${n}, ${o}, ${t})`}function O(e,t,r,n,o,i){e.strokeStyle=i.color,e.lineWidth=i.width?i.width:1,e.beginPath(),e.moveTo(t,r),e.lineTo(n,o),e.stroke()}function $(e){return e.getContext("2d")}function U(e){$(e).clearRect(0,0,e.width,e.height)}(r=i||(i={}))[r.UP=0]="UP",r[r.DOWN=1]="DOWN",r[r.RIGHT=2]="RIGHT",r[r.LEFT=3]="LEFT";class H{config;container;gameBoard;gridCanvas;neighHighlightCanvas;numberHighlightCanvas;numbersCanvas;cursorCanvas;clickCanvas;cursorCoord=null;focusedNumber=null;constructor(e,t,r){this.container=e,this.gameBoard=t,this.updateConfig(r)}getTheme(){return P}getCellSize(){return(this.config.size-10)/9}getCanvasPosForIdx(e){return 5+this.getCellSize()*e}getIdxForCanvasPos(e){for(let t=0;t<9;++t)if(e<this.getCanvasPosForIdx(t+1)&&e>this.getCanvasPosForIdx(t))return t;return null}updateBoard(){this.redrawNumbers(),this.redrawHighlight()}updateConfig(e){for(this.config=e;this.container.firstChild;)this.container.removeChild(this.container.firstChild);this.numberHighlightCanvas=this.createCanvas(1),this.neighHighlightCanvas=this.createCanvas(2),this.gridCanvas=this.createCanvas(3),this.numbersCanvas=this.createCanvas(4),this.cursorCanvas=this.createCanvas(5),this.clickCanvas=this.createCanvas(6),this.redrawGrid(),this.redrawNumbers(),this.clickCanvas.addEventListener("click",e=>{let t=this.clickCanvas.getBoundingClientRect(),r=this.getIdxForCanvasPos(e.clientX-t.left),n=this.getIdxForCanvasPos(e.clientY-t.top);null===r||null===n?this.updateCursor(null):this.updateCursor(new F(r,n))}),this.clickCanvas.addEventListener("dblclick",e=>{let t=this.clickCanvas.getBoundingClientRect(),r=this.getIdxForCanvasPos(e.clientX-t.left),n=this.getIdxForCanvasPos(e.clientY-t.top);if(null===r||null===n)this.updateFocusedNumber(null);else{let e=this.gameBoard.getCellByCoord(new F(r,n));this.updateFocusedNumber(e.value===this.focusedNumber?null:e.value)}})}updateCursor(e){console.log("Set cursor to %s",e),this.cursorCoord=e,this.redrawCursor(),this.redrawHighlight()}moveCursor(e){if(!this.cursorCoord)return;let t=this.cursorCoord.x,r=this.cursorCoord.y;switch(e){case i.UP:r-=1;break;case i.DOWN:r+=1;break;case i.LEFT:t-=1;break;case i.RIGHT:t+=1}t<9&&t>=0&&r<9&&r>=0&&this.updateCursor(new F(t,r))}updateFocusedNumber(e){this.focusedNumber=e,this.redrawHighlight(),this.redrawNumbers()}createCanvas(e){let t=document.createElement("canvas");return t.width=this.config.size,t.height=this.config.size,t.style.position="absolute",t.style.left="0",t.style.top="0",t.style.zIndex=`${e}`,this.container.appendChild(t),t}redrawHighlight(){U(this.neighHighlightCanvas),U(this.numberHighlightCanvas);let e=(e,t,r)=>{let n=this.getCanvasPosForIdx(t.x),o=this.getCanvasPosForIdx(t.y);e.fillStyle=r,e.fillRect(n,o,this.getCellSize(),this.getCellSize())},t=(e,t,r,n)=>{let o=this.getCellSize()/3,i=this.getCanvasPosForIdx(t.x)+Math.floor((r-1)%3)*o,l=this.getCanvasPosForIdx(t.y)+Math.floor((r-1)/3)*o;e.fillStyle=n,e.fillRect(i,l,o,o)},r=this.cursorCoord;if(r&&this.config.highlightCursorNeighbors){let t=$(this.neighHighlightCanvas);for(let n of this.gameBoard.getCellsByNeighborToCoord(r))e(t,n.coordinate,this.getTheme().color_highlight_bg1)}if(null!==this.focusedNumber&&(this.config.highlightNumberNeighbors||this.config.highlightNumber)){let r=$(this.numberHighlightCanvas),n=this.gameBoard.cells.filter(e=>e.value===this.focusedNumber),o=n.slice();for(let t of(this.config.highlightNumberNeighbors&&(o=k(n.map(e=>this.gameBoard.getCellsByNeighborToCoord(e.coordinate)))),o))e(r,t.coordinate,this.getTheme().color_highlight_bg2);for(let e of this.gameBoard.cells)e.hasDraftNumber(this.focusedNumber)&&t(r,e.coordinate,this.focusedNumber,this.getTheme().color_highlight_bg2)}}redrawGrid(){let e=this.gridCanvas.getContext("2d");if(!e){console.error("Context not available");return}let t=this.getCanvasPosForIdx(0),r=this.getCanvasPosForIdx(9),n={color:this.getTheme().color_prefilled},o={color:this.getTheme().color_prefilled,width:3};for(let i=0;i<=9;i++){let l=this.getCanvasPosForIdx(i);O(e,t,l,r,l,i%3?n:o),O(e,l,t,l,r,i%3?n:o)}}redrawNumbers(){if(!this.gameBoard)return;let e=this.numbersCanvas.getContext("2d");if(!e){console.error("Context not available");return}U(this.numbersCanvas);let t=(t,r,n,o)=>{let i=this.getCellSize()/(n?3:1),l=.8*i,a=this.getCanvasPosForIdx(r.x)+i/2,s=this.getCanvasPosForIdx(r.y)+i/2+.07*l;n&&(a+=Math.floor((t-1)%3)*i,s+=Math.floor((t-1)/3)*i),e.textAlign="center",e.textBaseline="middle",e.font=`${l}px monospace`,e.fillStyle=o,e.fillText(t.toString(),a,s)};for(let e of this.gameBoard.cells)if(e.state===o.PREFILLED&&t(e.value,e.coordinate,!1,this.getTheme().color_prefilled),e.state===o.RESOLVED&&t(e.value,e.coordinate,!1,this.getTheme().color_resolved),e.state===o.RESOLVING)for(let r=1;r<=9;++r)e.draftNumbers.has(r)&&t(r,e.coordinate,!0,this.getTheme().color_draft)}redrawCursor(){let e=$(this.cursorCanvas);U(this.cursorCanvas);let t=this.cursorCoord;if(null===t)return;let r=this.getCanvasPosForIdx(t.x),n=this.getCanvasPosForIdx(t.x+1),o=this.getCanvasPosForIdx(t.y),i=this.getCanvasPosForIdx(t.y+1),l={color:this.getTheme().color_highlight_foreground,width:3};O(e,r,o,n,o,l),O(e,r,i,n,i,l),O(e,r,o,r,i,l),O(e,n,o,n,i,l)}}class M extends A{static createFromBoard(e){let t=[];for(let r of e.cells)null===r.value?t.push(T.newResolving(r.coordinate)):t.push(T.newPrefilled(r.coordinate,r.value));return new M(t)}getEmptyCellsCount(){return this.cells.filter(e=>e.state===o.RESOLVING).length}takeAction(e){console.log(`${e.coordinate.toString()}: ${e.type} value ${e.value}, reason: ${e.reasonString}`);let t=this.getCellByCoord(e.coordinate);switch(e.type){case l.REMOVE_DRAFT_NUMBER:t.removeDraftNumber(e.value);break;case l.FILL_IN_NUMBER:t.fillNumber(e.value)}}takeActions(e){for(let t of e)this.takeAction(t)}}(n=l||(l={})).REMOVE_DRAFT_NUMBER="remove draft number",n.FILL_IN_NUMBER="fill in number";class q{answerBoard;puzzleBoard;startTime;endTime=null;mistakes=0;constructor(e,t){this.answerBoard=e,this.puzzleBoard=M.createFromBoard(t),this.startTime=performance.now()}fillInNumber(e,t){let r=this.puzzleBoard.cells[e.linearIndex];if(r.hasNumber()){console.log("%s already have number",e);return}if(this.answerBoard.cells[e.linearIndex].value!==t){alert("Not correct :)"),this.mistakes++;return}r.fillNumber(t),this.isAllCorrect()&&(this.endTime=performance.now(),alert("Congratulations!!!"))}toggleDraftNumber(e,t){let r=this.puzzleBoard.cells[e.linearIndex];if(r.hasNumber()){console.log("%s already have number",e);return}r.hasDraftNumber(t)?r.removeDraftNumber(t):r.addDraftNumber(t)}recalculateDraftNumbers(){for(let e of this.puzzleBoard.cells)e.hasNumber()||e.addAllDraftNumber();let e=function(e){let t=[],r=function(e,r,n){e.state===o.RESOLVING&&e.draftNumbers.has(r)&&t.push({coordinate:e.coordinate,type:l.REMOVE_DRAFT_NUMBER,value:r,reasonString:`Conflict with ${n.toString()}`})};for(let t=0;t<81;t++){let n=F.fromLinearIndex(t),i=e.cells[t];if(i.state===o.RESOLVING)continue;if(null===i.value)throw Error("Invalid state");let l=i.value;for(let t of e.getCellsByColumn(n.x))r(t,l,i);for(let t of e.getCellsByRow(n.y))r(t,l,i);for(let t of e.getCellsBySquare(n.squareIndex))r(t,l,i)}return t}(this.puzzleBoard);this.puzzleBoard.takeActions(e)}getEmptyCellsCount(){let e=0;for(let t of this.puzzleBoard.cells)!t.hasNumber()&&e++;return e}getElapsedSeconds(){let e=performance.now();return null!==this.endTime&&(e=this.endTime),Math.round((e-this.startTime)/1e3)}isAllCorrect(){for(let e=0;e<81;++e)if(this.puzzleBoard.cells[e].value!=this.answerBoard.cells[e].value)return!1;return!0}}!async function(){console.log("called");try{await E().then(()=>{console.log("loaded");let t=new Uint8Array([4,0,0,0,3,0,0,0,0,0,0,0,6,0,0,8,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,5,0,0,9,0,0,8,0,0,0,0,6,0,0,0,7,0,2,0,0,0,0,0,0,0,0,1,0,2,7,0,0,5,0,3,0,0,0,0,4,0,9,0,0,0,0,0,0,0,0]);console.log(x(t)),console.log(t),e.init_panic_hook(),function(){var t,r;let n=document.getElementById("welcome");if(null===n){console.error("failed to load welcome screen");return}let o=document.getElementById("app-container"),l=document.getElementById("app");l.style.height=`${o.clientHeight}px`,console.log("setting height to %d",o.clientHeight);let a=document.getElementById("board");if(null===a){console.log("Failed to find the dom node");return}let s=new Uint8Array(81);t=v(s,e.__wbindgen_malloc),r=m,e.generate(60,t,r,s),n.style.opacity="0";let u=new Uint8Array(s);x(u),document.body.style.backgroundColor=P.color_background;let c=A.createBoardFromString(u.join("").replaceAll("0",".")),d=new q(c,A.createBoardFromString(s.join("").replaceAll("0","."))),h=new H(a,d.puzzleBoard,{size:a.clientWidth,highlightCursorNeighbors:!0,highlightNumber:!0,highlightNumberNeighbors:!0});function g(e=!1){console.log("called"),document.getElementById("board-banner");let t=document.getElementById("value-timer"),r=document.getElementById("value-mistakes"),n=document.getElementById("value-remaining");t.textContent=`${function(e){let t=Math.floor(e/60),r=Math.floor(e%60),n=String(t).padStart(2,"0"),o=String(r).padStart(2,"0");return`${n}:${o}`}(d.getElapsedSeconds())}`,r.textContent=`${d.mistakes}`,n.textContent=`${d.getEmptyCellsCount()}`,e||setTimeout(g,1e3)}l.style.opacity="1",g(),window.addEventListener("keydown",e=>{let t=null,r=null;switch(console.log(e),e.code){case"ArrowUp":t=i.UP;break;case"ArrowDown":t=i.DOWN;break;case"ArrowLeft":t=i.LEFT;break;case"ArrowRight":t=i.RIGHT;break;case"Digit1":case"Digit2":case"Digit3":case"Digit4":case"Digit5":case"Digit6":case"Digit7":case"Digit8":case"Digit9":r=parseInt(e.code.charAt(5));break;case"KeyD":d.recalculateDraftNumbers(),h.updateBoard()}null!==t&&(h.moveCursor(t),e.preventDefault()),null!==r&&null!==h.cursorCoord&&(console.log("hit %d",r),e.shiftKey?d.fillInNumber(h.cursorCoord,r):d.toggleDraftNumber(h.cursorCoord,r),h.updateBoard(),g(!0))})}()})}catch(e){console.error("Error initializing WASM module:",e)}}();
//# sourceMappingURL=index.1a8654b3.js.map
