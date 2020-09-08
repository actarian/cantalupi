/**
 * @license cantalupi v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(require('rxcomp'),require('rxcomp-form'),require('rxjs/operators'),require('rxjs')):typeof define==='function'&&define.amd?define(['rxcomp','rxcomp-form','rxjs/operators','rxjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.rxcomp,g.rxcomp.form,g.rxjs.operators,g.rxjs));}(this,(function(rxcomp, rxcompForm, operators, rxjs){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}var EDGE = /(edge)/i.test(navigator.userAgent);
var TRIDENT = /(msie|trident)/i.test(navigator.userAgent);
var BLINK = !!(window.chrome || hasV8BreakIterator) && typeof CSS !== 'undefined' && !EDGE && !TRIDENT;
var WEBKIT = /AppleWebKit/i.test(navigator.userAgent) && !BLINK && !EDGE && !TRIDENT;
var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
var FIREFOX = /(firefox|minefield)/i.test(navigator.userAgent);
var ANDROID = /android/i.test(navigator.userAgent) && !TRIDENT;
var SAFARI = /safari/i.test(navigator.userAgent) && WEBKIT;
var mediaQueriesForWebkitCompatibility = new Set();
var mediaQueryStyleNode;
var MediaMatcher = /*#__PURE__*/function () {
  function MediaMatcher() {}

  MediaMatcher.matchMedia = function matchMedia(query) {
    if (WEBKIT) {
      this.createEmptyStyleRule(query);
    }

    return this._matchMedia(query);
  };

  MediaMatcher.createEmptyStyleRule = function createEmptyStyleRule(query) {
    if (mediaQueriesForWebkitCompatibility.has(query)) {
      return;
    }

    try {
      if (!mediaQueryStyleNode) {
        mediaQueryStyleNode = document.createElement('style');
        mediaQueryStyleNode.setAttribute('type', 'text/css');

        if (document.head) {
          document.head.appendChild(mediaQueryStyleNode);
        }
      }

      if (mediaQueryStyleNode.sheet) {
        mediaQueryStyleNode.sheet.insertRule("@media " + query + " {.fx-query-test{ }}", 0);
        mediaQueriesForWebkitCompatibility.add(query);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return MediaMatcher;
}();

function noopMatchMedia(query) {
  return {
    matches: query === 'all' || query === '',
    media: query,
    addListener: function addListener() {},
    removeListener: function removeListener() {}
  };
}

MediaMatcher._matchMedia = window.matchMedia ? window.matchMedia.bind(window) : noopMatchMedia;var BreakpointService = /*#__PURE__*/function () {
  function BreakpointService() {}

  BreakpointService.observe$ = function observe$(value) {
    var _this = this;

    var queries = Object.assign({}, value); // this.splitQueries(coerceArray(value));

    var queries$_ = [];
    Object.keys(queries).forEach(function (key) {
      var query = queries[key];
      var group = query.split('and').map(function (query) {
        return query.trim();
      });
      group.forEach(function (query) {
        return queries$_.push(_this.registerQuery$_(query).query$);
      });
      queries[key] = {
        query: query,
        group: group
      };
    }); // let queries$_ = Object.keys(queries).map(key => this.registerQuery$_(queries[key]).query$);

    console.log(queries$_);
    queries$_ = rxjs.combineLatest.apply(void 0, queries$_);
    var queries$ = rxjs.concat(queries$_.pipe(operators.take(1)), queries$_.pipe(operators.skip(1), operators.debounceTime(0)));
    return queries$.pipe(operators.map(function (breakpoints) {
      var response = {};
      breakpoints.forEach(function (b) {
        Object.keys(queries).forEach(function (key) {
          var query = queries[key];
          var match = query.group.reduce(function (p, c) {
            return p && (b.query !== c || b.matches);
          }, true);
          response[key] = match;
        });
      });
      /*
      const response = {
      	matches: false,
      	breakpoints: {},
      };
      breakpoints.forEach((state) => {
      	response.matches = response.matches || state.matches;
      	response.breakpoints[state.query] = state.matches;
      });
      console.log(breakpoints, response, queries);
      */

      return response;
    }));
  }
  /*
  static isMatched$(value) {
  	const queries = this.splitQueries(coerceArray(value));
  	return queries.some(mediaQuery => this.registerQuery$_(mediaQuery).mediaQueryList.matches);
  }
  */
  ;

  BreakpointService.has = function has(query) {
    return this.queries_[query] !== undefined;
  };

  BreakpointService.get = function get(query) {
    return this.queries_[query];
  };

  BreakpointService.set = function set(query, value) {
    return this.queries_[query] = value;
  };

  BreakpointService.registerQuery$_ = function registerQuery$_(key) {
    if (this.has(key)) {
      return this.get(key);
    }

    var mediaQueryList = MediaMatcher.matchMedia(key);
    console.log('mediaQueryList', mediaQueryList);
    var query$ = new rxjs.Observable(function (observer) {
      var handler = function handler(e) {
        return observer.next(e);
      };

      mediaQueryList.addListener(handler);
      return function () {
        mediaQueryList.removeListener(handler);
      };
    }).pipe(operators.startWith(mediaQueryList), operators.map(function (nextMediaQueryList) {
      return {
        query: key,
        matches: nextMediaQueryList.matches
      };
    }));
    var output = {
      query$: query$,
      mediaQueryList: mediaQueryList
    };
    this.set(key, output);
    return output;
  };

  BreakpointService.splitQueries = function splitQueries(queries) {
    return queries.map(function (query) {
      return query.split(',');
    }).reduce(function (a1, a2) {
      return a1.concat(a2);
    }).map(function (query) {
      return query.trim();
    });
  };

  return BreakpointService;
}();

_defineProperty(BreakpointService, "queries_", {});var SessionStorageService = /*#__PURE__*/function () {
  function SessionStorageService() {}

  SessionStorageService.delete = function _delete(name) {
    if (this.isSessionStorageSupported()) {
      window.sessionStorage.removeItem(name);
    }
  };

  SessionStorageService.exist = function exist(name) {
    if (this.isSessionStorageSupported()) {
      return window.sessionStorage[name] !== undefined;
    }
  };

  SessionStorageService.get = function get(name) {
    var value = null;

    if (this.isSessionStorageSupported() && window.sessionStorage[name] !== undefined) {
      try {
        value = JSON.parse(window.sessionStorage[name]);
      } catch (e) {
        console.log('SessionStorageService.get.error parsing', name, e);
      }
    }

    return value;
  };

  SessionStorageService.set = function set(name, value) {
    if (this.isSessionStorageSupported()) {
      try {
        var cache = [];
        var json = JSON.stringify(value, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }

            cache.push(value);
          }

          return value;
        });
        window.sessionStorage.setItem(name, json);
      } catch (e) {
        console.log('SessionStorageService.set.error serializing', name, value, e);
      }
    }
  };

  SessionStorageService.isSessionStorageSupported = function isSessionStorageSupported() {
    if (this.supported) {
      return true;
    }

    var supported = false;

    try {
      supported = 'sessionStorage' in window && window.sessionStorage !== null;

      if (supported) {
        window.sessionStorage.setItem('test', '1');
        window.sessionStorage.removeItem('test');
      } else {
        supported = false;
      }
    } catch (e) {
      supported = false;
    }

    this.supported = supported;
    return supported;
  };

  return SessionStorageService;
}();var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.remove('hidden');
    var showCover = SessionStorageService.get('showCover');
    this.showCover = !showCover;
    SessionStorageService.set('showCover', true);
    BreakpointService.observe$({
      isMobile: '(max-width: 767px)'
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (results) {
      console.log('AppComponent.BreakpointService.results', results);
      _this.isMobile = results.isMobile;

      _this.pushChanges();
    });
  };

  _proto.onSkipCover = function onSkipCover(event) {
    console.log('AppComponent.onSkipCover');
    this.showCover = false;
    this.pushChanges();
  };

  _proto.onMenuToggle = function onMenuToggle(opened) {
    console.log('AppComponent.onMenuToggle', opened);
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var CardSerieComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CardSerieComponent, _Component);

  function CardSerieComponent() {
    var _this;

    _this = _Component.call(this) || this;
    _this.index = 0;
    return _this;
  }

  var _proto = CardSerieComponent.prototype;

  _proto.onInit = function onInit() {
    this.index = 0;
  };

  _proto.onOver = function onOver(index) {
    this.index = index;
    this.pushChanges();
  };

  return CardSerieComponent;
}(rxcomp.Component);
CardSerieComponent.meta = {
  selector: '[card-serie]'
};var CardServiceComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CardServiceComponent, _Component);

  function CardServiceComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = CardServiceComponent.prototype;

  _proto.onTween = function onTween() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var title = node.querySelector('.title');
    this.title = title.innerHTML;
  };

  _proto.onChange = function onChange(index) {
    /*
    const { node } = getContext(this);
    this.items = Array.prototype.slice.call(node.querySelectorAll('.slider__slide')).map((node, index) => {
    	const image = node.querySelector('img');
    	const title = image.getAttribute('title') || image.getAttribute('alt');
    	const url = image.getAttribute('lazy');
    	return { node, url, title, id: index + 10000001 };
    });
    this.title = this.items[index].title;
    this.index = index;
    */
  };

  return CardServiceComponent;
}(rxcomp.Component);
CardServiceComponent.meta = {
  selector: '[card-service]'
};var ClickOutsideDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ClickOutsideDirective, _Directive);

  function ClickOutsideDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ClickOutsideDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.initialFocus = false;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node,
        parentInstance = _getContext.parentInstance,
        selector = _getContext.selector;

    var event$ = this.event$ = rxjs.fromEvent(document, 'click').pipe(operators.filter(function (event) {
      var target = event.target; // console.log('ClickOutsideDirective.onClick', this.element.nativeElement, target, this.element.nativeElement.contains(target));
      // const documentContained: boolean = Boolean(document.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINED_BY);
      // console.log(target, documentContained);

      var clickedInside = node.contains(target) || !document.contains(target);

      if (!clickedInside) {
        if (_this.initialFocus) {
          _this.initialFocus = false;
          return true;
        }
      } else {
        _this.initialFocus = true;
      }
    }), operators.shareReplay(1));
    var expression = node.getAttribute("(clickOutside)");

    if (expression) {
      var outputFunction = module.makeFunction(expression, ['$event']);
      event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        module.resolve(outputFunction, parentInstance, event);
      });
    } else {
      parentInstance.clickOutside$ = event$;
    }
  };

  return ClickOutsideDirective;
}(rxcomp.Directive);
ClickOutsideDirective.meta = {
  selector: "[(clickOutside)]"
};var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}var splitting = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	 module.exports = factory() ;
}(commonjsGlobal, (function () {
var root = document;
var createText = root.createTextNode.bind(root);

/**
 * # setProperty
 * Apply a CSS var
 * @param el{HTMLElement} 
 * @param varName {string} 
 * @param value {string|number}  
 */
function setProperty(el, varName, value) {
    el.style.setProperty(varName, value);
} 

/**
 * 
 * @param {Node} el 
 * @param {Node} child 
 */
function appendChild(el, child) {
  return el.appendChild(child);
}

function createElement(parent, key, text, whitespace) {
  var el = root.createElement('span');
  key && (el.className = key); 
  if (text) { 
      !whitespace && el.setAttribute("data-" + key, text);
      el.textContent = text; 
  }
  return (parent && appendChild(parent, el)) || el;
}

function getData(el, key) {
  return el.getAttribute("data-" + key)
}

/**
 * 
 * @param e {import('../types').Target} 
 * @param parent {HTMLElement}
 * @returns {HTMLElement[]}
 */
function $(e, parent) {
    return !e || e.length == 0
        ? // null or empty string returns empty array
          []
        : e.nodeName
            ? // a single element is wrapped in an array
              [e]
            : // selector and NodeList are converted to Element[]
              [].slice.call(e[0].nodeName ? e : (parent || root).querySelectorAll(e));
}

/**
 * Creates and fills an array with the value provided
 * @template {T}
 * @param {number} len
 * @param {() => T} valueProvider
 * @return {T}
 */
function Array2D(len) {
    var a = [];
    for (; len--; ) {
        a[len] = [];
    }
    return a;
}

function each(items, fn) {
    items && items.some(fn);
}

function selectFrom(obj) {
    return function (key) {
        return obj[key];
    }
}

/**
 * # Splitting.index
 * Index split elements and add them to a Splitting instance.
 *
 * @param element {HTMLElement}
 * @param key {string}
 * @param items {HTMLElement[] | HTMLElement[][]}
 */
function index(element, key, items) {
    var prefix = '--' + key;
    var cssVar = prefix + "-index";

    each(items, function (items, i) {
        if (Array.isArray(items)) {
            each(items, function(item) {
                setProperty(item, cssVar, i);
            });
        } else {
            setProperty(items, cssVar, i);
        }
    });

    setProperty(element, prefix + "-total", items.length);
}

/**
 * @type {Record<string, import('./types').ISplittingPlugin>}
 */
var plugins = {};

/**
 * @param by {string}
 * @param parent {string}
 * @param deps {string[]}
 * @return {string[]}
 */
function resolvePlugins(by, parent, deps) {
    // skip if already visited this dependency
    var index = deps.indexOf(by);
    if (index == -1) {
        // if new to dependency array, add to the beginning
        deps.unshift(by);

        // recursively call this function for all dependencies
        each(plugins[by].depends, function(p) {
            resolvePlugins(p, by, deps);
        });
    } else {
        // if this dependency was added already move to the left of
        // the parent dependency so it gets loaded in order
        var indexOfParent = deps.indexOf(parent);
        deps.splice(index, 1);
        deps.splice(indexOfParent, 0, by);
    }
    return deps;
}

/**
 * Internal utility for creating plugins... essentially to reduce
 * the size of the library
 * @param {string} by 
 * @param {string} key 
 * @param {string[]} depends 
 * @param {Function} split 
 * @returns {import('./types').ISplittingPlugin}
 */
function createPlugin(by, depends, key, split) {
    return {
        by: by,
        depends: depends,
        key: key,
        split: split
    }
}

/**
 *
 * @param by {string}
 * @returns {import('./types').ISplittingPlugin[]}
 */
function resolve(by) {
    return resolvePlugins(by, 0, []).map(selectFrom(plugins));
}

/**
 * Adds a new plugin to splitting
 * @param opts {import('./types').ISplittingPlugin}
 */
function add(opts) {
    plugins[opts.by] = opts;
}

/**
 * # Splitting.split
 * Split an element's textContent into individual elements
 * @param el {Node} Element to split
 * @param key {string}
 * @param splitOn {string}
 * @param includeSpace {boolean}
 * @returns {HTMLElement[]}
 */
function splitText(el, key, splitOn, includePrevious, preserveWhitespace) {
    // Combine any strange text nodes or empty whitespace.
    el.normalize();

    // Use fragment to prevent unnecessary DOM thrashing.
    var elements = [];
    var F = document.createDocumentFragment();

    if (includePrevious) {
        elements.push(el.previousSibling);
    }

    var allElements = [];
    $(el.childNodes).some(function(next) {
        if (next.tagName && !next.hasChildNodes()) {
            // keep elements without child nodes (no text and no children)
            allElements.push(next);
            return;
        }
        // Recursively run through child nodes
        if (next.childNodes && next.childNodes.length) {
            allElements.push(next);
            elements.push.apply(elements, splitText(next, key, splitOn, includePrevious, preserveWhitespace));
            return;
        }

        // Get the text to split, trimming out the whitespace
        /** @type {string} */
        var wholeText = next.wholeText || '';
        var contents = wholeText.trim();

        // If there's no text left after trimming whitespace, continue the loop
        if (contents.length) {
            // insert leading space if there was one
            if (wholeText[0] === ' ') {
                allElements.push(createText(' '));
            }
            // Concatenate the split text children back into the full array
            each(contents.split(splitOn), function(splitText, i) {
                if (i && preserveWhitespace) {
                    allElements.push(createElement(F, "whitespace", " ", preserveWhitespace));
                }
                var splitEl = createElement(F, key, splitText);
                elements.push(splitEl);
                allElements.push(splitEl);
            }); 
            // insert trailing space if there was one
            if (wholeText[wholeText.length - 1] === ' ') {
                allElements.push(createText(' '));
            }
        }
    });

    each(allElements, function(el) {
        appendChild(F, el);
    });

    // Clear out the existing element
    el.innerHTML = "";
    appendChild(el, F);
    return elements;
}

/** an empty value */
var _ = 0;

function copy(dest, src) {
    for (var k in src) {
        dest[k] = src[k];
    }
    return dest;
}

var WORDS = 'words';

var wordPlugin = createPlugin(
    /*by: */ WORDS,
    /*depends: */ _,
    /*key: */ 'word', 
    /*split: */ function(el) {
        return splitText(el, 'word', /\s+/, 0, 1)
    }
);

var CHARS = "chars";

var charPlugin = createPlugin(
    /*by: */ CHARS,
    /*depends: */ [WORDS],
    /*key: */ "char", 
    /*split: */ function(el, options, ctx) {
        var results = [];

        each(ctx[WORDS], function(word, i) {
            results.push.apply(results, splitText(word, "char", "", options.whitespace && i));
        });

        return results;
    }
);

/**
 * # Splitting
 * 
 * @param opts {import('./types').ISplittingOptions} 
 */
function Splitting (opts) {
  opts = opts || {};
  var key = opts.key;

  return $(opts.target || '[data-splitting]').map(function(el) {
    var ctx = el['🍌'];  
    if (!opts.force && ctx) {
      return ctx;
    }

    ctx = el['🍌'] = { el: el };
    var items = resolve(opts.by || getData(el, 'splitting') || CHARS);
    var opts2 = copy({}, opts);
    each(items, function(plugin) {
      if (plugin.split) {
        var pluginBy = plugin.by;
        var key2 = (key ? '-' + key : '') + plugin.key;
        var results = plugin.split(el, opts2, ctx);
        key2 && index(el, key2, results);
        ctx[pluginBy] = results;
        el.classList.add(pluginBy);
      } 
    });

    el.classList.add('splitting');
    return ctx;
  })
}

/**
 * # Splitting.html
 * 
 * @param opts {import('./types').ISplittingOptions}
 */
function html(opts) {
  opts = opts || {};
  var parent = opts.target =  createElement();
  parent.innerHTML = opts.content;
  Splitting(opts);
  return parent.outerHTML
}

Splitting.html = html;
Splitting.add = add;

function detectGrid(el, options, side) {
    var items = $(options.matching || el.children, el);
    var c = {};

    each(items, function(w) {
        var val = Math.round(w[side]);
        (c[val] || (c[val] = [])).push(w);
    });

    return Object.keys(c).map(Number).sort(byNumber).map(selectFrom(c));
}

function byNumber(a, b) {
    return a - b;
}

var linePlugin = createPlugin(
    /*by: */ 'lines',
    /*depends: */ [WORDS],
    /*key: */ 'line',
    /*split: */ function(el, options, ctx) {
      return detectGrid(el, { matching: ctx[WORDS] }, 'offsetTop')
    }
);

var itemPlugin = createPlugin(
    /*by: */ 'items',
    /*depends: */ _,
    /*key: */ 'item', 
    /*split: */ function(el, options) {
        return $(options.matching || el.children, el)
    }
);

var rowPlugin = createPlugin(
    /*by: */ 'rows',
    /*depends: */ _,
    /*key: */ 'row', 
    /*split: */ function(el, options) {
        return detectGrid(el, options, "offsetTop");
    }
);

var columnPlugin = createPlugin(
    /*by: */ 'cols',
    /*depends: */ _,
    /*key: */ "col", 
    /*split: */ function(el, options) {
        return detectGrid(el, options, "offsetLeft");
    }
);

var gridPlugin = createPlugin(
    /*by: */ 'grid',
    /*depends: */ ['rows', 'cols']
);

var LAYOUT = "layout";

var layoutPlugin = createPlugin(
    /*by: */ LAYOUT,
    /*depends: */ _,
    /*key: */ _,
    /*split: */ function(el, opts) {
        // detect and set options
        var rows =  opts.rows = +(opts.rows || getData(el, 'rows') || 1);
        var columns = opts.columns = +(opts.columns || getData(el, 'columns') || 1);

        // Seek out the first <img> if the value is true 
        opts.image = opts.image || getData(el, 'image') || el.currentSrc || el.src;
        if (opts.image) {
            var img = $("img", el)[0];
            opts.image = img && (img.currentSrc || img.src);
        }

        // add optional image to background
        if (opts.image) {
            setProperty(el, "background-image", "url(" + opts.image + ")");
        }

        var totalCells = rows * columns;
        var elements = [];

        var container = createElement(_, "cell-grid");
        while (totalCells--) {
            // Create a span
            var cell = createElement(container, "cell");
            createElement(cell, "cell-inner");
            elements.push(cell);
        }

        // Append elements back into the parent
        appendChild(el, container);

        return elements;
    }
);

var cellRowPlugin = createPlugin(
    /*by: */ "cellRows",
    /*depends: */ [LAYOUT],
    /*key: */ "row",
    /*split: */ function(el, opts, ctx) {
        var rowCount = opts.rows;
        var result = Array2D(rowCount);

        each(ctx[LAYOUT], function(cell, i, src) {
            result[Math.floor(i / (src.length / rowCount))].push(cell);
        });

        return result;
    }
);

var cellColumnPlugin = createPlugin(
    /*by: */ "cellColumns",
    /*depends: */ [LAYOUT],
    /*key: */ "col",
    /*split: */ function(el, opts, ctx) {
        var columnCount = opts.columns;
        var result = Array2D(columnCount);

        each(ctx[LAYOUT], function(cell, i) {
            result[i % columnCount].push(cell);
        });

        return result;
    }
);

var cellPlugin = createPlugin(
    /*by: */ "cells",
    /*depends: */ ['cellRows', 'cellColumns'],
    /*key: */ "cell", 
    /*split: */ function(el, opt, ctx) { 
        // re-index the layout as the cells
        return ctx[LAYOUT];
    }
);

// install plugins
// word/char plugins
add(wordPlugin);
add(charPlugin);
add(linePlugin);
// grid plugins
add(itemPlugin);
add(rowPlugin);
add(columnPlugin);
add(gridPlugin);
// cell-layout plugins
add(layoutPlugin);
add(cellRowPlugin);
add(cellColumnPlugin);
add(cellPlugin);

return Splitting;

})));
});var CoverVideoComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CoverVideoComponent, _Component);

  function CoverVideoComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = CoverVideoComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var brand = node.querySelector('.brand');
    gsap.to(brand, 0.4, {
      opacity: 1,
      onComplete: function onComplete() {
        var skip = node.querySelector('.btn--skip');
        gsap.to(skip, 0.4, {
          opacity: 1,
          delay: 2,
          onComplete: function onComplete() {
            var i = 0;
            var repeat = 2;
            var video = node.querySelector('video');

            var onEnded = function onEnded() {
              console.log('onEnded');
              i++;

              if (i < repeat) {
                video.play();
              } else {
                video.removeEventListener('ended', onEnded);
                setTimeout(function () {
                  _this.skip.next();
                }, 2000);
              }
            };

            video.addEventListener('ended', onEnded);
            video.play();
          }
        });
      }
    });
    var title = node.querySelector('.title');
    splitting({
      target: [title]
    });
  };

  _proto.onSkip = function onSkip(event) {
    this.skip.next();
  };

  return CoverVideoComponent;
}(rxcomp.Component);
CoverVideoComponent.meta = {
  selector: '[cover-video]',
  outputs: ['skip']
};var CoverComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CoverComponent, _Component);

  function CoverComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = CoverComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var brand = node.querySelector('.brand');
    gsap.to(brand, 0.4, {
      opacity: 1,
      onComplete: function onComplete() {
        var skip = node.querySelector('.btn--skip');
        gsap.to(skip, 0.4, {
          opacity: 1,
          delay: 3,
          onComplete: function onComplete() {
            var images = Array.prototype.slice.call(node.querySelectorAll('.background img'));
            gsap.to(images, {
              opacity: 1,
              delay: 2,
              duration: 0.6,
              stagger: {
                each: 3,
                ease: Power0.easeNone
              },
              onComplete: function onComplete() {
                console.log('complete!');
                setTimeout(function () {
                  _this.skip.next();
                }, 4400);
              }
            });
            gsap.to(images, {
              scale: 1.05,
              delay: 2,
              duration: 4,
              stagger: {
                each: 3,
                ease: Power0.easeNone
              }
            });
          }
        });
      }
    });
    var title = node.querySelector('.title');
    splitting({
      target: [title]
    });
  };

  _proto.onSkip = function onSkip(event) {
    this.skip.next();
  };

  return CoverComponent;
}(rxcomp.Component);
CoverComponent.meta = {
  selector: '[cover]',
  outputs: ['skip']
};var LocaleType = {
  DateFormats: 'dateFormats',
  TimeFormats: 'timeFormats',
  DayPeriods: 'dayPeriods',
  Days: 'days',
  Months: 'months',
  Eras: 'eras',
  NumberSymbols: 'numberSymbols'
};
var LocaleStyle = {
  // For `en-US`, 'M/d/yy, h:mm a'` (Example: `6/15/15, 9:03 AM`)
  Short: 'short',
  // For `en-US`, `'MMM d, y, h:mm:ss a'` (Example: `Jun 15, 2015, 9:03:01 AM`)
  Medium: 'medium',
  // For `en-US`, `'MMMM d, y, h:mm:ss a z'` (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
  Long: 'long',
  // For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'` (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
  Full: 'full'
};
var LocaleLength = {
  // 1 character for `en-US`. For example: 'S'
  Narrow: 'narrow',
  // 2 characters for `en-US`, For example: 'Su'
  Short: 'short',
  // 3 characters for `en-US`. For example: 'Sun'
  Abbreviated: 'abbreviated',
  // Full length for `en-US`. For example: 'Sunday'
  Wide: 'wide'
};
var LocaleDay = {
  Sunday: 'sunday',
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday'
};
var LocaleMonth = {
  January: 'january',
  February: 'february',
  March: 'march',
  April: 'april',
  May: 'may',
  June: 'june',
  July: 'july',
  August: 'august',
  September: 'september',
  October: 'october',
  November: 'november',
  December: 'december'
};
var LocaleDayPeriod = {
  AM: 'am',
  PM: 'pm'
};
var LocaleEra = {
  BC: 'bc',
  AD: 'ad'
};
var LocaleNumberSymbol = {
  // Decimal separator. For `en-US`, the dot character. Example : 2,345`.`67
  Decimal: 'decimal',
  // Grouping separator, typically for thousands. For `en-US`, the comma character. Example: 2`,`345.67
  Group: 'group',
  // List-item separator. Example: 'one, two, and three'
  List: 'list',
  // Sign for percentage (out of 100). Example: 23.4%
  PercentSign: 'percentSign',
  // Sign for positive numbers. Example: +23
  PlusSign: 'plusSign',
  // Sign for negative numbers. Example: -23
  MinusSign: 'minusSign',
  // Computer notation for exponential value (n times a power of 10). Example: 1.2E3
  Exponential: 'exponential',
  // Human-readable format of exponential. Example: 1.2x103
  SuperscriptingExponent: 'superscriptingExponent',
  // Sign for permille (out of 1000). Example: 23.4‰
  PerMille: 'perMille',
  // Infinity, can be used with plus and minus. Example: ∞, +∞, -∞
  Infinity: 'infinity',
  // Not a number. Example: NaN
  NaN: 'nan',
  // Symbol used between time units. Example: 10:52
  TimeSeparator: 'timeSeparator',
  // Decimal separator for currency values (fallback to `Decimal`). Example: $2,345.67
  CurrencyDecimal: 'currencyDecimal',
  // Group separator for currency values (fallback to `Group`). Example: $2,345.67
  CurrencyGroup: 'currencyGroup'
};
var locale_it = {
  id: 'it',
  dateFormats: {
    short: 'dd/MM/yy',
    medium: 'd MMM y',
    long: 'd MMMM y',
    full: 'EEEE d MMMM y'
  },
  timeFormats: {
    short: 'HH:mm',
    medium: 'HH:mm:ss',
    long: 'HH:mm:ss z',
    full: 'HH:mm:ss zzzz'
  },
  dayPeriods: {
    narrow: {
      am: 'm',
      pm: 'p'
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM'
    },
    wide: {
      am: 'AM',
      pm: 'PM'
    }
  },
  days: {
    narrow: {
      sunday: 'D',
      monday: 'L',
      tuesday: 'M',
      wednesday: 'M',
      thursday: 'G',
      friday: 'V',
      saturday: 'S'
    },
    short: {
      sunday: 'Do',
      monday: 'Lu',
      tuesday: 'Ma',
      wednesday: 'Me',
      thursday: 'Gi',
      friday: 'Ve',
      saturday: 'Sa'
    },
    abbreviated: {
      sunday: 'Dom',
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mer',
      thursday: 'Gio',
      friday: 'Ven',
      saturday: 'Sab'
    },
    wide: {
      sunday: 'Domenica',
      monday: 'Lunedì',
      tuesday: 'Martedì',
      wednesday: 'Mercoledì',
      thursday: 'Giovedì',
      friday: 'Venerdì',
      saturday: 'Sabato'
    }
  },
  months: {
    narrow: {
      january: 'G',
      february: 'F',
      march: 'M',
      april: 'A',
      may: 'M',
      june: 'G',
      july: 'L',
      august: 'A',
      september: 'S',
      october: 'O',
      november: 'N',
      december: 'D'
    },
    abbreviated: {
      january: 'Gen',
      february: 'Feb',
      march: 'Mar',
      april: 'Apr',
      may: 'Mag',
      june: 'Giu',
      july: 'Lug',
      august: 'Ago',
      september: 'Set',
      october: 'Ott',
      november: 'Nov',
      december: 'Dic'
    },
    wide: {
      january: 'Gennaio',
      february: 'Febbraio',
      march: 'Marzo',
      april: 'Aprile',
      may: 'Maggio',
      june: 'Giugno',
      july: 'Luglio',
      august: 'Agosto',
      september: 'Settembre',
      october: 'Ottobre',
      november: 'Novembre',
      december: 'Dicembre'
    }
  },
  eras: {
    narrow: {
      bc: 'aC',
      ad: 'dC'
    },
    abbreviated: {
      bc: 'a.C.',
      ad: 'd.C.'
    },
    wide: {
      bc: 'avanti Cristo',
      ad: 'dopo Cristo'
    }
  },
  numberSymbols: {
    decimal: ',',
    group: '.',
    list: ';',
    percentSign: '%',
    plusSign: '+',
    minusSign: '-',
    exponential: 'E',
    superscriptingExponent: '×',
    perMille: '‰',
    infinite: '∞',
    nan: 'NaN',
    timeSeparator: ':' // currencyDecimal: undefined, // fallback to decimal
    // currencyGroup: undefined, // fallback to group

  }
};

var LocaleService = /*#__PURE__*/function () {
  function LocaleService() {}

  LocaleService.getLocale = function getLocale() {
    var locale = window.locale || LocaleService.defaultLocale;
    var key = Array.prototype.slice.call(arguments).join('.'); // console.log(key, locale[key]);

    return locale[key] || "{" + key + "}";
  };

  LocaleService.getObjectLocale = function getObjectLocale() {
    // console.log([...arguments].join(','));
    var value;

    for (var i = 0; i < arguments.length; i++) {
      var key = arguments[i];
      value = value ? value[key] : locale[key];
    }

    return value;
  };

  LocaleService.toLocaleString = function toLocaleString(locale, out) {
    var _this = this;

    if (out === void 0) {
      out = {};
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (typeof locale === 'string') {
      out[args.join('.')] = locale;
    } else {
      Object.keys(locale).forEach(function (key) {
        var keys = args.slice();
        keys.push(key);
        out = _this.toLocaleString.apply(_this, [locale[key], out].concat(keys));
      });
    }

    return out;
  };

  LocaleService.toLocaleObject = function toLocaleObject(locale, key, out) {
    var _this2 = this;

    if (out === void 0) {
      out = {};
    }

    if (typeof locale === 'string') {
      out[key] = locale;
    } else {
      if (key) {
        out = out[key] = {};
      }

      Object.keys(locale).forEach(function (key) {
        out = _this2.toLocaleObject(locale[key], key, out);
      });
    }

    return out;
  };

  return LocaleService;
}();
LocaleService.defaultLocale = LocaleService.toLocaleString(locale_it);var TimezoneLength = {
  Short: 'short',
  ShortGMT: 'shortGmt',
  Long: 'long',
  Extended: 'extended'
};
var DatePart = {
  FullYear: 'fullYear',
  Month: 'month',
  Date: 'date',
  Hours: 'hours',
  Minutes: 'minutes',
  Seconds: 'seconds',
  Milliseconds: 'milliseconds',
  Day: 'day'
};
/*
// Converts a value to date. Throws if unable to convert to a date.
export const ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
export function parseDate(value) {
	if (isDate(value)) {
		return value;
	}
	if (typeof value === 'number' && !isNaN(value)) {
		return new Date(value);
	}
	if (typeof value === 'string') {
		value = value.trim();
		const parsedNb = parseFloat(value);
		// any string that only contains numbers, like '1234' but not like '1234hello'
		if (!isNaN(value - parsedNb)) {
			return new Date(parsedNb);
		}
		if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
			// For ISO Strings without time the day, month and year must be extracted from the ISO String
      // before Date creation to avoid time offset and errors in the new Date.
      // If we only replace '-' with ',' in the ISO String ('2015,01,01'), and try to create a new
      // date, some browsers (e.g. IE 9) will throw an invalid Date error.
      // If we leave the '-' ('2015-01-01') and try to create a new Date('2015-01-01') the timeoffset
      // is applied.
      // Note: ISO months are 0 for January, 1 for February, ...
			const [y, m, d] = value.split('-').map(val => +val);
			return new Date(y, m - 1, d);
		}
		const match = value.match(ISO8601_DATE_REGEX);
		if (match) {
			return isoStringToDate(match);
		}
	}
	const date = new Date(value);
	if (!isDate(date)) {
		throw new Error(`Unable to convert "${value}" into a date`);
	}
	return date;
}

// Converts a date in ISO8601 to a Date. Used instead of `Date.parse` because of browser discrepancies.
export function isoStringToDate(match) {
	const date = new Date(0);
	let tzHour = 0;
	let tzMin = 0;
	// match[8] means that the string contains 'Z' (UTC) or a timezone like '+01:00' or '+0100'
	const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
	const timeSetter = match[8] ? date.setUTCHours : date.setHours;
	// if there is a timezone defined like '+01:00' or '+0100'
	if (match[9]) {
		tzHour = Number(match[9] + match[10]);
		tzMin = Number(match[9] + match[11]);
	}
	dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	const h = Number(match[4] || 0) - tzHour;
	const m = Number(match[5] || 0) - tzMin;
	const s = Number(match[6] || 0);
	const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
	timeSetter.call(date, h, m, s, ms);
	return date;
}

export function isDate(value) {
	return value instanceof Date && !isNaN(value.valueOf());
}
*/

function padNumber(num, digits, minusSign, trim, negWrap) {
  if (minusSign === void 0) {
    minusSign = '-';
  }

  var neg = '';

  if (negWrap && num <= 0) {
    num = -num + 1;
  } else if (num < 0) {
    num = -num;
    neg = minusSign;
  }

  var strNum = String(num);

  while (strNum.length < digits) {
    strNum = '0' + strNum;
  }

  if (trim) {
    strNum = strNum.substr(strNum.length - digits);
  }

  return neg + strNum;
}

var FORMAT_SPLITTER_REGEX = /((?:[^GyMLwWdEabBhHmsSzZO']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
var JANUARY = 0;
var THURSDAY = 4;

var DateTimeService = /*#__PURE__*/function () {
  function DateTimeService() {}

  DateTimeService.getDatePart = function getDatePart(part, date) {
    switch (part) {
      case DatePart.FullYear:
        return date.getFullYear();

      case DatePart.Month:
        return date.getMonth();

      case DatePart.Date:
        return date.getDate();

      case DatePart.Day:
        return date.getDay();

      case DatePart.Hours:
        return date.getHours();

      case DatePart.Minutes:
        return date.getMinutes();

      case DatePart.Seconds:
        return date.getSeconds();

      case DatePart.Milliseconds:
        return date.getMilliseconds();

      default:
        throw new Error("Unknown DatePart value \"" + part + "\".");
    }
  };

  DateTimeService.formatMilliseconds = function formatMilliseconds(milliseconds, digits) {
    var strMs = padNumber(milliseconds, 3);
    return strMs.substr(0, digits);
  };

  DateTimeService.getDateFormatter = function getDateFormatter(name, digits, offset, trim, negWrap) {
    if (offset === void 0) {
      offset = 0;
    }

    if (trim === void 0) {
      trim = false;
    }

    if (negWrap === void 0) {
      negWrap = false;
    }

    return function (date, locale) {
      var part = DateTimeService.getDatePart(name, date);

      if (offset > 0 || part > -offset) {
        part += offset;
      }

      if (name === DatePart.Hours) {
        if (part === 0 && offset === -12) {
          part = 12;
        }
      } else if (name === DatePart.Milliseconds) {
        return DateTimeService.formatMilliseconds(part, digits);
      }

      var localeMinus = LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign);
      return padNumber(part, digits, localeMinus, trim, negWrap);
    };
  };

  DateTimeService.getDateTranslation = function getDateTranslation(date, name, width, extended) {

    switch (name) {
      case LocaleType.Days:
        return LocaleService.getLocale(LocaleType.Days, width, Object.values(LocaleDay)[date.getDay()]);
      // return getLocaleDayNames(width)[Object.values(LocaleDay)[date.getDay()]];

      case LocaleType.Months:
        return LocaleService.getLocale(LocaleType.Months, width, Object.values(LocaleMonth)[date.getMonth()]);

      case LocaleType.DayPeriods:
        var currentHours = date.getHours();
        /*
        const currentMinutes = date.getMinutes();
        if (extended) {
        	const rules = getLocaleExtraDayPeriodRules();
        	const dayPeriods = getLocaleExtraDayPeriods(width);
        	const index = rules.findIndex(rule => {
        		if (Array.isArray(rule)) {
        			// morning, afternoon, evening, night
        			const [from, to] = rule;
        			const afterFrom = currentHours >= from.hours && currentMinutes >= from.minutes;
        			const beforeTo = currentHours < to.hours || (currentHours === to.hours && currentMinutes < to.minutes);
        			// We must account for normal rules that span a period during the day (e.g. 6am-9am)
        			// where `from` is less (earlier) than `to`. But also rules that span midnight (e.g.
        			// 10pm - 5am) where `from` is greater (later!) than `to`.
        			//
        			// In the first case the current time must be BOTH after `from` AND before `to`
        			// (e.g. 8am is after 6am AND before 10am).
        			//
        			// In the second case the current time must be EITHER after `from` OR before `to`
        			// (e.g. 4am is before 5am but not after 10pm; and 11pm is not before 5am but it is
        			// after 10pm).
        			if (from.hours < to.hours) {
        				if (afterFrom && beforeTo) {
        					return true;
        				}
        			} else if (afterFrom || beforeTo) {
        				return true;
        			}
        		} else {
        			// noon or midnight
        			if (rule.hours === currentHours && rule.minutes === currentMinutes) {
        				return true;
        			}
        		}
        		return false;
        	});
        	if (index !== -1) {
        		return dayPeriods[index];
        	}
        }
        */
        // if no rules for the day periods, we use am/pm by default

        return LocaleService.getLocale(LocaleType.DayPeriods, width, currentHours < 12 ? LocaleDayPeriod.AM : LocaleDayPeriod.PM);

      case LocaleType.Eras:
        return LocaleService.getLocale(LocaleType.Eras, width, date.getFullYear() <= 0 ? LocaleEra.BC : LocaleEra.AD);

      default:
        throw new Error("unknown translation type " + name);
    }
  };

  DateTimeService.getDateLocaleFormatter = function getDateLocaleFormatter(name, width, extended) {
    if (extended === void 0) {
      extended = false;
    }

    return function (date) {
      return DateTimeService.getDateTranslation(date, name, width, extended);
    };
  };

  DateTimeService.getWeekFirstThursdayOfYear = function getWeekFirstThursdayOfYear(year) {
    var firstDayOfYear = new Date(year, JANUARY, 1).getDay();
    return new Date(year, 0, 1 + (firstDayOfYear <= THURSDAY ? THURSDAY : THURSDAY + 7) - firstDayOfYear);
  };

  DateTimeService.getWeekThursday = function getWeekThursday(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (THURSDAY - datetime.getDay()));
  };

  DateTimeService.getWeekFormatter = function getWeekFormatter(digits, monthBased) {
    if (monthBased === void 0) {
      monthBased = false;
    }

    return function (date, locale) {
      var result;

      if (monthBased) {
        var nbDaysBefore1stDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
        var today = date.getDate();
        result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
      } else {
        var firstThurs = DateTimeService.getWeekFirstThursdayOfYear(date.getFullYear());
        var thisThurs = DateTimeService.getWeekThursday(date);
        var diff = thisThurs.getTime() - firstThurs.getTime();
        result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
      }

      return padNumber(result, digits, LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign));
    };
  };

  DateTimeService.getTimezoneFormatter = function getTimezoneFormatter(width) {
    return function (date, offset) {
      var zone = -1 * offset;
      var minusSign = LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign);
      var hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);

      switch (width) {
        case TimezoneLength.Short:
          return (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + padNumber(Math.abs(zone % 60), 2, minusSign);

        case TimezoneLength.ShortGMT:
          return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 1, minusSign);

        case TimezoneLength.Long:
          return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);

        case TimezoneLength.Extended:
          if (offset === 0) {
            return 'Z';
          } else {
            return (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);
          }

        default:
          throw new Error("Unknown zone width \"" + width + "\"");
      }
    };
  } // Based on CLDR formats:
  // See complete list: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
  // See also explanations: http://cldr.unicode.org/translation/date-time
  // TODO(ocombe): support all missing cldr formats: Y, U, Q, D, F, e, c, j, J, C, A, v, V, X, x
  // const CACHED_FORMATTERS = {};
  ;

  DateTimeService.getFormatter = function getFormatter(format) {
    /*
    // cache
    if (CACHED_FORMATTERS[format]) {
    return CACHED_FORMATTERS[format];
    }
    */
    var formatter;

    switch (format) {
      // 1 digit representation of the year, e.g. (AD 1 => 1, AD 199 => 199)
      case 'y':
        formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 1, 0, false, true);
        break;
      // 2 digit representation of the year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)

      case 'yy':
        formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 2, 0, true, true);
        break;
      // 3 digit representation of the year, padded (000-999). (e.g. AD 2001 => 01, AD 2010 => 10)

      case 'yyy':
        formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 3, 0, false, true);
        break;
      // 4 digit representation of the year (e.g. AD 1 => 0001, AD 2010 => 2010)

      case 'yyyy':
        formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 4, 0, false, true);
        break;
      // Month of the year (1-12), numeric

      case 'M':
      case 'L':
        formatter = DateTimeService.getDateFormatter(DatePart.Month, 1, 1);
        break;

      case 'MM':
      case 'LL':
        formatter = DateTimeService.getDateFormatter(DatePart.Month, 2, 1);
        break;
      // Day of the month (1-31)

      case 'd':
        formatter = DateTimeService.getDateFormatter(DatePart.Date, 1);
        break;

      case 'dd':
        formatter = DateTimeService.getDateFormatter(DatePart.Date, 2);
        break;
      // Hour in AM/PM, (1-12)

      case 'h':
        formatter = DateTimeService.getDateFormatter(DatePart.Hours, 1, -12);
        break;

      case 'hh':
        formatter = DateTimeService.getDateFormatter(DatePart.Hours, 2, -12);
        break;
      // Hour of the day (0-23)

      case 'H':
        formatter = DateTimeService.getDateFormatter(DatePart.Hours, 1);
        break;
      // Hour in day, padded (00-23)

      case 'HH':
        formatter = DateTimeService.getDateFormatter(DatePart.Hours, 2);
        break;
      // Minute of the hour (0-59)

      case 'm':
        formatter = DateTimeService.getDateFormatter(DatePart.Minutes, 1);
        break;

      case 'mm':
        formatter = DateTimeService.getDateFormatter(DatePart.Minutes, 2);
        break;
      // Second of the minute (0-59)

      case 's':
        formatter = DateTimeService.getDateFormatter(DatePart.Seconds, 1);
        break;

      case 'ss':
        formatter = DateTimeService.getDateFormatter(DatePart.Seconds, 2);
        break;
      // Fractional second

      case 'S':
        formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 1);
        break;

      case 'SS':
        formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 2);
        break;

      case 'SSS':
        formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 3);
        break;
      // Month of the year (January, ...), string, format

      case 'MMM':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Abbreviated);
        break;

      case 'MMMM':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Wide);
        break;

      case 'MMMMM':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Narrow);
        break;
      // Month of the year (January, ...), string, standalone

      case 'LLL':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Abbreviated, FormStyle.Standalone);
        break;

      case 'LLLL':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Wide, FormStyle.Standalone);
        break;

      case 'LLLLL':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Narrow, FormStyle.Standalone);
        break;
      // Day of the Week

      case 'E':
      case 'EE':
      case 'EEE':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Abbreviated);
        break;

      case 'EEEE':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Wide);
        break;

      case 'EEEEE':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Narrow);
        break;

      case 'EEEEEE':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Short);
        break;
      // Generic period of the day (am-pm)

      case 'a':
      case 'aa':
      case 'aaa':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated);
        break;

      case 'aaaa':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide);
        break;

      case 'aaaaa':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow);
        break;
      // Extended period of the day (midnight, at night, ...), standalone

      case 'b':
      case 'bb':
      case 'bbb':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated, FormStyle.Standalone, true);
        break;

      case 'bbbb':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide, FormStyle.Standalone, true);
        break;

      case 'bbbbb':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow, FormStyle.Standalone, true);
        break;
      // Extended period of the day (midnight, night, ...), standalone

      case 'B':
      case 'BB':
      case 'BBB':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated, FormStyle.Format, true);
        break;

      case 'BBBB':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide, FormStyle.Format, true);
        break;

      case 'BBBBB':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow, FormStyle.Format, true);
        break;
      // Era name (AD/BC)

      case 'GGGGG':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Narrow);
        break;

      case 'G':
      case 'GG':
      case 'GGG':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Abbreviated);
        break;

      case 'GGGG':
        formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Wide);
        break;
      // Week of the year (1, ... 52)

      case 'w':
        formatter = DateTimeService.getWeekFormatter(1);
        break;

      case 'ww':
        formatter = DateTimeService.getWeekFormatter(2);
        break;
      // Week of the month (1, ...)

      case 'W':
        formatter = DateTimeService.getWeekFormatter(1, true);
        break;
      // Timezone ISO8601 short format (-0430)

      case 'Z':
      case 'ZZ':
      case 'ZZZ':
        formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Short);
        break;
      // Timezone ISO8601 extended format (-04:30)

      case 'ZZZZZ':
        formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Extended);
        break;
      // Timezone GMT short format (GMT+4)

      case 'O':
      case 'OO':
      case 'OOO':
        formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.ShortGMT);
        break;
      // Should be location, but fallback to format O instead because we don't have the data yet

      case 'z':
      case 'zz':
      case 'zzz':
        formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.ShortGMT);
        break;
      // Timezone GMT long format (GMT+0430)

      case 'OOOO':
      case 'ZZZZ':
        formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Long);
        break;
      // Should be location, but fallback to format O instead because we don't have the data yet

      case 'zzzz':
        formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Long);
        break;

      default:
        return null;
    }
    /*
    // cache
    CACHED_FORMATTERS[format] = formatter;
    */


    return formatter;
  };

  DateTimeService.setTimezoneOffset = function setTimezoneOffset(timezone, fallback) {
    // Support: IE 9-11 only, Edge 13-15+
    // IE/Edge do not "understand" colon (`:`) in timezone
    timezone = timezone.replace(/:/g, '');
    var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
    return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  };

  DateTimeService.dateTimezoneToLocal = function dateTimezoneToLocal(date, timezone, reverse) {
    var reverseValue = reverse ? -1 : 1;
    var dateTimezoneOffset = date.getTimezoneOffset();
    var timezoneOffset = DateTimeService.setTimezoneOffset(timezone, dateTimezoneOffset);
    var minutes = reverseValue * (timezoneOffset - dateTimezoneOffset);
    date = new Date(date.getTime());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  };

  DateTimeService.parseDate = function parseDate(value) {
    if (value instanceof Date) {
      return value;
    }

    return Date.parse(value);
  } // const CACHED_FORMATS = {};
  ;

  DateTimeService.getNamedFormat = function getNamedFormat(format) {
    /*
    // cache
    const localeId = locale.id;
    CACHED_FORMATS[localeId] = CACHED_FORMATS[localeId] || {};
    if (CACHED_FORMATS[localeId][format]) {
    return CACHED_FORMATS[localeId][format];
    }
    */
    var formatValue = '';

    switch (format) {
      case 'shortDate':
        formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Short);
        break;

      case 'mediumDate':
        formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Medium);
        break;

      case 'longDate':
        formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Long);
        break;

      case 'fullDate':
        formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Full);
        break;

      case 'shortTime':
        formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Short);
        break;

      case 'mediumTime':
        formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Medium);
        break;

      case 'longTime':
        formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Long);
        break;

      case 'fullTime':
        formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Full);
        break;

      case 'short':
        var shortTime = DateTimeService.getNamedFormat('shortTime');
        var shortDate = DateTimeService.getNamedFormat('shortDate');
        formatValue = shortTime + " " + shortDate;
        break;

      case 'medium':
        var mediumTime = DateTimeService.getNamedFormat('mediumTime');
        var mediumDate = DateTimeService.getNamedFormat('mediumDate');
        formatValue = mediumTime + " " + mediumDate;
        break;

      case 'long':
        var longTime = DateTimeService.getNamedFormat('longTime');
        var longDate = DateTimeService.getNamedFormat('longDate');
        formatValue = longTime + " " + longDate;
        break;

      case 'full':
        var fullTime = DateTimeService.getNamedFormat('fullTime');
        var fullDate = DateTimeService.getNamedFormat('fullDate');
        formatValue = fullTime + " " + fullDate;
        break;
    }
    /*
    // cache
    if (formatValue) {
    CACHED_FORMATS[localeId][format] = formatValue;
    }
    */


    return formatValue;
  };

  DateTimeService.formatDate = function formatDate(value, format, timezone) {
    var date = DateTimeService.parseDate(value); // console.log(date);
    // named formats

    var namedFormat = DateTimeService.getNamedFormat(format);
    format = namedFormat || format;
    var formats = [];
    var match;

    while (format) {
      match = FORMAT_SPLITTER_REGEX.exec(format);

      if (match) {
        formats = formats.concat(match.slice(1));
        var part = formats.pop();

        if (!part) {
          break;
        }

        format = part;
      } else {
        formats.push(format);
        break;
      }
    } // console.log(formats);


    var dateTimezoneOffset = date.getTimezoneOffset();

    if (timezone) {
      dateTimezoneOffset = DateTimeService.setTimezoneOffset(timezone, dateTimezoneOffset);
      date = DateTimeService.dateTimezoneToLocal(date, timezone, true);
    } // console.log(dateTimezoneOffset);


    var text = '';
    formats.forEach(function (format) {
      var formatter = DateTimeService.getFormatter(format);

      if (formatter) {
        text += formatter(date, dateTimezoneOffset);
      } else {
        text += format === "''" ? "'" : format.replace(/(^'|'$)/g, '').replace(/''/g, "'");
      }
    });
    return text;
  };

  return DateTimeService;
}();var DatePipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(DatePipe, _Pipe);

  function DatePipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  DatePipe.transform = function transform(value, format) {
    if (format === void 0) {
      format = 'short';
    }

    return DateTimeService.formatDate(value, format);
  };

  return DatePipe;
}(rxcomp.Pipe);
DatePipe.meta = {
  name: 'date'
};
/**
 *
 * * The result of this pipe is not reevaluated when the input is mutated. To avoid the need to
 * reformat the date on every change-detection cycle, treat the date as an immutable object
 * and change the reference when the pipe needs to run again.
 *
 * ### Pre-defined format options
 *
 * Examples are given in `en-US` locale.
 *
 * - `'short'`: equivalent to `'M/d/yy, h:mm a'` (`6/15/15, 9:03 AM`).
 * - `'medium'`: equivalent to `'MMM d, y, h:mm:ss a'` (`Jun 15, 2015, 9:03:01 AM`).
 * - `'long'`: equivalent to `'MMMM d, y, h:mm:ss a z'` (`June 15, 2015 at 9:03:01 AM
 * GMT+1`).
 * - `'full'`: equivalent to `'EEEE, MMMM d, y, h:mm:ss a zzzz'` (`Monday, June 15, 2015 at
 * 9:03:01 AM GMT+01:00`).
 * - `'shortDate'`: equivalent to `'M/d/yy'` (`6/15/15`).
 * - `'mediumDate'`: equivalent to `'MMM d, y'` (`Jun 15, 2015`).
 * - `'longDate'`: equivalent to `'MMMM d, y'` (`June 15, 2015`).
 * - `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` (`Monday, June 15, 2015`).
 * - `'shortTime'`: equivalent to `'h:mm a'` (`9:03 AM`).
 * - `'mediumTime'`: equivalent to `'h:mm:ss a'` (`9:03:01 AM`).
 * - `'longTime'`: equivalent to `'h:mm:ss a z'` (`9:03:01 AM GMT+1`).
 * - `'fullTime'`: equivalent to `'h:mm:ss a zzzz'` (`9:03:01 AM GMT+01:00`).
 *
 * ### Custom format options
 *
 * You can construct a format string using symbols to specify the components
 * of a date-time value, as described in the following table.
 * Format details depend on the locale.
 * Fields marked with (*) are only available in the extra data set for the given locale.
 *
 *  | Field type         | Format      | Description                                                   | Example Value                                              |
 *  |--------------------|-------------|---------------------------------------------------------------|------------------------------------------------------------|
 *  | Era                | G, GG & GGG | Abbreviated                                                   | AD                                                         |
 *  |                    | GGGG        | Wide                                                          | Anno Domini                                                |
 *  |                    | GGGGG       | Narrow                                                        | A                                                          |
 *  | Year               | y           | Numeric: minimum digits                                       | 2, 20, 201, 2017, 20173                                    |
 *  |                    | yy          | Numeric: 2 digits + zero padded                               | 02, 20, 01, 17, 73                                         |
 *  |                    | yyy         | Numeric: 3 digits + zero padded                               | 002, 020, 201, 2017, 20173                                 |
 *  |                    | yyyy        | Numeric: 4 digits or more + zero padded                       | 0002, 0020, 0201, 2017, 20173                              |
 *  | Month              | M           | Numeric: 1 digit                                              | 9, 12                                                      |
 *  |                    | MM          | Numeric: 2 digits + zero padded                               | 09, 12                                                     |
 *  |                    | MMM         | Abbreviated                                                   | Sep                                                        |
 *  |                    | MMMM        | Wide                                                          | September                                                  |
 *  |                    | MMMMM       | Narrow                                                        | S                                                          |
 *  | Month standalone   | L           | Numeric: 1 digit                                              | 9, 12                                                      |
 *  |                    | LL          | Numeric: 2 digits + zero padded                               | 09, 12                                                     |
 *  |                    | LLL         | Abbreviated                                                   | Sep                                                        |
 *  |                    | LLLL        | Wide                                                          | September                                                  |
 *  |                    | LLLLL       | Narrow                                                        | S                                                          |
 *  | Week of year       | w           | Numeric: minimum digits                                       | 1... 53                                                    |
 *  |                    | ww          | Numeric: 2 digits + zero padded                               | 01... 53                                                   |
 *  | Week of month      | W           | Numeric: 1 digit                                              | 1... 5                                                     |
 *  | Day of month       | d           | Numeric: minimum digits                                       | 1                                                          |
 *  |                    | dd          | Numeric: 2 digits + zero padded                               | 01                                                          |
 *  | Week day           | E, EE & EEE | Abbreviated                                                   | Tue                                                        |
 *  |                    | EEEE        | Wide                                                          | Tuesday                                                    |
 *  |                    | EEEEE       | Narrow                                                        | T                                                          |
 *  |                    | EEEEEE      | Short                                                         | Tu                                                         |
 *  | Period             | a, aa & aaa | Abbreviated                                                   | am/pm or AM/PM                                             |
 *  |                    | aaaa        | Wide (fallback to `a` when missing)                           | ante meridiem/post meridiem                                |
 *  |                    | aaaaa       | Narrow                                                        | a/p                                                        |
 *  | Period*            | B, BB & BBB | Abbreviated                                                   | mid.                                                       |
 *  |                    | BBBB        | Wide                                                          | am, pm, midnight, noon, morning, afternoon, evening, night |
 *  |                    | BBBBB       | Narrow                                                        | md                                                         |
 *  | Period standalone* | b, bb & bbb | Abbreviated                                                   | mid.                                                       |
 *  |                    | bbbb        | Wide                                                          | am, pm, midnight, noon, morning, afternoon, evening, night |
 *  |                    | bbbbb       | Narrow                                                        | md                                                         |
 *  | Hour 1-12          | h           | Numeric: minimum digits                                       | 1, 12                                                      |
 *  |                    | hh          | Numeric: 2 digits + zero padded                               | 01, 12                                                     |
 *  | Hour 0-23          | H           | Numeric: minimum digits                                       | 0, 23                                                      |
 *  |                    | HH          | Numeric: 2 digits + zero padded                               | 00, 23                                                     |
 *  | Minute             | m           | Numeric: minimum digits                                       | 8, 59                                                      |
 *  |                    | mm          | Numeric: 2 digits + zero padded                               | 08, 59                                                     |
 *  | Second             | s           | Numeric: minimum digits                                       | 0... 59                                                    |
 *  |                    | ss          | Numeric: 2 digits + zero padded                               | 00... 59                                                   |
 *  | Fractional seconds | S           | Numeric: 1 digit                                              | 0... 9                                                     |
 *  |                    | SS          | Numeric: 2 digits + zero padded                               | 00... 99                                                   |
 *  |                    | SSS         | Numeric: 3 digits + zero padded (= milliseconds)              | 000... 999                                                 |
 *  | Zone               | z, zz & zzz | Short specific non location format (fallback to O)            | GMT-8                                                      |
 *  |                    | zzzz        | Long specific non location format (fallback to OOOO)          | GMT-08:00                                                  |
 *  |                    | Z, ZZ & ZZZ | ISO8601 basic format                                          | -0800                                                      |
 *  |                    | ZZZZ        | Long localized GMT format                                     | GMT-8:00                                                   |
 *  |                    | ZZZZZ       | ISO8601 extended format + Z indicator for offset 0 (= XXXXX)  | -08:00                                                     |
 *  |                    | O, OO & OOO | Short localized GMT format                                    | GMT-8                                                      |
 *  |                    | OOOO        | Long localized GMT format                                     | GMT-08:00                                                  |
 *
 * Note that timezone correction is not applied to an ISO string that has no time component, such as "2016-09-19"
 *
 * ### Format examples
 *
 * These examples transform a date into various formats,
 * assuming that `dateObj` is a JavaScript `Date` object for
 * year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11,
 * given in the local time for the `en-US` locale.
 *
 * ```
 * {{ dateObj | date }}               // output is 'Jun 15, 2015'
 * {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
 * {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
 * {{ dateObj | date:'mm:ss' }}       // output is '43:11'
 * ```
 *
 */var DROPDOWN_ID = 1000000;

var DropdownDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DropdownDirective, _Directive);

  function DropdownDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DropdownDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var trigger = node.getAttribute('dropdown-trigger');
    this.trigger = trigger ? node.querySelector(trigger) : node;
    this.opened = null;
    this.onClick = this.onClick.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.addListeners();
    DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
      // console.log('DropdownDirective', id, this['dropdown-item']);
      if (_this.id === id) {
        node.classList.add('dropped');
      } else {
        node.classList.remove('dropped');
      }
    });
  };

  _proto.onClick = function onClick(event) {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    if (this.opened === null) {
      this.openDropdown();
    } else {
      var dropdownItemNode = node.querySelector('[dropdown-item]'); // console.log('dropdownItemNode', dropdownItemNode);

      if (!dropdownItemNode) {
        // if (this.trigger !== node) {
        this.closeDropdown();
      }
    }
  };

  _proto.onDocumentClick = function onDocumentClick(event) {
    var _getContext3 = rxcomp.getContext(this),
        node = _getContext3.node;

    var clickedInside = node === event.target || node.contains(event.target);

    if (!clickedInside) {
      this.closeDropdown();
    }
  };

  _proto.openDropdown = function openDropdown() {
    if (this.opened === null) {
      this.opened = true;
      this.addDocumentListeners();
      DropdownDirective.dropdown$.next(this.id);
      this.dropped.next(this.id);
    }
  };

  _proto.closeDropdown = function closeDropdown() {
    if (this.opened !== null) {
      this.removeDocumentListeners();
      this.opened = null;

      if (DropdownDirective.dropdown$.getValue() === this.id) {
        DropdownDirective.dropdown$.next(null);
        this.dropped.next(null);
      }
    }
  };

  _proto.addListeners = function addListeners() {
    this.trigger.addEventListener('click', this.onClick);
  };

  _proto.addDocumentListeners = function addDocumentListeners() {
    document.addEventListener('click', this.onDocumentClick);
  };

  _proto.removeListeners = function removeListeners() {
    this.trigger.removeEventListener('click', this.onClick);
  };

  _proto.removeDocumentListeners = function removeDocumentListeners() {
    document.removeEventListener('click', this.onDocumentClick);
  };

  _proto.onDestroy = function onDestroy() {
    this.removeListeners();
    this.removeDocumentListeners();
  };

  DropdownDirective.nextId = function nextId() {
    return DROPDOWN_ID++;
  };

  _createClass(DropdownDirective, [{
    key: "id",
    get: function get() {
      return this.dropdown || this.id_ || (this.id_ = DropdownDirective.nextId());
    }
  }]);

  return DropdownDirective;
}(rxcomp.Directive);
DropdownDirective.meta = {
  selector: '[dropdown]',
  inputs: ['dropdown', 'dropdown-trigger'],
  outputs: ['dropped']
};
DropdownDirective.dropdown$ = new rxjs.BehaviorSubject(null);var DropdownItemDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DropdownItemDirective, _Directive);

  function DropdownItemDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DropdownItemDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('dropdown-item');
    DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
      // console.log('DropdownItemDirective', id, this['dropdown-item']);
      if (_this.id === id) {
        node.classList.add('dropped');
      } else {
        node.classList.remove('dropped');
      }
    });
  };

  _createClass(DropdownItemDirective, [{
    key: "id",
    get: function get() {
      return this['dropdown-item'];
    }
  }]);

  return DropdownItemDirective;
}(rxcomp.Directive);
DropdownItemDirective.meta = {
  selector: '[dropdown-item], [[dropdown-item]]',
  inputs: ['dropdown-item']
};var FadingGalleryComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(FadingGalleryComponent, _Component);

  function FadingGalleryComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = FadingGalleryComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var images = this.images = Array.prototype.slice.call(node.querySelectorAll('img'));
    this.index = 0;
    rxjs.interval(2500).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {
      _this.onNext();
    });
  };

  _proto.onNext = function onNext() {
    this.index = (this.index + 1) % this.images.length;
    this.pushChanges();
  };

  return FadingGalleryComponent;
}(rxcomp.Component);
FadingGalleryComponent.meta = {
  selector: '[fading-gallery]'
};var ControlComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ControlComponent, _Component);

  function ControlComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ControlComponent.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var control = this.control;
    var flags = control.flags;
    Object.keys(flags).forEach(function (key) {
      flags[key] ? node.classList.add(key) : node.classList.remove(key);
    });
  };

  return ControlComponent;
}(rxcomp.Component);
ControlComponent.meta = {
  selector: '[control]',
  inputs: ['control']
};var ErrorsComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ErrorsComponent, _ControlComponent);

  function ErrorsComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ErrorsComponent.prototype;

  _proto.onInit = function onInit() {
    this.labels = window.labels || {};
  };

  _proto.getLabel = function getLabel(key, value) {
    var label = this.labels["error_" + key];
    return label;
  };

  return ErrorsComponent;
}(ControlComponent);
ErrorsComponent.meta = {
  selector: 'errors-component',
  inputs: ['control'],
  template:
  /* html */
  "\n\t<div class=\"inner\" [style]=\"{ display: control.invalid && control.touched ? 'block' : 'none' }\">\n\t\t<div class=\"error\" *for=\"let [key, value] of control.errors\">\n\t\t\t<span [innerHTML]=\"getLabel(key, value)\"></span>\n\t\t\t<!-- <span class=\"key\" [innerHTML]=\"key\"></span> <span class=\"value\" [innerHTML]=\"value | json\"></span> -->\n\t\t</div>\n\t</div>\n\t"
};var ModalEvent = function ModalEvent(data) {
  this.data = data;
};
var ModalResolveEvent = /*#__PURE__*/function (_ModalEvent) {
  _inheritsLoose(ModalResolveEvent, _ModalEvent);

  function ModalResolveEvent() {
    return _ModalEvent.apply(this, arguments) || this;
  }

  return ModalResolveEvent;
}(ModalEvent);
var ModalRejectEvent = /*#__PURE__*/function (_ModalEvent2) {
  _inheritsLoose(ModalRejectEvent, _ModalEvent2);

  function ModalRejectEvent() {
    return _ModalEvent2.apply(this, arguments) || this;
  }

  return ModalRejectEvent;
}(ModalEvent);

var ModalService = /*#__PURE__*/function () {
  function ModalService() {}

  ModalService.open$ = function open$(modal) {
    var _this = this;

    return this.getTemplate$(modal.src).pipe(operators.map(function (template) {
      return {
        node: _this.getNode(template),
        data: modal.data,
        modal: modal
      };
    }), operators.tap(function (node) {
      return _this.modal$.next(node);
    }), operators.switchMap(function (node) {
      return _this.events$;
    }));
  };

  ModalService.load$ = function load$(modal) {};

  ModalService.getTemplate$ = function getTemplate$(url) {
    return rxjs.from(fetch(url).then(function (response) {
      return response.text();
    }));
  };

  ModalService.getNode = function getNode(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    var node = div.firstElementChild;
    return node;
  };

  ModalService.reject = function reject(data) {
    this.modal$.next(null);
    this.events$.next(new ModalRejectEvent(data));
  };

  ModalService.resolve = function resolve(data) {
    this.modal$.next(null);
    this.events$.next(new ModalResolveEvent(data));
  };

  return ModalService;
}();
ModalService.modal$ = new rxjs.Subject();
ModalService.events$ = new rxjs.Subject();var ModalOutletComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ModalOutletComponent, _Component);

  function ModalOutletComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ModalOutletComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.modalNode = node.querySelector('.modal-outlet__modal');
    ModalService.modal$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (modal) {
      _this.modal = modal;
    });
  };

  _proto.onRegister = function onRegister(event) {
    // console.log('ModalComponent.onRegister');
    this.pushChanges();
  };

  _proto.onLogin = function onLogin(event) {
    // console.log('ModalComponent.onLogin');
    this.pushChanges();
  };

  _proto.reject = function reject(event) {
    ModalService.reject();
  };

  _createClass(ModalOutletComponent, [{
    key: "modal",
    get: function get() {
      return this.modal_;
    },
    set: function set(modal) {
      // console.log('ModalOutletComponent set modal', modal, this);
      var _getContext2 = rxcomp.getContext(this),
          module = _getContext2.module;

      if (this.modal_ && this.modal_.node) {
        module.remove(this.modal_.node, this);
        this.modalNode.removeChild(this.modal_.node);
      }

      if (modal && modal.node) {
        this.modal_ = modal;
        this.modalNode.appendChild(modal.node);
        var instances = module.compile(modal.node);
      }

      this.modal_ = modal;
      this.pushChanges();
    }
  }]);

  return ModalOutletComponent;
}(rxcomp.Component);
ModalOutletComponent.meta = {
  selector: '[modal-outlet]',
  template:
  /* html */
  "\n\t<div class=\"modal-outlet__container\" [class]=\"{ active: modal }\">\n\t\t<div class=\"modal-outlet__background\" (click)=\"reject($event)\"></div>\n\t\t<div class=\"modal-outlet__modal\"></div>\n\t</div>\n\t"
};var GalleryModalComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(GalleryModalComponent, _Component);

  function GalleryModalComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = GalleryModalComponent.prototype;

  _proto.onInit = function onInit() {
    _Component.prototype.onInit.call(this);

    var _getContext = rxcomp.getContext(this),
        parentInstance = _getContext.parentInstance,
        node = _getContext.node;

    if (parentInstance instanceof ModalOutletComponent) {
      var data = this.data = parentInstance.modal.data;
      this.sliderItems = data.items;
      this.sliderIndex = data.index;
    }
  };

  _proto.close = function close() {
    ModalService.reject();
  };

  _proto.onChange = function onChange(event) {// console.log('onChange', event);
  };

  _proto.onTween = function onTween(event) {// console.log('onTween', event);
  };

  return GalleryModalComponent;
}(rxcomp.Component);
GalleryModalComponent.meta = {
  selector: '[gallery-modal]'
};var NODE = typeof module !== 'undefined' && module.exports;
var PARAMS = NODE ? {
  get: function get() {}
} : new URLSearchParams(window.location.search);
var DEBUG =  PARAMS.get('debug') != null;
var BASE_HREF = NODE ? null : document.querySelector('base').getAttribute('href');
var STATIC = NODE ? false : window && (window.location.port === '40525' || window.location.host === 'actarian.github.io' || window.location.host === 'cantalupi.herokuapp.com');
var DEVELOPMENT = NODE ? false : window && ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
var PRODUCTION = !DEVELOPMENT;
var ENV = {
  NAME: 'cantalupi',
  STATIC: STATIC,
  DEVELOPMENT: DEVELOPMENT,
  PRODUCTION: PRODUCTION,
  RESOURCE: '/docs/',
  STATIC_RESOURCE: './',
  API: '/api',
  STATIC_API: DEVELOPMENT && !STATIC ? '/Client/docs/api' : './api'
};
function getApiUrl(url, useStatic) {
  var base = useStatic || STATIC ? ENV.STATIC_API : ENV.API;
  var json = useStatic || STATIC ? '.json' : '';
  return "" + base + url + json;
}
function getSlug(url) {
  if (!url) {
    return url;
  }

  if (url.indexOf("/" + ENV.NAME) !== 0) {
    return url;
  }

  if (STATIC) {
    console.log(url);
    return url;
  }

  url = url.replace("/" + ENV.NAME, '');
  url = url.replace('.html', '');
  return "/it/it" + url;
}
var Environment = /*#__PURE__*/function () {
  _createClass(Environment, [{
    key: "href",
    get: function get() {
      if (window.location.host.indexOf('herokuapp') !== -1) {
        return 'https://raw.githubusercontent.com/actarian/cantalupi/master/docs/';
      } else {
        return BASE_HREF;
      }
    }
  }, {
    key: "host",
    get: function get() {
      var host = window.location.host.replace('127.0.0.1', '192.168.1.2');

      if (host.substr(host.length - 1, 1) === '/') {
        host = host.substr(0, host.length - 1);
      }

      return window.location.protocol + "//" + host + BASE_HREF;
    }
  }]);

  function Environment(options) {
    if (options) {
      Object.assign(this, options);
    }
  }

  return Environment;
}();
var environment = new Environment({
  port: 5000
});/* locomotive-scroll v3.5.4 | MIT License | https://github.com/locomotivemtl/locomotive-scroll */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var defaults = {
  el: document,
  elMobile: document,
  name: 'scroll',
  offset: [0, 0],
  repeat: false,
  smooth: false,
  smoothMobile: false,
  direction: 'vertical',
  lerp: 0.1,
  "class": 'is-inview',
  scrollbarClass: 'c-scrollbar',
  scrollingClass: 'has-scroll-scrolling',
  draggingClass: 'has-scroll-dragging',
  smoothClass: 'has-scroll-smooth',
  initClass: 'has-scroll-init',
  getSpeed: false,
  getDirection: false,
  multiplier: 1,
  firefoxMultiplier: 50,
  touchMultiplier: 2,
  scrollFromAnywhere: false
};

var _default = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    Object.assign(this, defaults, options);
    this.namespace = 'locomotive';
    this.html = document.documentElement;
    this.windowHeight = window.innerHeight;
    this.windowMiddle = this.windowHeight / 2;
    this.els = [];
    this.listeners = {};
    this.hasScrollTicking = false;
    this.hasCallEventSet = false;
    this.checkScroll = this.checkScroll.bind(this);
    this.checkResize = this.checkResize.bind(this);
    this.checkEvent = this.checkEvent.bind(this);
    this.instance = {
      scroll: {
        x: 0,
        y: 0
      },
      limit: this.html.offsetHeight
    };

    if (this.getDirection) {
      this.instance.direction = null;
    }

    if (this.getDirection) {
      this.instance.speed = 0;
    }

    this.html.classList.add(this.initClass);
    window.addEventListener('resize', this.checkResize, false);
  }

  _createClass$1(_default, [{
    key: "init",
    value: function init() {
      this.initEvents();
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      this.dispatchScroll();
    }
  }, {
    key: "checkResize",
    value: function checkResize() {
      var _this = this;

      if (!this.resizeTick) {
        this.resizeTick = true;
        requestAnimationFrame(function () {
          _this.resize();

          _this.resizeTick = false;
        });
      }
    }
  }, {
    key: "resize",
    value: function resize() {}
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this2 = this;

      this.scrollToEls = this.el.querySelectorAll("[data-".concat(this.name, "-to]"));
      this.setScrollTo = this.setScrollTo.bind(this);
      this.scrollToEls.forEach(function (el) {
        el.addEventListener('click', _this2.setScrollTo, false);
      });
    }
  }, {
    key: "setScrollTo",
    value: function setScrollTo(event) {
      event.preventDefault();
      this.scrollTo(event.currentTarget.getAttribute("data-".concat(this.name, "-href")) || event.currentTarget.getAttribute('href'), event.currentTarget.getAttribute("data-".concat(this.name, "-offset")));
    }
  }, {
    key: "addElements",
    value: function addElements() {}
  }, {
    key: "detectElements",
    value: function detectElements(hasCallEventSet) {
      var _this3 = this;

      var scrollTop = this.instance.scroll.y;
      var scrollBottom = scrollTop + this.windowHeight;
      this.els.forEach(function (el, i) {
        if (el && (!el.inView || hasCallEventSet)) {
          if (scrollBottom >= el.top && scrollTop < el.bottom) {
            _this3.setInView(el, i);
          }
        }

        if (el && el.inView) {
          if (scrollBottom < el.top || scrollTop > el.bottom) {
            _this3.setOutOfView(el, i);
          }
        }
      });
      this.els = this.els.filter(function (current, i) {
        return current !== null;
      });
      this.hasScrollTicking = false;
    }
  }, {
    key: "setInView",
    value: function setInView(current, i) {
      this.els[i].inView = true;
      current.el.classList.add(current["class"]);

      if (current.call && this.hasCallEventSet) {
        this.dispatchCall(current, 'enter');

        if (!current.repeat) {
          this.els[i].call = false;
        }
      }

      if (!current.repeat && !current.speed && !current.sticky) {
        if (!current.call || current.call && this.hasCallEventSet) {
          this.els[i] = null;
        }
      }
    }
  }, {
    key: "setOutOfView",
    value: function setOutOfView(current, i) {
      if (current.repeat || current.speed !== undefined) {
        this.els[i].inView = false;
      }

      if (current.call && this.hasCallEventSet) {
        this.dispatchCall(current, 'exit');
      }

      if (current.repeat) {
        current.el.classList.remove(current["class"]);
      }
    }
  }, {
    key: "dispatchCall",
    value: function dispatchCall(current, way) {
      this.callWay = way;
      this.callValue = current.call.split(',').map(function (item) {
        return item.trim();
      });
      this.callObj = current;
      if (this.callValue.length == 1) this.callValue = this.callValue[0];
      var callEvent = new Event(this.namespace + 'call');
      this.el.dispatchEvent(callEvent);
    }
  }, {
    key: "dispatchScroll",
    value: function dispatchScroll() {
      var scrollEvent = new Event(this.namespace + 'scroll');
      this.el.dispatchEvent(scrollEvent);
    }
  }, {
    key: "setEvents",
    value: function setEvents(event, func) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }

      var list = this.listeners[event];
      list.push(func);

      if (list.length === 1) {
        this.el.addEventListener(this.namespace + event, this.checkEvent, false);
      }

      if (event === 'call') {
        this.hasCallEventSet = true;
        this.detectElements(true);
      }
    }
  }, {
    key: "unsetEvents",
    value: function unsetEvents(event, func) {
      if (!this.listeners[event]) return;
      var list = this.listeners[event];
      var index = list.indexOf(func);
      if (index < 0) return;
      list.splice(index, 1);

      if (list.index === 0) {
        this.el.removeEventListener(this.namespace + event, this.checkEvent, false);
      }
    }
  }, {
    key: "checkEvent",
    value: function checkEvent(event) {
      var _this4 = this;

      var name = event.type.replace(this.namespace, '');
      var list = this.listeners[name];
      if (!list || list.length === 0) return;
      list.forEach(function (func) {
        switch (name) {
          case 'scroll':
            return func(_this4.instance);

          case 'call':
            return func(_this4.callValue, _this4.callWay, _this4.callObj);

          default:
            return func();
        }
      });
    }
  }, {
    key: "startScroll",
    value: function startScroll() {}
  }, {
    key: "stopScroll",
    value: function stopScroll() {}
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.instance.scroll = {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;

      window.removeEventListener('resize', this.checkResize, false);
      Object.keys(this.listeners).forEach(function (event) {
        _this5.el.removeEventListener(_this5.namespace + event, _this5.checkEvent, false);
      });
      this.listeners = {};
      this.scrollToEls.forEach(function (el) {
        el.removeEventListener('click', _this5.setScrollTo, false);
      });
    }
  }]);

  return _default;
}();

var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var smoothscroll = createCommonjsModule$1(function (module, exports) {
/* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      while (el !== d.body && isScrollable(el) === false) {
        el = el.parentNode || el.host;
      }

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  {
    // commonjs
    module.exports = { polyfill: polyfill };
  }

}());
});
var smoothscroll_1 = smoothscroll.polyfill;

var _default$1 = /*#__PURE__*/function (_Core) {
  _inherits(_default, _Core);

  function _default() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
    window.addEventListener('scroll', _this.checkScroll, false);
    smoothscroll.polyfill();
    return _this;
  }

  _createClass$1(_default, [{
    key: "init",
    value: function init() {
      this.instance.scroll.y = window.pageYOffset;
      this.addElements();
      this.detectElements();

      _get(_getPrototypeOf(_default.prototype), "init", this).call(this);
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this2 = this;

      _get(_getPrototypeOf(_default.prototype), "checkScroll", this).call(this);

      if (this.getDirection) {
        this.addDirection();
      }

      if (this.getSpeed) {
        this.addSpeed();
        this.timestamp = Date.now();
      }

      this.instance.scroll.y = window.pageYOffset;

      if (this.els.length) {
        if (!this.hasScrollTicking) {
          requestAnimationFrame(function () {
            _this2.detectElements();
          });
          this.hasScrollTicking = true;
        }
      }
    }
  }, {
    key: "addDirection",
    value: function addDirection() {
      if (window.pageYOffset > this.instance.scroll.y) {
        if (this.instance.direction !== 'down') {
          this.instance.direction = 'down';
        }
      } else if (window.pageYOffset < this.instance.scroll.y) {
        if (this.instance.direction !== 'up') {
          this.instance.direction = 'up';
        }
      }
    }
  }, {
    key: "addSpeed",
    value: function addSpeed() {
      if (window.pageYOffset != this.instance.scroll.y) {
        this.instance.speed = (window.pageYOffset - this.instance.scroll.y) / (Date.now() - this.timestamp);
      } else {
        this.instance.speed = 0;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.els.length) {
        this.windowHeight = window.innerHeight;
        this.updateElements();
      }
    }
  }, {
    key: "addElements",
    value: function addElements() {
      var _this3 = this;

      this.els = [];
      var els = this.el.querySelectorAll('[data-' + this.name + ']');
      els.forEach(function (el, id) {
        var cl = el.dataset[_this3.name + 'Class'] || _this3["class"];

        var top = el.getBoundingClientRect().top + _this3.instance.scroll.y;

        var bottom = top + el.offsetHeight;
        var offset = typeof el.dataset[_this3.name + 'Offset'] === 'string' ? el.dataset[_this3.name + 'Offset'].split(',') : _this3.offset;
        var repeat = el.dataset[_this3.name + 'Repeat'];
        var call = el.dataset[_this3.name + 'Call'];

        if (repeat == 'false') {
          repeat = false;
        } else if (repeat != undefined) {
          repeat = true;
        } else {
          repeat = _this3.repeat;
        }

        var relativeOffset = _this3.getRelativeOffset(offset);

        var mappedEl = {
          el: el,
          id: id,
          "class": cl,
          top: top + relativeOffset[0],
          bottom: bottom - relativeOffset[1],
          offset: offset,
          repeat: repeat,
          inView: el.classList.contains(cl) ? true : false,
          call: call
        };

        _this3.els.push(mappedEl);
      });
    }
  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      this.els.forEach(function (el, i) {
        var top = el.el.getBoundingClientRect().top + _this4.instance.scroll.y;

        var bottom = top + el.el.offsetHeight;

        var relativeOffset = _this4.getRelativeOffset(el.offset);

        _this4.els[i].top = top + relativeOffset[0];
        _this4.els[i].bottom = bottom - relativeOffset[1];
      });
      this.hasScrollTicking = false;
    }
  }, {
    key: "getRelativeOffset",
    value: function getRelativeOffset(offset) {
      var relativeOffset = [0, 0];

      if (offset) {
        for (var i = 0; i < offset.length; i++) {
          if (typeof offset[i] == 'string') {
            if (offset[i].includes('%')) {
              relativeOffset[i] = parseInt(offset[i].replace('%', '') * this.windowHeight / 100);
            } else {
              relativeOffset[i] = parseInt(offset[i]);
            }
          } else {
            relativeOffset[i] = offset[i];
          }
        }
      }

      return relativeOffset;
    }
    /**
     * Scroll to a desired target.
     *
     * @param  Available options :
     *          targetOption {node, string, "top", "bottom", int} - The DOM element we want to scroll to
     *          offsetOption {int} - An absolute vertical scroll value to reach, or an offset to apply on top of given `target` or `sourceElem`'s target
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(targetOption, offsetOption, duration, easing, disableLerp, callback) {
      // TODO - In next breaking update, use an object as 2nd parameter for options (offset, duration, easing, disableLerp, callback)
      var target;
      var offset = offsetOption ? parseInt(offsetOption) : 0;

      if (typeof targetOption === 'string') {
        // Selector or boundaries
        if (targetOption === 'top') {
          target = this.html;
        } else if (targetOption === 'bottom') {
          target = this.html.offsetHeight - window.innerHeight;
        } else {
          target = document.querySelector(targetOption); // If the query fails, abort

          if (!target) {
            return;
          }
        }
      } else if (typeof targetOption === 'number') {
        // Absolute coordinate
        target = parseInt(targetOption);
      } else if (targetOption && targetOption.tagName) {
        // DOM Element
        target = targetOption;
      } else {
        console.warn('`targetOption` parameter is not valid');
        return;
      } // We have a target that is not a coordinate yet, get it


      if (typeof target !== 'number') {
        offset = target.getBoundingClientRect().top + offset + this.instance.scroll.y;
      } else {
        offset = target + offset;
      }

      if (callback) {
        offset = offset.toFixed();

        var onScroll = function onScroll() {
          if (window.pageYOffset.toFixed() === offset) {
            window.removeEventListener('scroll', onScroll);
            callback();
          }
        };

        window.addEventListener('scroll', onScroll);
      }

      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.addElements();
      this.detectElements();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      window.removeEventListener('scroll', this.checkScroll, false);
    }
  }]);

  return _default;
}(_default);

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

var tinyEmitter = E;

var lethargy = createCommonjsModule$1(function (module, exports) {
// Generated by CoffeeScript 1.9.2
(function() {
  var root;

  root =  exports !== null ? exports : this;

  root.Lethargy = (function() {
    function Lethargy(stability, sensitivity, tolerance, delay) {
      this.stability = stability != null ? Math.abs(stability) : 8;
      this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
      this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
      this.delay = delay != null ? delay : 150;
      this.lastUpDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.lastDownDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.deltasTimestamp = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
    }

    Lethargy.prototype.check = function(e) {
      var lastDelta;
      e = e.originalEvent || e;
      if (e.wheelDelta != null) {
        lastDelta = e.wheelDelta;
      } else if (e.deltaY != null) {
        lastDelta = e.deltaY * -40;
      } else if ((e.detail != null) || e.detail === 0) {
        lastDelta = e.detail * -40;
      }
      this.deltasTimestamp.push(Date.now());
      this.deltasTimestamp.shift();
      if (lastDelta > 0) {
        this.lastUpDeltas.push(lastDelta);
        this.lastUpDeltas.shift();
        return this.isInertia(1);
      } else {
        this.lastDownDeltas.push(lastDelta);
        this.lastDownDeltas.shift();
        return this.isInertia(-1);
      }
    };

    Lethargy.prototype.isInertia = function(direction) {
      var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
      lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;
      if (lastDeltas[0] === null) {
        return direction;
      }
      if (this.deltasTimestamp[(this.stability * 2) - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[(this.stability * 2) - 1]) {
        return false;
      }
      lastDeltasOld = lastDeltas.slice(0, this.stability);
      lastDeltasNew = lastDeltas.slice(this.stability, this.stability * 2);
      oldSum = lastDeltasOld.reduce(function(t, s) {
        return t + s;
      });
      newSum = lastDeltasNew.reduce(function(t, s) {
        return t + s;
      });
      oldAverage = oldSum / lastDeltasOld.length;
      newAverage = newSum / lastDeltasNew.length;
      if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && (this.sensitivity < Math.abs(newAverage))) {
        return direction;
      } else {
        return false;
      }
    };

    Lethargy.prototype.showLastUpDeltas = function() {
      return this.lastUpDeltas;
    };

    Lethargy.prototype.showLastDownDeltas = function() {
      return this.lastDownDeltas;
    };

    return Lethargy;

  })();

}).call(commonjsGlobal$1);
});

var support = (function getSupport() {
    return {
        hasWheelEvent: 'onwheel' in document,
        hasMouseWheelEvent: 'onmousewheel' in document,
        hasTouch: ('ontouchstart' in window) || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch,
        hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
        hasPointer: !!window.navigator.msPointerEnabled,
        hasKeyDown: 'onkeydown' in document,
        isFirefox: navigator.userAgent.indexOf('Firefox') > -1
    };
})();

var toString = Object.prototype.toString,
    hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var bindallStandalone = function(object) {
    if(!object) return console.warn('bindAll requires at least one argument.');

    var functions = Array.prototype.slice.call(arguments, 1);

    if (functions.length === 0) {

        for (var method in object) {
            if(hasOwnProperty$1.call(object, method)) {
                if(typeof object[method] == 'function' && toString.call(object[method]) == "[object Function]") {
                    functions.push(method);
                }
            }
        }
    }

    for(var i = 0; i < functions.length; i++) {
        var f = functions[i];
        object[f] = bind(object[f], object);
    }
};

/*
    Faster bind without specific-case checking. (see https://coderwall.com/p/oi3j3w).
    bindAll is only needed for events binding so no need to make slow fixes for constructor
    or partial application.
*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}

var Lethargy = lethargy.Lethargy;



var EVT_ID = 'virtualscroll';

var src = VirtualScroll;

var keyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
};

function VirtualScroll(options) {
    bindallStandalone(this, '_onWheel', '_onMouseWheel', '_onTouchStart', '_onTouchMove', '_onKeyDown');

    this.el = window;
    if (options && options.el) {
        this.el = options.el;
        delete options.el;
    }
    this.options = objectAssign({
        mouseMultiplier: 1,
        touchMultiplier: 2,
        firefoxMultiplier: 15,
        keyStep: 120,
        preventTouch: false,
        unpreventTouchClass: 'vs-touchmove-allowed',
        limitInertia: false,
        useKeyboard: true,
        useTouch: true
    }, options);

    if (this.options.limitInertia) this._lethargy = new Lethargy();

    this._emitter = new tinyEmitter();
    this._event = {
        y: 0,
        x: 0,
        deltaX: 0,
        deltaY: 0
    };
    this.touchStartX = null;
    this.touchStartY = null;
    this.bodyTouchAction = null;

    if (this.options.passive !== undefined) {
        this.listenerOptions = {passive: this.options.passive};
    }
}

VirtualScroll.prototype._notify = function(e) {
    var evt = this._event;
    evt.x += evt.deltaX;
    evt.y += evt.deltaY;

   this._emitter.emit(EVT_ID, {
        x: evt.x,
        y: evt.y,
        deltaX: evt.deltaX,
        deltaY: evt.deltaY,
        originalEvent: e
   });
};

VirtualScroll.prototype._onWheel = function(e) {
    var options = this.options;
    if (this._lethargy && this._lethargy.check(e) === false) return;
    var evt = this._event;

    // In Chrome and in Firefox (at least the new one)
    evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;

    // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
    // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
    if(support.isFirefox && e.deltaMode == 1) {
        evt.deltaX *= options.firefoxMultiplier;
        evt.deltaY *= options.firefoxMultiplier;
    }

    evt.deltaX *= options.mouseMultiplier;
    evt.deltaY *= options.mouseMultiplier;

    this._notify(e);
};

VirtualScroll.prototype._onMouseWheel = function(e) {
    if (this.options.limitInertia && this._lethargy.check(e) === false) return;

    var evt = this._event;

    // In Safari, IE and in Chrome if 'wheel' isn't defined
    evt.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
    evt.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

    this._notify(e);
};

VirtualScroll.prototype._onTouchStart = function(e) {
    var t = (e.targetTouches) ? e.targetTouches[0] : e;
    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;
};

VirtualScroll.prototype._onTouchMove = function(e) {
    var options = this.options;
    if(options.preventTouch
        && !e.target.classList.contains(options.unpreventTouchClass)) {
        e.preventDefault();
    }

    var evt = this._event;

    var t = (e.targetTouches) ? e.targetTouches[0] : e;

    evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
    evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;

    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;

    this._notify(e);
};

VirtualScroll.prototype._onKeyDown = function(e) {
    var evt = this._event;
    evt.deltaX = evt.deltaY = 0;
    var windowHeight = window.innerHeight - 40;

    switch(e.keyCode) {
        case keyCodes.LEFT:
        case keyCodes.UP:
            evt.deltaY = this.options.keyStep;
            break;

        case keyCodes.RIGHT:
        case keyCodes.DOWN:
            evt.deltaY = - this.options.keyStep;
            break;
        case  e.shiftKey:
            evt.deltaY = windowHeight;
            break;
        case keyCodes.SPACE:
            evt.deltaY = - windowHeight;
            break;
        default:
            return;
    }

    this._notify(e);
};

VirtualScroll.prototype._bind = function() {
    if(support.hasWheelEvent) this.el.addEventListener('wheel', this._onWheel, this.listenerOptions);
    if(support.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this._onMouseWheel, this.listenerOptions);

    if(support.hasTouch && this.options.useTouch) {
        this.el.addEventListener('touchstart', this._onTouchStart, this.listenerOptions);
        this.el.addEventListener('touchmove', this._onTouchMove, this.listenerOptions);
    }

    if(support.hasPointer && support.hasTouchWin) {
        this.bodyTouchAction = document.body.style.msTouchAction;
        document.body.style.msTouchAction = 'none';
        this.el.addEventListener('MSPointerDown', this._onTouchStart, true);
        this.el.addEventListener('MSPointerMove', this._onTouchMove, true);
    }

    if(support.hasKeyDown && this.options.useKeyboard) document.addEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype._unbind = function() {
    if(support.hasWheelEvent) this.el.removeEventListener('wheel', this._onWheel);
    if(support.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this._onMouseWheel);

    if(support.hasTouch) {
        this.el.removeEventListener('touchstart', this._onTouchStart);
        this.el.removeEventListener('touchmove', this._onTouchMove);
    }

    if(support.hasPointer && support.hasTouchWin) {
        document.body.style.msTouchAction = this.bodyTouchAction;
        this.el.removeEventListener('MSPointerDown', this._onTouchStart, true);
        this.el.removeEventListener('MSPointerMove', this._onTouchMove, true);
    }

    if(support.hasKeyDown && this.options.useKeyboard) document.removeEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype.on = function(cb, ctx) {
  this._emitter.on(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (events && events[EVT_ID] && events[EVT_ID].length === 1) this._bind();
};

VirtualScroll.prototype.off = function(cb, ctx) {
  this._emitter.off(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (!events[EVT_ID] || events[EVT_ID].length <= 0) this._unbind();
};

VirtualScroll.prototype.reset = function() {
    var evt = this._event;
    evt.x = 0;
    evt.y = 0;
};

VirtualScroll.prototype.destroy = function() {
    this._emitter.off();
    this._unbind();
};

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function getTranslate(el) {
  var translate = {};
  if (!window.getComputedStyle) return;
  var style = getComputedStyle(el);
  var transform = style.transform || style.webkitTransform || style.mozTransform;
  var mat = transform.match(/^matrix3d\((.+)\)$/);

  if (mat) {
    translate.x = mat ? parseFloat(mat[1].split(', ')[12]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[13]) : 0;
  } else {
    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;
  }

  return translate;
}

/**
 * Returns an array containing all the parent nodes of the given node
 * @param  {object} node
 * @return {array} parent nodes
 */
function getParents(elem) {
  // Set up a parent array
  var parents = []; // Push each parent element to the array

  for (; elem && elem !== document; elem = elem.parentNode) {
    parents.push(elem);
  } // Return our parent array


  return parents;
} // https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

var src$1 = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

var keyCodes$1 = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  TAB: 9,
  PAGEUP: 33,
  PAGEDOWN: 34,
  HOME: 36,
  END: 35
};

var _default$2 = /*#__PURE__*/function (_Core) {
  _inherits(_default, _Core);

  function _default() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual';
    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
    if (_this.inertia) _this.lerp = _this.inertia * 0.1;
    _this.isScrolling = false;
    _this.isDraggingScrollbar = false;
    _this.isTicking = false;
    _this.hasScrollTicking = false;
    _this.parallaxElements = [];
    _this.stop = false;
    _this.checkKey = _this.checkKey.bind(_assertThisInitialized(_this));
    window.addEventListener('keydown', _this.checkKey, false);
    return _this;
  }

  _createClass$1(_default, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.html.classList.add(this.smoothClass);
      this.instance = _objectSpread2({
        delta: {
          x: 0,
          y: 0
        }
      }, this.instance);
      this.vs = new src({
        el: this.scrollFromAnywhere ? document : this.el,
        mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.4,
        firefoxMultiplier: this.firefoxMultiplier,
        touchMultiplier: this.touchMultiplier,
        useKeyboard: false,
        passive: true
      });
      this.vs.on(function (e) {
        if (_this2.stop) {
          return;
        }

        if (!_this2.isTicking && !_this2.isDraggingScrollbar) {
          requestAnimationFrame(function () {
            _this2.updateDelta(e);

            if (!_this2.isScrolling) _this2.startScrolling();
          });
          _this2.isTicking = true;
        }

        _this2.isTicking = false;
      });
      this.setScrollLimit();
      this.initScrollBar();
      this.addSections();
      this.addElements();
      this.detectElements();
      this.transformElements(true, true);
      this.checkScroll(true);

      _get(_getPrototypeOf(_default.prototype), "init", this).call(this);
    }
  }, {
    key: "setScrollLimit",
    value: function setScrollLimit() {
      this.instance.limit = this.el.offsetHeight - this.windowHeight;
    }
  }, {
    key: "startScrolling",
    value: function startScrolling() {
      this.isScrolling = true;
      this.checkScroll();
      this.html.classList.add(this.scrollingClass);
    }
  }, {
    key: "stopScrolling",
    value: function stopScrolling() {
      if (this.scrollToRaf) {
        cancelAnimationFrame(this.scrollToRaf);
        this.scrollToRaf = null;
      }

      this.isScrolling = false;
      this.instance.scroll.y = Math.round(this.instance.scroll.y);
      this.html.classList.remove(this.scrollingClass);
    }
  }, {
    key: "checkKey",
    value: function checkKey(e) {
      var _this3 = this;

      if (this.stop) {
        // If we are stopped, we don't want any scroll to occur because of a keypress
        // Prevent tab to scroll to activeElement
        if (e.keyCode == keyCodes$1.TAB) {
          requestAnimationFrame(function () {
            // Make sure native scroll is always at top of page
            _this3.html.scrollTop = 0;
            document.body.scrollTop = 0;
          });
        }

        return;
      }

      switch (e.keyCode) {
        case keyCodes$1.TAB:
          // Do not remove the RAF
          // It allows to override the browser's native scrollTo, which is essential
          requestAnimationFrame(function () {
            // Make sure native scroll is always at top of page
            _this3.html.scrollTop = 0;
            document.body.scrollTop = 0; // Request scrollTo on the focusedElement, putting it at the center of the screen

            _this3.scrollTo(document.activeElement, -window.innerHeight / 2);
          });
          break;

        case keyCodes$1.UP:
          this.instance.delta.y -= 240;
          break;

        case keyCodes$1.DOWN:
          this.instance.delta.y += 240;
          break;

        case keyCodes$1.PAGEUP:
          this.instance.delta.y -= window.innerHeight;
          break;

        case keyCodes$1.PAGEDOWN:
          this.instance.delta.y += window.innerHeight;
          break;

        case keyCodes$1.HOME:
          this.instance.delta.y -= this.instance.limit;
          break;

        case keyCodes$1.END:
          this.instance.delta.y += this.instance.limit;
          break;

        case keyCodes$1.SPACE:
          if (!(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLTextAreaElement)) {
            if (e.shiftKey) {
              this.instance.delta.y -= window.innerHeight;
            } else {
              this.instance.delta.y += window.innerHeight;
            }
          }

          break;

        default:
          return;
      }

      if (this.instance.delta.y < 0) this.instance.delta.y = 0;
      if (this.instance.delta.y > this.instance.limit) this.instance.delta.y = this.instance.limit;
      this.isScrolling = true;
      this.checkScroll();
      this.html.classList.add(this.scrollingClass);
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this4 = this;

      var forced = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (forced || this.isScrolling || this.isDraggingScrollbar) {
        if (!this.hasScrollTicking) {
          requestAnimationFrame(function () {
            return _this4.checkScroll();
          });
          this.hasScrollTicking = true;
        }

        this.updateScroll();
        var distance = Math.abs(this.instance.delta.y - this.instance.scroll.y);

        if (!this.animatingScroll && (distance < 0.5 && this.instance.delta.y != 0 || distance < 0.5 && this.instance.delta.y == 0)) {
          this.stopScrolling();
        }

        for (var i = this.sections.length - 1; i >= 0; i--) {
          if (this.sections[i].persistent || this.instance.scroll.y > this.sections[i].offset && this.instance.scroll.y < this.sections[i].limit) {
            this.transform(this.sections[i].el, 0, -this.instance.scroll.y);

            if (!this.sections[i].inView) {
              this.sections[i].inView = true;
              this.sections[i].el.style.opacity = 1;
              this.sections[i].el.style.pointerEvents = 'all';
              this.sections[i].el.setAttribute("data-".concat(this.name, "-section-inview"), '');
            }
          } else {
            if (this.sections[i].inView) {
              this.sections[i].inView = false;
              this.sections[i].el.style.opacity = 0;
              this.sections[i].el.style.pointerEvents = 'none';
              this.sections[i].el.removeAttribute("data-".concat(this.name, "-section-inview"));
            }

            this.transform(this.sections[i].el, 0, 0);
          }
        }

        if (this.getDirection) {
          this.addDirection();
        }

        if (this.getSpeed) {
          this.addSpeed();
          this.timestamp = Date.now();
        }

        this.detectElements();
        this.transformElements();
        var scrollBarTranslation = this.instance.scroll.y / this.instance.limit * this.scrollBarLimit;
        this.transform(this.scrollbarThumb, 0, scrollBarTranslation);

        _get(_getPrototypeOf(_default.prototype), "checkScroll", this).call(this);

        this.hasScrollTicking = false;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.windowHeight = window.innerHeight;
      this.windowMiddle = this.windowHeight / 2;
      this.update();
    }
  }, {
    key: "updateDelta",
    value: function updateDelta(e) {
      this.instance.delta.y -= e.deltaY * this.multiplier;
      if (this.instance.delta.y < 0) this.instance.delta.y = 0;
      if (this.instance.delta.y > this.instance.limit) this.instance.delta.y = this.instance.limit;
    }
  }, {
    key: "updateScroll",
    value: function updateScroll(e) {
      if (this.isScrolling || this.isDraggingScrollbar) {
        this.instance.scroll.y = lerp(this.instance.scroll.y, this.instance.delta.y, this.lerp);
      } else {
        if (this.instance.scroll.y > this.instance.limit) {
          this.setScroll(this.instance.scroll.x, this.instance.limit);
        } else if (this.instance.scroll.y < 0) {
          this.setScroll(this.instance.scroll.x, 0);
        } else {
          this.setScroll(this.instance.scroll.x, this.instance.delta.y);
        }
      }
    }
  }, {
    key: "addDirection",
    value: function addDirection() {
      if (this.instance.delta.y > this.instance.scroll.y) {
        if (this.instance.direction !== 'down') {
          this.instance.direction = 'down';
        }
      } else if (this.instance.delta.y < this.instance.scroll.y) {
        if (this.instance.direction !== 'up') {
          this.instance.direction = 'up';
        }
      }
    }
  }, {
    key: "addSpeed",
    value: function addSpeed() {
      if (this.instance.delta.y != this.instance.scroll.y) {
        this.instance.speed = (this.instance.delta.y - this.instance.scroll.y) / Math.max(1, Date.now() - this.timestamp);
      } else {
        this.instance.speed = 0;
      }
    }
  }, {
    key: "initScrollBar",
    value: function initScrollBar() {
      this.scrollbar = document.createElement('span');
      this.scrollbarThumb = document.createElement('span');
      this.scrollbar.classList.add("".concat(this.scrollbarClass));
      this.scrollbarThumb.classList.add("".concat(this.scrollbarClass, "_thumb"));
      this.scrollbar.append(this.scrollbarThumb);
      document.body.append(this.scrollbar); // Scrollbar Events

      this.getScrollBar = this.getScrollBar.bind(this);
      this.releaseScrollBar = this.releaseScrollBar.bind(this);
      this.moveScrollBar = this.moveScrollBar.bind(this);
      this.scrollbarThumb.addEventListener('mousedown', this.getScrollBar);
      window.addEventListener('mouseup', this.releaseScrollBar);
      window.addEventListener('mousemove', this.moveScrollBar); // Set scrollbar values

      if (this.instance.limit + this.windowHeight <= this.windowHeight) {
        return;
      }

      this.scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
      this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit + this.scrollbarHeight), "px");
      this.scrollBarLimit = this.scrollbarHeight - this.scrollbarThumb.getBoundingClientRect().height;
    }
  }, {
    key: "reinitScrollBar",
    value: function reinitScrollBar() {
      if (this.instance.limit + this.windowHeight <= this.windowHeight) {
        return;
      }

      this.scrollbarHeight = this.scrollbar.getBoundingClientRect().height;
      this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit + this.scrollbarHeight), "px");
      this.scrollBarLimit = this.scrollbarHeight - this.scrollbarThumb.getBoundingClientRect().height;
    }
  }, {
    key: "destroyScrollBar",
    value: function destroyScrollBar() {
      this.scrollbarThumb.removeEventListener('mousedown', this.getScrollBar);
      window.removeEventListener('mouseup', this.releaseScrollBar);
      window.removeEventListener('mousemove', this.moveScrollBar);
      this.scrollbar.remove();
    }
  }, {
    key: "getScrollBar",
    value: function getScrollBar(e) {
      this.isDraggingScrollbar = true;
      this.checkScroll();
      this.html.classList.remove(this.scrollingClass);
      this.html.classList.add(this.draggingClass);
    }
  }, {
    key: "releaseScrollBar",
    value: function releaseScrollBar(e) {
      this.isDraggingScrollbar = false;
      this.html.classList.add(this.scrollingClass);
      this.html.classList.remove(this.draggingClass);
    }
  }, {
    key: "moveScrollBar",
    value: function moveScrollBar(e) {
      var _this5 = this;

      if (!this.isTicking && this.isDraggingScrollbar) {
        requestAnimationFrame(function () {
          var y = e.clientY * 100 / _this5.scrollbarHeight * _this5.instance.limit / 100;

          if (y > 0 && y < _this5.instance.limit) {
            _this5.instance.delta.y = y;
          }
        });
        this.isTicking = true;
      }

      this.isTicking = false;
    }
  }, {
    key: "addElements",
    value: function addElements() {
      var _this6 = this;

      this.els = [];
      this.parallaxElements = [];
      this.sections.forEach(function (section, y) {
        var els = _this6.sections[y].el.querySelectorAll("[data-".concat(_this6.name, "]"));

        els.forEach(function (el, id) {
          var cl = el.dataset[_this6.name + 'Class'] || _this6["class"];
          var top;
          var repeat = el.dataset[_this6.name + 'Repeat'];
          var call = el.dataset[_this6.name + 'Call'];
          var position = el.dataset[_this6.name + 'Position'];
          var delay = el.dataset[_this6.name + 'Delay'];
          var direction = el.dataset[_this6.name + 'Direction'];
          var sticky = typeof el.dataset[_this6.name + 'Sticky'] === 'string';
          var speed = el.dataset[_this6.name + 'Speed'] ? parseFloat(el.dataset[_this6.name + 'Speed']) / 10 : false;
          var offset = typeof el.dataset[_this6.name + 'Offset'] === 'string' ? el.dataset[_this6.name + 'Offset'].split(',') : _this6.offset;
          var target = el.dataset[_this6.name + 'Target'];
          var targetEl;

          if (target !== undefined) {
            targetEl = document.querySelector("".concat(target));
          } else {
            targetEl = el;
          }

          if (!_this6.sections[y].inView) {
            top = targetEl.getBoundingClientRect().top - getTranslate(_this6.sections[y].el).y - getTranslate(targetEl).y;
          } else {
            top = targetEl.getBoundingClientRect().top + _this6.instance.scroll.y - getTranslate(targetEl).y;
          }

          var bottom = top + targetEl.offsetHeight;
          var middle = (bottom - top) / 2 + top;

          if (sticky) {
            var elTop = el.getBoundingClientRect().top;
            var elDistance = elTop - top;
            top += window.innerHeight;
            bottom = elTop + targetEl.offsetHeight - el.offsetHeight - elDistance;
            middle = (bottom - top) / 2 + top;
          }

          if (repeat == 'false') {
            repeat = false;
          } else if (repeat != undefined) {
            repeat = true;
          } else {
            repeat = _this6.repeat;
          }

          var relativeOffset = [0, 0];

          if (offset) {
            for (var i = 0; i < offset.length; i++) {
              if (typeof offset[i] == 'string') {
                if (offset[i].includes('%')) {
                  relativeOffset[i] = parseInt(offset[i].replace('%', '') * _this6.windowHeight / 100);
                } else {
                  relativeOffset[i] = parseInt(offset[i]);
                }
              } else {
                relativeOffset[i] = offset[i];
              }
            }
          }

          var mappedEl = {
            el: el,
            id: id,
            "class": cl,
            top: top + relativeOffset[0],
            middle: middle,
            bottom: bottom - relativeOffset[1],
            offset: offset,
            repeat: repeat,
            inView: el.classList.contains(cl) ? true : false,
            call: call,
            speed: speed,
            delay: delay,
            position: position,
            target: targetEl,
            direction: direction,
            sticky: sticky
          };

          _this6.els.push(mappedEl);

          if (speed !== false || sticky) {
            _this6.parallaxElements.push(mappedEl);
          }
        });
      });
    }
  }, {
    key: "addSections",
    value: function addSections() {
      var _this7 = this;

      this.sections = [];
      var sections = this.el.querySelectorAll("[data-".concat(this.name, "-section]"));

      if (sections.length === 0) {
        sections = [this.el];
      }

      sections.forEach(function (section, i) {
        var offset = section.getBoundingClientRect().top - window.innerHeight * 1.5 - getTranslate(section).y;
        var limit = offset + section.getBoundingClientRect().height + window.innerHeight * 2;
        var persistent = typeof section.dataset[_this7.name + 'Persistent'] === 'string';
        var mappedSection = {
          el: section,
          offset: offset,
          limit: limit,
          inView: false,
          persistent: persistent
        };
        _this7.sections[i] = mappedSection;
      });
    }
  }, {
    key: "transform",
    value: function transform(element, x, y, delay) {
      var transform;

      if (!delay) {
        transform = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(x, ",").concat(y, ",0,1)");
      } else {
        var start = getTranslate(element);
        var lerpX = lerp(start.x, x, delay);
        var lerpY = lerp(start.y, y, delay);
        transform = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(lerpX, ",").concat(lerpY, ",0,1)");
      }

      element.style.webkitTransform = transform;
      element.style.msTransform = transform;
      element.style.transform = transform;
    }
  }, {
    key: "transformElements",
    value: function transformElements(isForced) {
      var _this8 = this;

      var setAllElements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var scrollBottom = this.instance.scroll.y + this.windowHeight;
      var scrollMiddle = this.instance.scroll.y + this.windowMiddle;
      this.parallaxElements.forEach(function (current, i) {
        var transformDistance = false;

        if (isForced) {
          transformDistance = 0;
        }

        if (current.inView || setAllElements) {
          switch (current.position) {
            case 'top':
              transformDistance = _this8.instance.scroll.y * -current.speed;
              break;

            case 'elementTop':
              transformDistance = (scrollBottom - current.top) * -current.speed;
              break;

            case 'bottom':
              transformDistance = (_this8.instance.limit - scrollBottom + _this8.windowHeight) * current.speed;
              break;

            default:
              transformDistance = (scrollMiddle - current.middle) * -current.speed;
              break;
          }
        }

        if (current.sticky) {
          if (current.inView) {
            transformDistance = _this8.instance.scroll.y - current.top + window.innerHeight;
          } else {
            if (_this8.instance.scroll.y < current.top - window.innerHeight && _this8.instance.scroll.y < current.top - window.innerHeight / 2) {
              transformDistance = 0;
            } else if (_this8.instance.scroll.y > current.bottom && _this8.instance.scroll.y > current.bottom + 100) {
              transformDistance = current.bottom - current.top + window.innerHeight;
            } else {
              transformDistance = false;
            }
          }
        }

        if (transformDistance !== false) {
          if (current.direction === 'horizontal') {
            _this8.transform(current.el, transformDistance, 0, isForced ? false : current.delay);
          } else {
            _this8.transform(current.el, 0, transformDistance, isForced ? false : current.delay);
          }
        }
      });
    }
    /**
     * Scroll to a desired target.
     *
     * @param  Available options :
     *          targetOption {node, string, "top", "bottom", int} - The DOM element we want to scroll to
     *          offsetOption {int} - An offset to apply on top of given `target` or `sourceElem`'s target
     *          duration {int} - Duration of the scroll animation in milliseconds
     *          easing {array} - An array of 4 floats between 0 and 1 defining the bezier curve for the animation's easing. See http://greweb.me/bezier-easing-editor/example/
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(targetOption, offsetOption) {
      var _this9 = this;

      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
      var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [0.25, 0.00, 0.35, 1.00];
      var disableLerp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var callback = arguments.length > 5 ? arguments[5] : undefined;
      // TODO - In next breaking update, use an object as 2nd parameter for options (offset, duration, easing, disableLerp, callback)
      var target;
      var offset = offsetOption ? parseInt(offsetOption) : 0;
      easing = src$1.apply(void 0, _toConsumableArray(easing));

      if (typeof targetOption === 'string') {
        // Selector or boundaries
        if (targetOption === 'top') {
          target = 0;
        } else if (targetOption === 'bottom') {
          target = this.instance.limit;
        } else {
          target = document.querySelector(targetOption); // If the query fails, abort

          if (!target) {
            return;
          }
        }
      } else if (typeof targetOption === 'number') {
        // Absolute coordinate
        target = parseInt(targetOption);
      } else if (targetOption && targetOption.tagName) {
        // DOM Element
        target = targetOption;
      } else {
        console.warn('`targetOption` parameter is not valid');
        return;
      } // We have a target that is not a coordinate yet, get it


      if (typeof target !== 'number') {
        // Verify the given target belongs to this scroll scope
        var targetInScope = getParents(target).includes(this.el);

        if (!targetInScope) {
          // If the target isn't inside our main element, abort any action
          return;
        } // Get target offset from top


        var targetBCR = target.getBoundingClientRect();
        var offsetTop = targetBCR.top; // Try and find the target's parent section

        var targetParents = getParents(target);
        var parentSection = targetParents.find(function (candidate) {
          return _this9.sections.find(function (section) {
            return section.el == candidate;
          });
        });
        var parentSectionOffset = 0;

        if (parentSection) {
          parentSectionOffset = getTranslate(parentSection).y; // We got a parent section, store it's current offset to remove it later
        } // Final value of scroll destination : offsetTop + (optional offset given in options) - (parent's section translate)


        offset = offsetTop + offset - parentSectionOffset;
      } else {
        offset = target + offset;
      } // Actual scrollto
      // ==========================================================================
      // Setup


      var scrollStart = parseFloat(this.instance.delta.y);
      var scrollTarget = Math.max(0, Math.min(offset, this.instance.limit)); // Make sure our target is in the scroll boundaries

      var scrollDiff = scrollTarget - scrollStart;

      var render = function render(p) {
        if (disableLerp) _this9.setScroll(_this9.instance.delta.x, scrollStart + scrollDiff * p);else _this9.instance.delta.y = scrollStart + scrollDiff * p;
      }; // Prepare the scroll


      this.animatingScroll = true; // This boolean allows to prevent `checkScroll()` from calling `stopScrolling` when the animation is slow (i.e. at the beginning of an EaseIn)

      this.stopScrolling(); // Stop any movement, allows to kill any other `scrollTo` still happening

      this.startScrolling(); // Restart the scroll
      // Start the animation loop

      var start = Date.now();

      var loop = function loop() {
        var p = (Date.now() - start) / duration; // Animation progress

        if (p > 1) {
          // Animation ends
          render(1);
          _this9.animatingScroll = false;
          if (duration == 0) _this9.update();
          if (callback) callback();
        } else {
          _this9.scrollToRaf = requestAnimationFrame(loop);
          render(easing(p));
        }
      };

      loop();
    }
  }, {
    key: "update",
    value: function update() {
      this.setScrollLimit();
      this.addSections();
      this.addElements();
      this.detectElements();
      this.updateScroll();
      this.transformElements(true);
      this.reinitScrollBar();
      this.checkScroll(true);
    }
  }, {
    key: "startScroll",
    value: function startScroll() {
      this.stop = false;
    }
  }, {
    key: "stopScroll",
    value: function stopScroll() {
      this.stop = true;
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.instance = _objectSpread2({}, this.instance, {
        scroll: {
          x: x,
          y: y
        },
        delta: {
          x: x,
          y: y
        },
        speed: 0
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      this.stopScrolling();
      this.html.classList.remove(this.smoothClass);
      this.vs.destroy();
      this.destroyScrollBar();
      window.removeEventListener('keydown', this.checkKey, false);
    }
  }]);

  return _default;
}(_default);

var _default$3 = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    this.options = options;
    Object.assign(this, defaults, options);
    this.init();
  }

  _createClass$1(_default, [{
    key: "init",
    value: function init() {
      if (!this.smoothMobile) {
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      }

      if (this.smooth === true && !this.isMobile) {
        this.scroll = new _default$2(this.options);
      } else {
        this.scroll = new _default$1(this.options);
      }

      this.scroll.init();

      if (window.location.hash) {
        // Get the hash without the '#' and find the matching element
        var id = window.location.hash.slice(1, window.location.hash.length);
        var target = document.getElementById(id); // If found, scroll to the element

        if (target) this.scroll.scrollTo(target);
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.scroll.update();
    }
  }, {
    key: "start",
    value: function start() {
      this.scroll.startScroll();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scroll.stopScroll();
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(target, offset, duration, easing, disableLerp, callback) {
      // TODO - In next breaking update, use an object as 2nd parameter for options (offset, duration, easing, disableLerp, callback)
      this.scroll.scrollTo(target, offset, duration, easing, disableLerp, callback);
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.scroll.setScroll(x, y);
    }
  }, {
    key: "on",
    value: function on(event, func) {
      this.scroll.setEvents(event, func);
    }
  }, {
    key: "off",
    value: function off(event, func) {
      this.scroll.unsetEvents(event, func);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.scroll.destroy();
    }
  }]);

  return _default;
}();var LocomotiveService = /*#__PURE__*/function () {
  function LocomotiveService() {}

  LocomotiveService.locomotive$ = function locomotive$(element) {
    var _this = this;

    if (!this.init_) {
      this.init_ = true;
      setTimeout(function () {
        var ls = new _default$3({
          el: element,
          smooth: false,
          getSpeed: true,
          getDirection: false,
          useKeyboard: true,
          smoothMobile: true,
          inertia: 1,
          class: "is-inview",
          scrollbarClass: "c-scrollbar",
          scrollingClass: "has-scroll-scrolling",
          draggingClass: "has-scroll-dragging",
          smoothClass: "has-scroll-smooth",
          initClass: "has-scroll-init"
        });

        _this.instance$.next(ls);
      }, 200);
    }

    return this.instance$;
  };

  return LocomotiveService;
}();
LocomotiveService.instance$ = new rxjs.ReplaySubject(1);
LocomotiveService.scroll$ = LocomotiveService.instance$.pipe(operators.switchMap(function (ls) {
  return rxjs.fromEventPattern(function (handler) {
    ls.on('scroll', handler);
  }, function (handler) {
    ls.off('scroll', handler);
  });
}));var GALLERY_MODAL = BASE_HREF + 'gallery-modal.html';
var GalleryLerp = /*#__PURE__*/function () {
  function GalleryLerp() {
    this.x = 0;
    this.y = 0;
    this.dy = 0;
  }

  var _proto = GalleryLerp.prototype;

  _proto.tick = function tick(coords) {
    if (coords.x) {
      var inertia = this.inertia ? Number(this.inertia) : 0.01;
      this.x += (coords.x - this.x) * inertia;
      this.y += (coords.y + this.dy - this.y) * inertia;
    }
  };

  return GalleryLerp;
}();

var GalleryComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(GalleryComponent, _Component);

  function GalleryComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto2 = GalleryComponent.prototype;

  _proto2.onInit = function onInit() {
    var _this = this;

    GalleryComponent.items.push(this.gallery);
    var lerp = this.lerp = new GalleryLerp();
    this.raf$ = rxjs.interval(0, rxjs.animationFrame);

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var buttonSpan = node.querySelector('.btn--gallery > span');
    var coords = {
      x: 0,
      y: 0
    };
    this.move$ = rxjs.fromEvent(window, 'mousemove').pipe(operators.map(function (event) {
      coords.x = -window.innerWidth * 0.25 + event.clientX;
      coords.y = -window.innerWidth * 0.25 + event.clientY;
      return coords;
    }));
    LocomotiveService.scroll$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      _this.lerp.dy = event.scroll.y;
    });
    this.animation$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (lerp) {
      gsap.set(buttonSpan, {
        backgroundPosition: lerp.x + "px " + lerp.y + "px"
      });
    });
  };

  _proto2.animation$ = function animation$() {
    var _this2 = this;

    return this.raf$.pipe(operators.withLatestFrom(this.move$), operators.map(function (event) {
      var lerp = _this2.lerp;
      lerp.tick(event[1]);
      return lerp;
    }), operators.startWith(this.lerp));
  };

  _proto2.onOpenGallery = function onOpenGallery(event) {
    var items = GalleryComponent.items;
    var index = items.indexOf(this.gallery); // console.log('GalleryComponent.onOpenGallery', this.gallery, items, index);

    ModalService.open$({
      src: GALLERY_MODAL,
      data: {
        items: items,
        index: index
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {// this.pushChanges();
    });
  };

  return GalleryComponent;
}(rxcomp.Component);
GalleryComponent.items = [];
GalleryComponent.meta = {
  selector: '[gallery]',
  inputs: ['gallery']
};var CssService = /*#__PURE__*/function () {
  function CssService() {}

  CssService.height$ = function height$() {
    var style = document.documentElement.style;
    return rxjs.fromEvent(window, 'resize').pipe(operators.map(function (event) {
      return window.innerHeight;
    }), operators.startWith(window.innerHeight), operators.tap(function (height) {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      var vh = height * 0.01; // Then we set the value in the --vh custom property to the root of the document

      style.setProperty('--vh', vh + "px");
    }));
  };

  return CssService;
}();var HeaderComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(HeaderComponent, _Component);

  function HeaderComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = HeaderComponent.prototype;

  _proto.onInit = function onInit() {
    this.mainActive = false;
    CssService.height$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (height) {
      console.log('HeaderComponent.height$', height);
    });
  };

  _proto.onMainToggle = function onMainToggle() {
    this.mainActive = !this.mainActive;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var items = Array.prototype.slice.call(node.querySelectorAll('.nav--primary-menu > li'));
    gsap.to(items, {
      opacity: this.mainActive ? 1 : 0,
      duration: 0.35,
      stagger: {
        each: 0.05,
        ease: Power3.easeOut
      }
    });
    this.pushChanges();
    this.toggle.next(this.mainActive);
  };

  _proto.onOpenSub = function onOpenSub(subId) {
    this.subId = subId;
    this.pushChanges();
  };

  _proto.onCloseSub = function onCloseSub(subId) {
    if (this.subId === subId) {
      this.subId = null;
      this.pushChanges();
    }
  };

  _proto.isSubOpen = function isSubOpen(subId) {
    return this.subId === subId;
  };

  _proto.isPrimaryHidden = function isPrimaryHidden() {
    return this.subId != null;
  };

  return HeaderComponent;
}(rxcomp.Component);
HeaderComponent.meta = {
  selector: 'header',
  outputs: ['toggle']
};/*
['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
['"', '&', ''', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
*/

var HtmlPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(HtmlPipe, _Pipe);

  function HtmlPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  HtmlPipe.transform = function transform(value) {
    if (value) {
      value = value.replace(/&#(\d+);/g, function (m, n) {
        return String.fromCharCode(parseInt(n));
      });
      var escapes = ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
      var unescapes = ['"', '&', '\'', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
      var rx = new RegExp("(&" + escapes.join(';)|(&') + ";)", 'g');
      value = value.replace(rx, function () {
        for (var i = 1; i < arguments.length; i++) {
          if (arguments[i]) {
            // console.log(arguments[i], unescapes[i - 1]);
            return unescapes[i - 1];
          }
        }
      }); // console.log(value);

      return value;
    }
  };

  return HtmlPipe;
}(rxcomp.Pipe);
HtmlPipe.meta = {
  name: 'html'
};var UID = 0;

var ImageService = /*#__PURE__*/function () {
  function ImageService() {}

  ImageService.worker = function worker() {
    if (!this.worker_) {
      this.worker_ = new Worker("/cantalupi/js/workers/image.service.worker.js"); // this.worker_ = new Worker(`${getResourceRoot()}js/workers/image.service.worker.js`);
    }

    return this.worker_;
  };

  ImageService.load$ = function load$(src) {
    // if (!('Worker' in window) || this.isBlob(src) || this.isCors(src)) {
    if (!('Worker' in window) || this.isBlob(src)) {
      return rxjs.of(src);
    }

    var id = ++UID;
    var worker = this.worker();
    worker.postMessage({
      src: src,
      id: id
    });
    return rxjs.fromEvent(worker, 'message').pipe(operators.filter(function (event) {
      return event.data.src === src;
    }), operators.map(function (event) {
      var url = URL.createObjectURL(event.data.blob);
      return url;
    }), operators.first(), operators.finalize(function (url) {
      worker.postMessage({
        id: id
      });

      if (url) {
        URL.revokeObjectURL(url);
      }
    }));
  };

  ImageService.isCors = function isCors(src) {
    return src.indexOf('//') !== -1 && src.indexOf(window.location.host) === -1;
  };

  ImageService.isBlob = function isBlob(src) {
    return src.indexOf('blob:') === 0;
  };

  return ImageService;
}();var IntersectionService = /*#__PURE__*/function () {
  function IntersectionService() {}

  IntersectionService.observer = function observer() {
    var _this = this;

    if (!this.observer_) {
      this.readySubject_ = new rxjs.BehaviorSubject(false);
      this.observerSubject_ = new rxjs.Subject();
      this.observer_ = new IntersectionObserver(function (entries) {
        _this.observerSubject_.next(entries);
      });
    }

    return this.observer_;
  };

  IntersectionService.intersection$ = function intersection$(node) {
    if ('IntersectionObserver' in window) {
      var observer = this.observer();
      observer.observe(node);
      return this.observerSubject_.pipe( // tap(entries => console.log(entries.length)),
      operators.map(function (entries) {
        return entries.find(function (entry) {
          return entry.target === node;
        });
      }), operators.filter(function (entry) {
        return entry !== undefined;
      }), // tap(entry => console.log('IntersectionService.intersection$', entry)),
      operators.finalize(function () {
        return observer.unobserve(node);
      }));
    } else {
      return rxjs.of({
        target: node,
        isIntersecting: true
      });
    }
  };

  IntersectionService.firstIntersection$ = function firstIntersection$(node) {
    return this.intersection$(node).pipe(operators.filter(function (entry) {
      return entry.isIntersecting;
    }), // entry.intersectionRatio > 0
    operators.first());
  };

  return IntersectionService;
}();var LazyCache = /*#__PURE__*/function () {
  function LazyCache() {}

  LazyCache.get = function get(src) {
    return this.cache[src];
  };

  LazyCache.set = function set(src, blob) {
    this.cache[src] = blob;
    var keys = Object.keys(this.cache);

    if (keys.length > 100) {
      this.remove(keys[0]);
    }
  };

  LazyCache.remove = function remove(src) {
    delete this.cache[src];
  };

  _createClass(LazyCache, null, [{
    key: "cache",
    get: function get() {
      if (!this.cache_) {
        this.cache_ = {};
      }

      return this.cache_;
    }
  }]);

  return LazyCache;
}();var LazyPictureDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(LazyPictureDirective, _Directive);

  function LazyPictureDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = LazyPictureDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var imgs = node.querySelectorAll('img');

    if (imgs.length > 1) {
      throw 'LazyPictureDirective.error only one img tag allowed';
    }

    if (imgs.length === 0) {
      throw 'LazyPictureDirective.error one img tag needed';
    }

    var img = imgs[0]; // node.classList.add('lazy');

    this.src$ = new rxjs.ReplaySubject(1).pipe(operators.distinctUntilChanged(), operators.switchMap(function (src) {
      var data = LazyCache.get(src);

      if (data) {
        return rxjs.of(data);
      } // node.classList.remove('lazyed');


      _this.setAnimation(0);

      return  _this.intersection$(src) ;
    }), operators.takeUntil(this.unsubscribe$));
    this.src$.subscribe(function (src) {


      LocomotiveService.instance$.pipe(operators.first(), operators.delay(10)).subscribe(function (instance) {
        instance.update();

        _this.animate();
      });
    });
    node.addEventListener('click', function () {
      _this.setAnimation(0);

      _this.animate();
    });
  };

  _proto.setAnimation = function setAnimation(value) {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var overlay = node.querySelector('.lazy-picture__overlay');
    var o2 = 1 - value;
    var p2 = 100 * value;
    gsap.set(overlay, {
      // background: `radial-gradient(ellipse at center,rgba(0,0,0,0) 0px,rgba(0,0,0,${o2}) ${p2}%)`
      background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0," + o2 + ") " + p2 + "%)"
    });
  };

  _proto.animate = function animate() {
    var _getContext3 = rxcomp.getContext(this),
        node = _getContext3.node;

    var overlay = node.querySelector('.lazy-picture__overlay');
    var o = {
      value: 0
    };
    gsap.to(o, 3, {
      value: 1,
      delay: 1,
      overwrite: true,
      ease: Power4.easeOut,
      onUpdate: function onUpdate() {
        var o2 = 1 - o.value;
        var p2 = 100 * o.value;
        gsap.set(overlay, {
          // background: `radial-gradient(ellipse at center,rgba(0,0,0,0) 0px,rgba(0,0,0,${o2}) ${p2}%)`
          background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0," + o2 + ") " + p2 + "%)"
        });
      },
      onCompleted: function onCompleted() {
        gsap.set(overlay, {
          background: "none"
        });
      }
    });
  };

  _proto.onChanges = function onChanges() {
    this.src$.next(this.lazyPicture);
  };

  _proto.lazy$ = function lazy$(src) {
    var _getContext4 = rxcomp.getContext(this),
        node = _getContext4.node;

    return IntersectionService.firstIntersection$(node).pipe( // tap(entry => console.log(entry)),
    operators.switchMap(function () {
      return ImageService.load$(src);
    }), operators.takeUntil(this.unsubscribe$));
  };

  _proto.intersection$ = function intersection$(src) {
    var _this2 = this;

    var _getContext5 = rxcomp.getContext(this),
        node = _getContext5.node;

    var img = node.querySelector('img');
    return ImageService.load$(src).pipe(operators.switchMap(function (src) {
      LazyCache.set(_this2.lazyPicture, src);
      img.setAttribute('src', src);
      return IntersectionService.firstIntersection$(node);
    }), operators.takeUntil(this.unsubscribe$));
  };

  return LazyPictureDirective;
}(rxcomp.Directive);
LazyPictureDirective.meta = {
  selector: '[lazyPicture],[[lazyPicture]]',
  inputs: ['lazyPicture']
};var LazyDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(LazyDirective, _Directive);

  function LazyDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = LazyDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('lazy');
    this.src$ = new rxjs.Subject().pipe(operators.distinctUntilChanged(), operators.switchMap(function (src) {
      var data = LazyCache.get(src);

      if (data) {
        return rxjs.of(data);
      }

      node.classList.remove('lazyed');
      return _this.lazy$(src);
    }), operators.takeUntil(this.unsubscribe$));
    this.src$.subscribe(function (src) {
      LazyCache.set(_this.lazy, src);
      node.setAttribute('src', src);
      node.classList.add('lazyed');
      LocomotiveService.instance$.pipe(operators.first(), operators.delay(10)).subscribe(function (instance) {
        return instance.update();
      });
    });
  };

  _proto.onChanges = function onChanges() {
    this.src$.next(this.lazy);
  };

  _proto.lazy$ = function lazy$(src) {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    return IntersectionService.firstIntersection$(node).pipe( // tap(entry => console.log(entry)),
    operators.switchMap(function () {
      return ImageService.load$(src);
    }), operators.takeUntil(this.unsubscribe$));
  };

  return LazyDirective;
}(rxcomp.Directive);
LazyDirective.meta = {
  selector: '[lazy],[[lazy]]',
  inputs: ['lazy']
};var LocomotiveDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(LocomotiveDirective, _Directive);

  function LocomotiveDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = LocomotiveDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    LocomotiveService.locomotive$(node).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (scroll) {
      return _this.scroll = scroll;
    });
  };

  return LocomotiveDirective;
}(rxcomp.Directive);
LocomotiveDirective.meta = {
  selector: '[locomotive]'
};var ModalComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ModalComponent, _Component);

  function ModalComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ModalComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        parentInstance = _getContext.parentInstance;

    if (parentInstance instanceof ModalOutletComponent) {
      this.data = parentInstance.modal.data;
    }
  };

  _proto.close = function close() {
    ModalService.reject();
  };

  return ModalComponent;
}(rxcomp.Component);
ModalComponent.meta = {
  selector: '[modal]'
};var OverlayLerp = /*#__PURE__*/function () {
  function OverlayLerp() {
    this.x = this.ex = window.innerWidth / 2;
    this.y = this.ey = window.innerHeight / 2;
    this.dy = 0;
  }

  var _proto = OverlayLerp.prototype;

  _proto.tick = function tick(event) {
    if (event.clientX) {
      var inertia = this.inertia ? Number(this.inertia) : 0.01;
      var dy = 0; // this.dy;

      this.ex = event.clientX;
      this.ey = event.clientY;
      this.x += (this.ex - this.x) * inertia;
      this.y += (this.ey + dy - this.y) * inertia;
    }
  };

  return OverlayLerp;
}();

var OverlayEffectDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(OverlayEffectDirective, _Directive);

  function OverlayEffectDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto2 = OverlayEffectDirective.prototype;

  _proto2.onInit = function onInit() {
    var _this = this;

    this.raf$ = rxjs.interval(0, rxjs.animationFrame);
    this.move$ = rxjs.fromEvent(document, 'mousemove');
    this.lerp = new OverlayLerp();

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.animation$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (lerp) {
      node.style.transform = "translate3d(" + lerp.x + "px," + lerp.y + "px,0px)";
    });
    LocomotiveService.scroll$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      _this.lerp.dy = event.scroll.y;
    });
  };

  _proto2.animation$ = function animation$() {
    var _this2 = this;

    return this.raf$.pipe(operators.withLatestFrom(this.move$), operators.map(function (latest) {
      var lerp = _this2.lerp;
      lerp.tick(latest[1]);
      return lerp;
    }), operators.startWith(this.lerp));
  };

  return OverlayEffectDirective;
}(rxcomp.Directive);
OverlayEffectDirective.meta = {
  selector: "[overlay-effect]",
  inputs: ['inertia']
};
OverlayEffectDirective.rafWindow = rxjs.of(rxjs.animationFrame);var FRAGMENT_SHARED =
/* glsl */
"\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\nuniform float u_mx;\nuniform float u_my;\nuniform float u_speed;\nuniform float u_opacity;\n\nfloat random(vec2 st) {\n\treturn fract(sin(dot(st.xy + cos(u_time), vec2(12.9898 , 78.233))) * (43758.5453123));\n}\n\nvec2 coord(in vec2 p) {\n\tp = p / u_resolution.xy;\n    if (u_resolution.x > u_resolution.y) {\n        p.x *= u_resolution.x / u_resolution.y;\n        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;\n    } else {\n        p.y *= u_resolution.y / u_resolution.x;\n\t    p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;\n    }\n    p -= 0.5;\n    p *= vec2(-1.0, 1.0);\n\treturn p;\n}\n#define uv gl_FragCoord.xy / u_resolution.xy\n#define st coord(gl_FragCoord.xy)\n#define mx coord(vec2(u_mx, u_my))\n#define ee noise(gl_FragCoord.xy / u_resolution.xy)\n#define rx 1.0 / min(u_resolution.x, u_resolution.y)\n\nfloat sCircle(in vec2 p, in float w) {\n    return length(p) * 2.0 - w;\n}\n\nfloat sGradient(in vec2 p) {\n    return length(p);\n}\n";
var FRAGMENT_SHADER_1 = FRAGMENT_SHARED + "\nvoid main() {\n\tvec2 p = st - vec2(mx.x, mx.y * -1.0);\n\tvec3 color = vec3(1.0);\n\t// float noise = random(p) * 0.1;\n\t// color = vec3(clamp(0.0, 1.0, color.r - noise));\n\t// float circle = sCircle(p, 0.2 - 0.2 * u_speed + cos(u_time) * 0.1);\n\t// circle += sCircle(p, 0.05 - 0.05 * u_speed + cos(u_time) * 0.025);\n\tfloat circle = sCircle(p, 0.2 + cos(u_time) * 0.1);\n\tcircle += sCircle(p, 0.05 + cos(u_time) * 0.025);\n\tcircle = clamp(0.0, 1.0, circle);\n\t// float alpha = smoothstep(0.0, 0.99, 1.0 - circle) * (0.4 + cos(u_time) * 0.35);\n\tfloat alpha = smoothstep(0.0, 0.8, 1.0 - circle) * 0.6 * u_opacity;\n\tgl_FragColor = vec4(color, alpha);\n}\n";
var FRAGMENT_SHADER_2 = FRAGMENT_SHARED + "\nvoid main() {\n\tvec2 p = st - vec2(mx.x, mx.y * -1.0);\n\tvec3 color = vec3(0.0);\n\tfloat noise = random(p) * 0.1;\n\tcolor = vec3(clamp(0.0, 1.0, color.r + noise));\n\t// float circle = sCircle(p, 4.0 - 2.5 * u_speed + cos(u_time) * 0.05);\n\t// float circle = sGradient(p * (0.25 + 1.75 * u_speed));\n\tfloat circle = sGradient(p * 0.25);\n\tfloat alpha = clamp(0.0, 1.0, circle * 0.5) * u_opacity; // smoothstep(0.0, 0.99, circle) * 0.7;\n\tgl_FragColor = vec4(color, alpha);\n}\n";
var OverlayLerp$1 = /*#__PURE__*/function () {
  function OverlayLerp() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.x = this.ex = this.w / 2;
    this.y = this.ey = this.h / 2;
    this.speed = this.espeed = 0;
    this.opacity = 1;
    this.dy = 0;
    this.isOver = true;
  }

  var _proto = OverlayLerp.prototype;

  _proto.tick = function tick(event) {
    if (event.clientX) {
      var inertia = this.inertia ? Number(this.inertia) : 0.01;
      var dy = 0; // this.dy;

      this.ex = event.clientX;
      this.ey = event.clientY;
      this.x += (this.ex - this.x) * inertia;
      this.y += (this.ey + dy - this.y) * inertia;
      this.speed += (this.espeed - this.speed) * 0.01;
      this.opacity += ((this.isOver ? 1 : 0) - this.opacity) * 0.01;
    }
  };

  _proto.setSpeed = function setSpeed(speed) {
    this.espeed = Math.abs(speed / 50);
  };

  return OverlayLerp;
}();

var OverlayWebglDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(OverlayWebglDirective, _Directive);

  function OverlayWebglDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto2 = OverlayWebglDirective.prototype;

  _proto2.onInit = function onInit() {
    var _this = this;

    var lerp = this.lerp = new OverlayLerp$1();
    this.raf$ = rxjs.interval(0, rxjs.animationFrame);
    this.move$ = rxjs.fromEvent(document, 'mousemove');

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var canvas1 = document.createElement('canvas');
    node.appendChild(canvas1);
    var glsl1 = new window.glsl.Canvas(canvas1, {
      fragmentString: FRAGMENT_SHADER_1,
      premultipliedAlpha: false
    });
    var canvas2 = document.createElement('canvas');
    node.appendChild(canvas2);
    var glsl2 = new window.glsl.Canvas(canvas2, {
      fragmentString: FRAGMENT_SHADER_2,
      premultipliedAlpha: false
    });
    this.animation$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (lerp) {
      glsl1.setUniforms({
        'u_mx': lerp.x,
        'u_my': lerp.y,
        'u_speed': lerp.speed,
        'u_opacity': lerp.opacity
      });
      glsl2.setUniforms({
        'u_mx': lerp.x,
        'u_my': lerp.y,
        'u_speed': lerp.speed,
        'u_opacity': lerp.opacity
      });
    });
    LocomotiveService.scroll$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      _this.lerp.setSpeed(event.speed);

      _this.lerp.dy = event.scroll.y;
    });
  };

  _proto2.animation$ = function animation$() {
    var _this2 = this;

    return this.raf$.pipe(operators.withLatestFrom(this.move$), operators.map(function (event) {
      var lerp = _this2.lerp;
      lerp.tick(event[1]);
      return lerp;
    }), operators.startWith(this.lerp));
  };

  return OverlayWebglDirective;
}(rxcomp.Directive);
OverlayWebglDirective.meta = {
  selector: "[overlay-webgl]"
};
OverlayWebglDirective.rafWindow = rxjs.of(rxjs.animationFrame);var HttpResponse = /*#__PURE__*/function () {
  _createClass(HttpResponse, [{
    key: "static",
    get: function get() {
      return this.url.indexOf('.json') === this.url.length - 5;
    }
  }]);

  function HttpResponse(response) {
    this.data = null;

    if (response) {
      this.url = response.url;
      this.status = response.status;
      this.statusText = response.statusText;
      this.ok = response.ok;
      this.redirected = response.redirected;
    }
  }

  return HttpResponse;
}();

var HttpService = /*#__PURE__*/function () {
  function HttpService() {}

  HttpService.http$ = function http$(method, url, data, format) {
    var _this = this;

    if (format === void 0) {
      format = 'json';
    }

    method = url.indexOf('.json') !== -1 ? 'GET' : method;
    var methods = ['POST', 'PUT', 'PATCH'];
    var response_ = null;
    return rxjs.from(fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
    }).then(function (response) {
      response_ = new HttpResponse(response);
      return response[format]().then(function (json) {
        response_.data = json;

        if (response.ok) {
          return Promise.resolve(response_);
        } else {
          return Promise.reject(response_);
        }
      });
      /*
      if (response.ok) {
      	return response[format]();
      } else {
      	return response.json().then(json => {
      		return Promise.reject(json);
      	});
      }
      */
    })).pipe(operators.catchError(function (error) {
      return rxjs.throwError(_this.getError(error, response_));
    }));
  };

  HttpService.get$ = function get$(url, data, format) {
    var query = this.query(data);
    return this.http$('GET', "" + url + query, undefined, format);
  };

  HttpService.delete$ = function delete$(url) {
    return this.http$('DELETE', url);
  };

  HttpService.post$ = function post$(url, data) {
    return this.http$('POST', url, data);
  };

  HttpService.put$ = function put$(url, data) {
    return this.http$('PUT', url, data);
  };

  HttpService.patch$ = function patch$(url, data) {
    return this.http$('PATCH', url, data);
  };

  HttpService.query = function query(data) {
    return ''; // todo
  };

  HttpService.getError = function getError(object, response) {
    var error = typeof object === 'object' ? object : {};

    if (!error.statusCode) {
      error.statusCode = response ? response.status : 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = response ? response.statusText : object;
    }

    console.log('HttpService.getError', error, object);
    return error;
  };

  return HttpService;
}();var ApiService = /*#__PURE__*/function (_HttpService) {
  _inheritsLoose(ApiService, _HttpService);

  function ApiService() {
    return _HttpService.apply(this, arguments) || this;
  }

  ApiService.get$ = function get$(url, data, format) {
    return _HttpService.get$.call(this, getApiUrl(url), data, format);
  };

  ApiService.delete$ = function delete$(url) {
    return _HttpService.delete$.call(this, getApiUrl(url));
  };

  ApiService.post$ = function post$(url, data) {
    return _HttpService.post$.call(this, getApiUrl(url), data);
  };

  ApiService.put$ = function put$(url, data) {
    return _HttpService.put$.call(this, getApiUrl(url), data);
  };

  ApiService.patch$ = function patch$(url, data) {
    return _HttpService.patch$.call(this, getApiUrl(url), data);
  };

  ApiService.staticGet$ = function staticGet$(url, data, format) {
    return _HttpService.get$.call(this, getApiUrl(url, true), data, format);
  };

  ApiService.staticDelete$ = function staticDelete$(url) {
    return _HttpService.delete$.call(this, getApiUrl(url, true));
  };

  ApiService.staticPost$ = function staticPost$(url, data) {
    return _HttpService.post$.call(this, getApiUrl(url, true), data);
  };

  ApiService.staticPut$ = function staticPut$(url, data) {
    return _HttpService.put$.call(this, getApiUrl(url, true), data);
  };

  ApiService.staticPatch$ = function staticPatch$(url, data) {
    return _HttpService.patch$.call(this, getApiUrl(url, true), data);
  };

  return ApiService;
}(HttpService);var FilterMode = {
  SELECT: 'select',
  AND: 'and',
  OR: 'or'
};

var FilterItem = /*#__PURE__*/function () {
  _createClass(FilterItem, [{
    key: "empty",
    get: function get() {
      return this.values.length === 0;
    }
  }]);

  function FilterItem(filter) {
    this.change$ = new rxjs.BehaviorSubject();
    this.mode = FilterMode.SELECT;
    this.placeholder = 'Select';
    this.values = [];
    this.options = [];

    if (filter) {
      if (filter.mode === FilterMode.SELECT) {
        filter.options.unshift({
          label: filter.placeholder,
          values: []
        });
      }

      Object.assign(this, filter);
    }
  }

  var _proto = FilterItem.prototype;

  _proto.filter = function filter(item, value) {
    return true; // item.options.indexOf(value) !== -1;
  };

  _proto.match = function match(item) {
    var _this = this;

    var match;

    if (this.mode === FilterMode.OR) {
      match = this.values.length ? false : true;
      this.values.forEach(function (value) {
        match = match || _this.filter(item, value);
      });
    } else {
      match = true;
      this.values.forEach(function (value) {
        match = match && _this.filter(item, value);
      });
    }

    return match;
  };

  _proto.getSelectedOption = function getSelectedOption() {
    var _this2 = this;

    return this.options.find(function (x) {
      return _this2.has(x);
    });
  };

  _proto.getLabel = function getLabel() {
    if (this.mode === FilterMode.SELECT) {
      var selectedOption = this.getSelectedOption();
      return selectedOption ? selectedOption.label : this.placeholder;
    } else {
      return this.label;
    }
  };

  _proto.hasAny = function hasAny() {
    return this.values.length > 0;
  };

  _proto.has = function has(item) {
    return this.values.indexOf(item.value) !== -1;
  };

  _proto.set = function set(item) {
    if (this.mode === FilterMode.SELECT) {
      this.values = [];
    }

    var index = this.values.indexOf(item.value);

    if (index === -1) {
      if (item.value !== undefined) {
        this.values.push(item.value);
      }
    }

    if (this.mode === FilterMode.SELECT) {
      this.placeholder = item.label;
    } // console.log('FilterItem.set', item);


    this.change$.next();
  };

  _proto.remove = function remove(item) {
    var index = this.values.indexOf(item.value);

    if (index !== -1) {
      this.values.splice(index, 1);
    }

    if (this.mode === FilterMode.SELECT) {
      var first = this.options[0];
      this.placeholder = first.label;
    } // console.log('FilterItem.remove', item);


    this.change$.next();
  };

  _proto.toggle = function toggle(item) {
    if (this.has(item)) {
      this.remove(item);
    } else {
      this.set(item);
    }
  };

  _proto.toggleActive = function toggleActive() {
    this.active = !this.active;
  };

  _proto.clear = function clear() {
    this.values = [];

    if (this.mode === FilterMode.SELECT) {
      var first = this.options[0];
      this.placeholder = first.label;
    } // console.log('FilterItem.clear', item);


    this.change$.next();
  };

  return FilterItem;
}();var LocationService = /*#__PURE__*/function () {
  function LocationService() {}

  LocationService.get = function get(key) {
    var params = new URLSearchParams(window.location.search); // console.log('LocationService.get', params);

    return params.get(key);
  };

  LocationService.set = function set(keyOrValue, value) {
    var params = new URLSearchParams(window.location.search);

    if (typeof keyOrValue === 'string') {
      params.set(keyOrValue, value);
    } else {
      params.set(keyOrValue, '');
    }

    this.replace(params); // console.log('LocationService.set', params, keyOrValue, value);
  };

  LocationService.replace = function replace(params) {
    if (window.history && window.history.pushState) {
      var title = document.title;
      var url = window.location.href.split('?')[0] + "?" + params.toString();
      window.history.pushState(params.toString(), title, url);
    }
  };

  LocationService.deserialize = function deserialize(key) {
    var encoded = this.get('params');
    return this.decode(key, encoded);
  };

  LocationService.serialize = function serialize(keyOrValue, value) {
    var params = this.deserialize();
    var encoded = this.encode(keyOrValue, value, params);
    this.set('params', encoded);
  };

  LocationService.decode = function decode(key, encoded) {
    var decoded = null;

    if (encoded) {
      var json = window.atob(encoded);
      decoded = JSON.parse(json);
    }

    if (key && decoded) {
      decoded = decoded[key];
    }

    return decoded || null;
  };

  LocationService.encode = function encode(keyOrValue, value, params) {
    params = params || {};
    var encoded = null;

    if (typeof keyOrValue === 'string') {
      params[keyOrValue] = value;
    } else {
      params = keyOrValue;
    }

    var json = JSON.stringify(params);
    encoded = window.btoa(json);
    return encoded;
  };

  return LocationService;
}();var FilterService = /*#__PURE__*/function () {
  function FilterService(options, initialParams, callback) {
    var filters = {};
    this.filters = filters;

    if (options) {
      Object.keys(options).forEach(function (key) {
        var filter = new FilterItem(options[key]);

        if (typeof callback === 'function') {
          callback(key, filter);
        }

        filters[key] = filter;
      });
      this.deserialize(this.filters, initialParams);
    }
  }

  var _proto = FilterService.prototype;

  _proto.getParamsCount = function getParamsCount(params) {
    if (params) {
      var paramsCount = Object.keys(params).reduce(function (p, c, i) {
        var values = params[c];
        return p + (values ? values.length : 0);
      }, 0);
      return paramsCount;
    } else {
      return 0;
    }
  };

  _proto.deserialize = function deserialize(filters, initialParams) {
    var params;

    if (initialParams && this.getParamsCount(initialParams)) {
      params = initialParams;
    }

    var locationParams = LocationService.deserialize('filters');

    if (locationParams && this.getParamsCount(locationParams)) {
      params = locationParams;
    }

    if (params) {
      Object.keys(filters).forEach(function (key) {
        filters[key].values = params[key] || [];
      });
    }

    return filters;
  };

  _proto.serialize = function serialize(filters) {
    var params = {};
    var any = false;
    Object.keys(filters).forEach(function (x) {
      var filter = filters[x];

      if (filter.values && filter.values.length > 0) {
        params[x] = filter.values;
        any = true;
      }
    });

    if (!any) {
      params = null;
    } // console.log('FilterService.serialize', params);


    LocationService.serialize('filters', params);
    return params;
  };

  _proto.items$ = function items$(items) {
    var _this = this;

    var filters = this.filters;
    var changes = Object.keys(filters).map(function (key) {
      return filters[key].change$;
    });
    this.updateFilterStates(filters, items, true);
    return rxjs.merge.apply(void 0, changes).pipe(operators.auditTime(1), // tap(() => console.log(filters)),
    operators.tap(function () {
      return _this.serialize(filters);
    }), operators.map(function () {
      return _this.filterItems(items);
    }), operators.tap(function () {
      return _this.updateFilterStates(filters, items);
    }));
  };

  _proto.filterItems = function filterItems(items, skipFilter) {
    var _this2 = this;

    var filters = Object.keys(this.filters).map(function (x) {
      return _this2.filters[x];
    }).filter(function (x) {
      return x.values && x.values.length > 0;
    });
    items = items.filter(function (item) {
      var has = true;
      filters.forEach(function (filter) {
        if (filter !== skipFilter) {
          has = has && filter.match(item);
        }
      });
      return has;
    });
    return items;
  };

  _proto.updateFilterStates = function updateFilterStates(filters, items, initialCount) {
    var _this3 = this;

    Object.keys(filters).forEach(function (x) {
      var filter = filters[x];
      var filteredItems = initialCount ? items : _this3.filterItems(items, filter);
      filter.options.forEach(function (option) {
        var count = 0;

        if (option.value) {
          var i = 0;

          while (i < filteredItems.length) {
            var item = filteredItems[i];

            if (filter.filter(item, option.value)) {
              count++;
            }

            i++;
          }
        } else {
          count = filteredItems.length;
        }

        initialCount ? option.initialCount = count : option.count = count;
        option.disabled = count === 0;
      });

      if (initialCount) {
        filter.options.sort(function (a, b) {
          return b.initialCount - a.initialCount;
        });
      }
    });
  };

  return FilterService;
}();var PageComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(PageComponent, _Component);

  function PageComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = PageComponent.prototype;

  _proto.onInit = function onInit() {};

  return PageComponent;
}(rxcomp.Component);
PageComponent.meta = {
  selector: '[page]'
};var ProductsPageComponent = /*#__PURE__*/function (_PageComponent) {
  _inheritsLoose(ProductsPageComponent, _PageComponent);

  function ProductsPageComponent() {
    return _PageComponent.apply(this, arguments) || this;
  }

  var _proto = ProductsPageComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.items = [];
    this.filters = {};
    this.primaryFilters = {};
    this.secondaryFilters = {};
    this.moreFilters = false; // this.makeFake();

    this.load$().pipe(operators.first()).subscribe(function (data) {
      _this.items = data[0];
      _this.filters = data[1];

      _this.onLoad();

      _this.pushChanges();
    });
  };

  _proto.load$ = function load$() {
    return rxjs.combineLatest(ApiService.get$('/products/yachts-exteriors').pipe(operators.map(function (response) {
      return response.data;
    })), ApiService.get$('/products/filters').pipe(operators.map(function (response) {
      return response.data;
    })));
  };

  _proto.onLoad = function onLoad() {
    var _this2 = this;

    var items = this.items;
    var filters = this.filters;
    Object.keys(filters).forEach(function (key) {
      filters[key].mode = FilterMode.SELECT;
    });
    var initialParams = {};
    var filterService = new FilterService(filters, initialParams, function (key, filter) {
      switch (key) {
        default:
          filter.filter = function (item, value) {
            if (Array.isArray(item[key])) {
              return item[key].indexOf(value) !== -1;
            } else {
              return item[key] === value;
            } // return item.features.indexOf(value) !== -1;

          };

      }
    });
    this.filterService = filterService;
    this.filters = filterService.filters;
    Object.keys(this.filters).forEach(function (key) {
      if (_this2.filters[key].secondary) {
        _this2.secondaryFilters[key] = _this2.filters[key];
      } else {
        _this2.primaryFilters[key] = _this2.filters[key];
      }
    });
    filterService.items$(items).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (items) {
      _this2.items = items;

      _this2.pushChanges(); // console.log('MediaLibraryComponent.items', items.length);

    });
  };

  _proto.toggleFilter = function toggleFilter(filter) {
    var _this3 = this;

    Object.keys(this.filters).forEach(function (key) {
      var f = _this3.filters[key];

      if (f === filter) {
        f.active = !f.active;
      } else {
        f.active = false;
      }
    });
    this.pushChanges();
  };

  _proto.clearFilter = function clearFilter(event, filter) {
    event.preventDefault();
    event.stopImmediatePropagation();
    filter.clear();
    this.pushChanges();
  };

  _proto.onMoreFilters = function onMoreFilters(event) {
    this.moreFilters = !this.moreFilters;
    this.pushChanges();
  };

  _proto.makeFake = function makeFake() {
    ApiService.get$('/products/all').pipe(operators.first()).subscribe(function (response) {
      var filters = {};

      var addFilter = function addFilter(key, valueOrArray) {
        var filter = filters[key] ? filters[key] : filters[key] = {
          label: key,
          placeholder: "Scegli " + key,
          mode: 'or',
          options: []
        };
        valueOrArray = Array.isArray(valueOrArray) ? valueOrArray : [valueOrArray];
        valueOrArray.forEach(function (value) {
          if (!filter.options.find(function (x) {
            return x.value === value;
          })) {
            filter.options.push({
              label: value,
              value: value
            });
          }
        });
      };

      var items = response.data;
      items.forEach(function (x, i) {
        var splitKeys = ['lumen', 'watt', 'material', 'mounting', 'area'];
        splitKeys.forEach(function (key) {
          if (x[key].indexOf('/') !== -1) {
            x[key] = x[key].split('/').map(function (x) {
              return x.trim();
            });
          } else {
            x[key] = x[key].split(',').map(function (x) {
              return x.trim();
            });
          }
        });

        for (var k in x) {
          if (['catalogue', 'category', 'menu'].indexOf(k) === -1 && typeof x[k] === 'string' && x[k].indexOf('/') !== -1) {
            console.log(k, x[k]);
          }

          if (['id', 'name', 'catalogue', 'category', 'menu'].indexOf(k) === -1) {
            addFilter(k, x[k]);
          }
        }

        x.id = 1000 + i + 1;
        x.url = '/cantalupi/exclusive-yachts-interiors-top-series.html';
        x.image = "/cantalupi/img/exclusive-yachts-exteriors/0" + (1 + x.id % 4) + ".jpg";
        x.imageOver = "/cantalupi/img/exclusive-yachts-exteriors/01-over.jpg";
        x.category = 'Exclusive Yachts Exteriors';
        x.title = x.name;
        x.description = x.plus;
        x.power = x.watt + ' W';
        x.lumen = x.lumen + ' lumen';
      });
      console.log('filters', filters, JSON.stringify(filters, null, 2));
      var yachtsExteriors = items.filter(function (x) {
        return x.yachts && x.category.indexOf('Exteriors') !== -1;
      });
      var yachtsInteriors = items.filter(function (x) {
        return x.yachts && x.category.indexOf('Interiors') !== -1;
      });
      var villasExteriors = items.filter(function (x) {
        return x.villas && x.category.indexOf('Exteriors') !== -1;
      });
      var villasInteriors = items.filter(function (x) {
        return x.villas && x.category.indexOf('Interiors') !== -1;
      });
      console.log('yachtsExteriors', yachtsExteriors, JSON.stringify(yachtsExteriors, null, 2));
      console.log('yachtsInteriors', yachtsInteriors, JSON.stringify(yachtsInteriors, null, 2));
      console.log('villasExteriors', villasExteriors, JSON.stringify(villasExteriors, null, 2));
      console.log('villasInteriors', villasInteriors, JSON.stringify(villasInteriors, null, 2));
    });
  };

  return ProductsPageComponent;
}(PageComponent);
ProductsPageComponent.meta = {
  selector: '[products-page]'
};var ScrollToDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ScrollToDirective, _Directive);

  function ScrollToDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ScrollToDirective.prototype;

  _proto.onInit = function onInit() {
    this.initialFocus = false;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var expression = this.expression = node.getAttribute("(scrollTo)");
    this.outputFunction = module.makeFunction(expression, ['$event']);
    this.scrollTo$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {});
  };

  _proto.scrollTo$ = function scrollTo$() {
    var _this = this;

    var _getContext2 = rxcomp.getContext(this),
        module = _getContext2.module,
        node = _getContext2.node,
        parentInstance = _getContext2.parentInstance;

    return rxjs.fromEvent(node, 'click').pipe(operators.tap(function (event) {
      var result = module.resolve(_this.outputFunction, parentInstance, event);

      if (typeof result === 'string') {
        var target = document.querySelector(result);

        if (target) {
          var from = _this.currentTop();

          var to = from + target.getBoundingClientRect().top - 50;
          var o = {
            pow: 0
          };
          var html = document.querySelector('html');
          gsap.set(html, {
            'scroll-behavior': 'auto'
          });
          gsap.to(o, Math.abs(to - from) / 2000, {
            pow: 1,
            ease: Quad.easeOut,
            overwrite: 'all',
            onUpdate: function onUpdate() {
              window.scrollTo(0, from + (to - from) * o.pow);
            },
            onComplete: function onComplete() {
              gsap.set(html, {
                'scroll-behavior': 'smooth'
              });
            }
          });
        }
      }
    }), operators.shareReplay(1));
  };

  _proto.currentTop = function currentTop() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset; // Internet Explorer 6 - standards mode

    if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6, 7 and 8

    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
  };

  return ScrollToDirective;
}(rxcomp.Directive);
ScrollToDirective.meta = {
  selector: "[(scrollTo)]"
};var DownloadService = /*#__PURE__*/function () {
  function DownloadService() {}

  DownloadService.download = function download(blob, fileName) {
    if (fileName === void 0) {
      fileName = 'download.txt';
    }

    // var json = JSON.stringify(data),
    // blob = new Blob([json], {type: "octet/stream"}),
    var url = window.URL.createObjectURL(blob);
    var a = this.a;
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  _createClass(DownloadService, null, [{
    key: "a",
    get: function get() {
      var a = this.a_;

      if (!a) {
        a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        this.a_ = a;
      }

      return a;
    }
  }]);

  return DownloadService;
}();var LocalStorageService = /*#__PURE__*/function () {
  function LocalStorageService() {}

  LocalStorageService.delete = function _delete(name) {
    if (this.isLocalStorageSupported()) {
      window.localStorage.removeItem(name);
    }
  };

  LocalStorageService.exist = function exist(name) {
    if (this.isLocalStorageSupported()) {
      return window.localStorage[name] !== undefined;
    }
  };

  LocalStorageService.get = function get(name) {
    var value = null;

    if (this.isLocalStorageSupported() && window.localStorage[name] !== undefined) {
      try {
        value = JSON.parse(window.localStorage[name]);
      } catch (e) {
        console.log('LocalStorageService.get.error parsing', name, e);
      }
    }

    return value;
  };

  LocalStorageService.set = function set(name, value) {
    if (this.isLocalStorageSupported()) {
      try {
        var cache = [];
        var json = JSON.stringify(value, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }

            cache.push(value);
          }

          return value;
        });
        window.localStorage.setItem(name, json);
      } catch (e) {
        console.log('LocalStorageService.set.error serializing', name, value, e);
      }
    }
  };

  LocalStorageService.isLocalStorageSupported = function isLocalStorageSupported() {
    if (this.supported) {
      return true;
    }

    var supported = false;

    try {
      supported = 'localStorage' in window && window.localStorage !== null;

      if (supported) {
        window.localStorage.setItem('test', '1');
        window.localStorage.removeItem('test');
      } else {
        supported = false;
      }
    } catch (e) {
      supported = false;
    }

    this.supported = supported;
    return supported;
  };

  return LocalStorageService;
}();var User = /*#__PURE__*/function () {
  _createClass(User, [{
    key: "avatar",
    get: function get() {
      return (this.firstName || '?').substr(0, 1).toUpperCase() + (this.lastName || '?').substr(0, 1).toUpperCase();
    }
  }, {
    key: "fullName",
    get: function get() {
      return this.firstName + ' ' + this.lastName;
    }
  }]);

  function User(data) {
    if (data) {
      Object.assign(this, data);
    }
  }

  return User;
}();

var UserService = /*#__PURE__*/function () {
  function UserService() {}

  UserService.getCurrentUser = function getCurrentUser() {
    return this.user$_.getValue();
  };

  UserService.setUser = function setUser(user) {
    this.user$_.next(user);
  };

  UserService.me$ = function me$() {
    var _this = this;

    //return ApiService.staticGet$(`/user/me`).pipe(
    return ApiService.get$("/user/me").pipe( // map((user) => this.mapStatic__(user, 'me')),
    operators.map(function (response) {
      return _this.mapUser(response.data, response.static);
    }), operators.catchError(function (error) {
      return rxjs.of(null);
    }), operators.switchMap(function (user) {
      _this.setUser(user);

      return _this.user$_;
    }));
  };

  UserService.register$ = function register$(payload) {
    var _this2 = this;

    return ApiService.staticPost$("/user/register", payload).pipe(operators.map(function (response) {
      return _this2.mapStatic__(response.data, response.static, 'register');
    }));
  };

  UserService.login$ = function login$(payload) {
    var _this3 = this;

    return ApiService.staticPost$("/user/login", payload).pipe(operators.map(function (response) {
      return _this3.mapStatic__(response.data, response.static, 'login');
    }));
  };

  UserService.logout$ = function logout$() {
    var _this4 = this;

    return ApiService.staticPost$("/user/logout").pipe(operators.map(function (response) {
      return _this4.mapStatic__(response.data, response.static, 'logout');
    }));
  };

  UserService.retrieve$ = function retrieve$(payload) {
    var _this5 = this;

    return ApiService.staticPost$("/user/retrievepassword", payload).pipe(operators.map(function (response) {
      return _this5.mapStatic__(response.data, response.static, 'retrieve');
    }));
  };

  UserService.update$ = function update$(payload) {
    var _this6 = this;

    return ApiService.staticPost$("/user/updateprofile", payload).pipe(operators.map(function (response) {
      return _this6.mapStatic__(response.data, response.static, 'register');
    }));
  };

  UserService.mapStatic__ = function mapStatic__(user, isStatic, action) {
    if (action === void 0) {
      action = 'me';
    }

    if (!isStatic) {
      return user;
    }

    switch (action) {
      case 'me':
        if (!LocalStorageService.exist('user')) {
          user = null;
        }
        break;

      case 'register':
        LocalStorageService.set('user', user);
        break;

      case 'login':
        LocalStorageService.set('user', user);
        break;

      case 'logout':
        LocalStorageService.delete('user');
        break;
    }

    return user;
  };

  UserService.fake = function fake(user) {
    user.firstName = user.firstName || 'Jhon';
    user.lastName = user.lastName || 'Appleseed';
    return user;
  };

  UserService.mapUser = function mapUser(user, isStatic) {
    return isStatic ? UserService.fake(new User(user)) : new User(user);
  };

  UserService.mapUsers = function mapUsers(users, isStatic) {
    return users ? users.map(function (x) {
      return UserService.mapUser(x, isStatic);
    }) : [];
  };

  return UserService;
}();
UserService.user$_ = new rxjs.BehaviorSubject(null);var src$2 = STATIC ? '/tiemme-com/club-modal.html' : '/Viewdoc.cshtml?co_id=23649';

var SecureDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(SecureDirective, _Directive);

  function SecureDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = SecureDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.href = node.getAttribute('href');
    rxjs.fromEvent(node, 'click').pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      event.preventDefault();

      _this.tryDownloadHref();
    });
  };

  _proto.onChanges = function onChanges() {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    this.href = node.getAttribute('href');
  };

  _proto.tryDownloadHref = function tryDownloadHref() {
    var _this2 = this;

    ApiService.staticGet$(this.href, undefined, 'blob').pipe(operators.first(), operators.map(function (response) {
      return response.data;
    })).subscribe(function (blob) {
      DownloadService.download(blob, _this2.href.split('/').pop());
    }, function (error) {
      console.log(error);

      _this2.onLogin(event);
    });
  };

  _proto.onLogin = function onLogin(event) {
    var _this3 = this;

    // console.log('SecureDirective.onLogin');
    // event.preventDefault();
    ModalService.open$({
      src: src$2,
      data: {
        view: 1
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      // console.log('SecureDirective.onLogin', event);
      if (event instanceof ModalResolveEvent) {
        UserService.setUser(event.data);

        _this3.tryDownloadHref();
      }
    }); // this.pushChanges();
  }
  /*
  onRegister(event) {
  	// console.log('SecureDirective.onRegister');
  	// event.preventDefault();
  	ModalService.open$({ src: src, data: { view: 2 } }).pipe(
  		takeUntil(this.unsubscribe$)
  	).subscribe(event => {
  		// console.log('SecureDirective.onRegister', event);
  		if (event instanceof ModalResolveEvent) {
  			UserService.setUser(event.data);
  		}
  	});
  	// this.pushChanges();
  }
  */
  ;

  return SecureDirective;
}(rxcomp.Directive);
SecureDirective.meta = {
  selector: '[secure]'
};var ShareComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ShareComponent, _Component);

  function ShareComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ShareComponent.prototype;

  _proto.onInit = function onInit() {
    console.log('ShareComponent.onInit', this.share, this.title);
  };

  _proto.onChanges = function onChanges() {
    console.log('ShareComponent.onChanges', this.share, this.title);
  };

  _proto.getTitle = function getTitle() {
    var title = this.title ? this.title : document.title;
    return this.encodeURI(title);
  };

  _proto.getUrl = function getUrl() {
    var url = this.url;

    if (url) {
      if (url.indexOf(window.location.origin) === -1) {
        url = window.location.origin + (url.indexOf('/') === 0 ? url : '/' + url);
      }
    } else {
      url = window.location.href;
    }

    return this.encodeURI(url);
  };

  _proto.encodeURI = function encodeURI(text) {
    return encodeURIComponent(text).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

  _createClass(ShareComponent, [{
    key: "facebookUrl",
    get: function get() {
      return "https://www.facebook.com/sharer/sharer.php?u=" + this.getUrl();
    }
  }, {
    key: "linkedInUrl",
    get: function get() {
      return "https://www.linkedin.com/shareArticle?mini=true&url=" + this.getUrl() + "&title=" + this.getTitle();
    }
  }, {
    key: "twitterUrl",
    get: function get() {
      return "https://twitter.com/home?status=" + this.getUrl();
    }
  }, {
    key: "whatsappUrl",
    get: function get() {
      return "https://api.whatsapp.com/send?text=" + this.getUrl();
    }
  }, {
    key: "mailToUrl",
    get: function get() {
      return "mailto:?subject=" + this.getTitle() + "&body=" + this.getUrl();
    }
  }]);

  return ShareComponent;
}(rxcomp.Component);
ShareComponent.meta = {
  selector: '[share]',
  inputs: ['share', 'title'],
  template: "\n\t<ul class=\"nav--share\">\n\t\t<li>\n\t\t\t<a [href]=\"facebookUrl\" target=\"_blank\"><svg class=\"facebook\"><use xlink:href=\"#facebook\"></use></svg></a>\n\t\t</li>\n\t\t<li>\n\t\t\t<a [href]=\"linkedInUrl\" target=\"_blank\"><svg class=\"linkedin\"><use xlink:href=\"#linkedin\"></use></svg></a>\n\t\t</li>\n\t\t<li>\n\t\t\t<a [href]=\"twitterUrl\" target=\"_blank\"><svg class=\"twitter\"><use xlink:href=\"#twitter\"></use></svg></a>\n\t\t</li>\n\t\t<li>\n\t\t\t<a [href]=\"whatsappUrl\" target=\"_blank\"><svg class=\"whatsapp\"><use xlink:href=\"#whatsapp\"></use></svg></a>\n\t\t</li>\n\t\t<li>\n\t\t\t<a [href]=\"mailToUrl\"><svg class=\"email\"><use xlink:href=\"#email\"></use></svg></a>\n\t\t</li>\n\t</ul>\n\t"
};var DragPoint = function DragPoint() {
  this.x = 0;
  this.y = 0;
};
var DragEvent = function DragEvent(options) {
  if (options) {
    Object.assign(this, options);
  }
};
var DragDownEvent = /*#__PURE__*/function (_DragEvent) {
  _inheritsLoose(DragDownEvent, _DragEvent);

  function DragDownEvent(options) {
    var _this;

    _this = _DragEvent.call(this, options) || this;
    _this.distance = new DragPoint();
    _this.strength = new DragPoint();
    _this.speed = new DragPoint();
    return _this;
  }

  return DragDownEvent;
}(DragEvent);
var DragMoveEvent = /*#__PURE__*/function (_DragEvent2) {
  _inheritsLoose(DragMoveEvent, _DragEvent2);

  function DragMoveEvent(options) {
    var _this2;

    _this2 = _DragEvent2.call(this, options) || this;
    _this2.distance = new DragPoint();
    _this2.strength = new DragPoint();
    _this2.speed = new DragPoint();
    return _this2;
  }

  return DragMoveEvent;
}(DragEvent);
var DragUpEvent = /*#__PURE__*/function (_DragEvent3) {
  _inheritsLoose(DragUpEvent, _DragEvent3);

  function DragUpEvent(options) {
    return _DragEvent3.call(this, options) || this;
  }

  return DragUpEvent;
}(DragEvent);

var DragService = /*#__PURE__*/function () {
  function DragService() {}

  DragService.getPosition = function getPosition(event, point) {
    if (event instanceof MouseEvent) {
      point ? (point.x = event.clientX, point.y = event.clientY) : point = {
        x: event.clientX,
        y: event.clientY
      };
    } else if (event instanceof TouchEvent) {
      if (event.touches.length > 0) {
        point ? (point.x = event.touches[0].pageX, point.y = event.touches[0].pageY) : point = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY
        };
      }
    }

    return point;
  };

  DragService.down$ = function down$(target, events$) {
    var _this3 = this;

    var downEvent;
    return rxjs.merge(rxjs.fromEvent(target, 'mousedown'), rxjs.fromEvent(target, 'touchstart')).pipe(operators.map(function (event) {
      downEvent = downEvent || new DragDownEvent();
      downEvent.node = target;
      downEvent.target = event.target;
      downEvent.originalEvent = event;
      downEvent.down = _this3.getPosition(event, downEvent.down);

      if (downEvent.down) {
        downEvent.distance = new DragPoint();
        downEvent.strength = new DragPoint();
        downEvent.speed = new DragPoint();
        events$.next(downEvent);
        return downEvent;
      }
    }), operators.filter(function (event) {
      return event !== undefined;
    }));
  };

  DragService.move$ = function move$(target, events$, dismiss$, downEvent) {
    var _this4 = this;

    var moveEvent;
    return rxjs.fromEvent(document, downEvent.originalEvent instanceof MouseEvent ? 'mousemove' : 'touchmove').pipe(operators.startWith(downEvent), operators.map(function (event) {
      moveEvent = moveEvent || new DragMoveEvent();
      moveEvent.node = target;
      moveEvent.target = event.target;
      moveEvent.originalEvent = event;
      moveEvent.position = _this4.getPosition(event, moveEvent.position);
      var dragging = downEvent.down !== undefined && moveEvent.position !== undefined;

      if (dragging) {
        moveEvent.distance.x = moveEvent.position.x - downEvent.down.x;
        moveEvent.distance.y = moveEvent.position.y - downEvent.down.y;
        moveEvent.strength.x = moveEvent.distance.x / window.innerWidth * 2;
        moveEvent.strength.y = moveEvent.distance.y / window.innerHeight * 2;
        moveEvent.speed.x = downEvent.speed.x + (moveEvent.strength.x - downEvent.strength.x) * 0.1;
        moveEvent.speed.y = downEvent.speed.y + (moveEvent.strength.y - downEvent.strength.y) * 0.1;
        downEvent.distance.x = moveEvent.distance.x;
        downEvent.distance.y = moveEvent.distance.y;
        downEvent.speed.x = moveEvent.speed.x;
        downEvent.speed.y = moveEvent.speed.y;
        downEvent.strength.x = moveEvent.strength.x;
        downEvent.strength.y = moveEvent.strength.y;
        events$.next(moveEvent);
        return moveEvent;
      }
    }));
  };

  DragService.up$ = function up$(target, events$, dismiss$, downEvent) {
    var upEvent;
    return rxjs.fromEvent(document, downEvent.originalEvent instanceof MouseEvent ? 'mouseup' : 'touchend').pipe(operators.map(function (event) {
      upEvent = upEvent || new DragUpEvent();
      events$.next(upEvent);
      dismiss$.next(); // console.log(downEvent.distance);

      if (Math.abs(downEvent.distance.x) > 10) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return upEvent;
    }));
  };

  DragService.events$ = function events$(target) {
    var _this5 = this;

    target = target || document;
    var events$ = new rxjs.ReplaySubject(1);
    var dismiss$ = new rxjs.Subject();
    return this.down$(target, events$).pipe(operators.switchMap(function (downEvent) {
      return rxjs.merge(_this5.move$(target, events$, dismiss$, downEvent), _this5.up$(target, events$, dismiss$, downEvent)).pipe(operators.takeUntil(dismiss$));
    }), operators.switchMap(function () {
      return events$;
    }));
  };

  return DragService;
}();var SliderComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(SliderComponent, _Component);

  function SliderComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = SliderComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.container = node;
    this.wrapper = node.querySelector('.slider__wrapper');
    setTimeout(function () {
      // this.change.next(this.current);

      /*
      gsap.set(this.wrapper, {
      	x: -100 * this.current + '%',
      });
      */
      _this.slider$().pipe(operators.takeUntil(_this.unsubscribe$)).subscribe(function (event) {// console.log('dragService', event);
      });
    }, 1);
  };

  _proto.slider$ = function slider$() {
    var _this2 = this;

    var transformX = 0,
        transformY = 0,
        transformZ = 0,
        distanceX = 0,
        distanceY = 0,
        initialTransformX;
    return DragService.events$(this.wrapper).pipe(operators.tap(function (event) {
      if (event instanceof DragDownEvent) {
        var translation = _this2.getTranslation(_this2.wrapper, _this2.container);

        initialTransformX = translation.x;
      } else if (event instanceof DragMoveEvent) {
        _this2.container.classList.add('dragging');

        distanceX = event.distance.x;
        distanceY = event.distance.y;
        transformX = initialTransformX + event.distance.x;
        _this2.wrapper.style.transform = "translate3d(" + transformX + "px, " + transformY + "px, " + transformZ + "px)";
      } else if (event instanceof DragUpEvent) {
        _this2.container.classList.remove('dragging');

        _this2.wrapper.style.transform = null;
        var width = _this2.container.offsetWidth;

        if (distanceX * -1 > width * 0.25 && _this2.hasNext()) {
          _this2.navTo(_this2.current + 1);
        } else if (distanceX * -1 < width * -0.25 && _this2.hasPrev()) {
          _this2.navTo(_this2.current - 1);
        } else {
          _this2.wrapper.style.transform = "translate3d(" + -100 * _this2.current + "%, 0, 0)"; // this.navTo(this.current);
        } // this.navTo(current);

      }
    }));
  };

  _proto.tweenTo = function tweenTo(current, callback) {
    var _this3 = this;

    // console.log('tweenTo', current);
    var container = this.container;
    var wrapper = this.wrapper;
    var width = this.container.offsetWidth;
    gsap.to(wrapper, 0.50, {
      x: -100 * current + '%',
      delay: 0,
      ease: Power3.easeInOut,
      overwrite: 'all',
      onUpdate: function onUpdate() {
        _this3.tween.next();
      },
      onComplete: function onComplete() {
        if (typeof callback === 'function') {
          callback();
        }
      }
    });
  };

  _proto.navTo = function navTo(current) {
    this.current = current; // console.log('SliderCompoentn.navTo', current);

    this.pushChanges();
    /*
    if (this.current !== current) {
    	this.tweenTo(current, () => {
    		this.current = current;
    		this.pushChanges();
    		this.change.next(this.current);
    	});
    }
    */
  };

  _proto.hasPrev = function hasPrev() {
    return this.current - 1 >= 0;
  };

  _proto.hasNext = function hasNext() {
    return this.current + 1 < this.items.length;
  };

  _proto.getTranslation = function getTranslation(node, container) {
    var x = 0,
        y = 0,
        z = 0;
    var transform = node.style.transform;

    if (transform) {
      var coords = transform.split('(')[1].split(')')[0].split(',');
      x = parseFloat(coords[0]);
      y = parseFloat(coords[1]);
      z = parseFloat(coords[2]);
      x = coords[0].indexOf('%') !== -1 ? x *= container.offsetWidth * 0.01 : x;
      y = coords[1].indexOf('%') !== -1 ? y *= container.offsetHeight * 0.01 : y;
    }

    return {
      x: x,
      y: y,
      z: z
    };
  };

  _createClass(SliderComponent, [{
    key: "items",
    get: function get() {
      return this.items_ || [];
    },
    set: function set(items) {
      if (this.items_ !== items) {
        this.items_ = items;
      }
    }
  }, {
    key: "current",
    get: function get() {
      return this.state.current || 0;
    },
    set: function set(current) {
      if (current === void 0) {
        current = 0;
      }

      if (this.state.current !== current) {
        this.state.current = current;
        this.change.next(current);
      } // this.state.current = Math.min(current, items ? items.length - 1 : 0);

    }
  }, {
    key: "state",
    get: function get() {
      if (!this.state_) {
        this.state_ = {
          current: 0
        };
      }

      return this.state_;
    }
  }]);

  return SliderComponent;
}(rxcomp.Component);
SliderComponent.meta = {
  selector: '[slider]',
  inputs: ['items', 'current'],
  outputs: ['change', 'tween']
};var SliderServiceComponent = /*#__PURE__*/function (_SliderComponent) {
  _inheritsLoose(SliderServiceComponent, _SliderComponent);

  function SliderServiceComponent() {
    return _SliderComponent.apply(this, arguments) || this;
  }

  var _proto = SliderServiceComponent.prototype;

  _proto.onInit = function onInit() {
    _SliderComponent.prototype.onInit.call(this);

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.items = Array.prototype.slice.call(node.querySelectorAll('.slider__slide')).map(function (node, index) {
      var image = node.querySelector('img');
      var title = image.getAttribute('title') || image.getAttribute('alt');
      var url = image.getAttribute('lazy');
      return {
        node: node,
        url: url,
        title: title,
        id: index + 10000001
      };
    });
    this.title = node.querySelector('.title').innerText;
    console.log('SliderServiceComponent.onInit', this.items);
  };

  _createClass(SliderServiceComponent, [{
    key: "current",
    get: function get() {
      return this.state.current || 0;
    },
    set: function set(current) {
      if (current === void 0) {
        current = 0;
      }

      if (this.state.current !== current) {
        this.state.current = current;
        this.title = this.items[current].title;
        this.change.next(current);
      }
    }
  }, {
    key: "currentLabel",
    get: function get() {
      return this.current + 1;
    }
  }, {
    key: "totalLabel",
    get: function get() {
      return this.items.length;
    }
  }]);

  return SliderServiceComponent;
}(SliderComponent);
SliderServiceComponent.meta = {
  selector: '[slider-service]',
  outputs: ['change', 'tween']
};var SlugPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(SlugPipe, _Pipe);

  function SlugPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  SlugPipe.transform = function transform(value) {
    return getSlug(value);
  };

  return SlugPipe;
}(rxcomp.Pipe);
SlugPipe.meta = {
  name: 'slug'
};var VirtualItem = /*#__PURE__*/function (_Context) {
  _inheritsLoose(VirtualItem, _Context);

  function VirtualItem(key, $key, value, $value, index, count, parentInstance) {
    var _this;

    _this = _Context.call(this, parentInstance) || this;
    _this[key] = $key;
    _this[value] = $value;
    _this.index = index;
    _this.count = count;
    return _this;
  }

  _createClass(VirtualItem, [{
    key: "first",
    get: function get() {
      return this.index === 0;
    }
  }, {
    key: "last",
    get: function get() {
      return this.index === this.count - 1;
    }
  }, {
    key: "even",
    get: function get() {
      return this.index % 2 === 0;
    }
  }, {
    key: "odd",
    get: function get() {
      return !this.even;
    }
  }]);

  return VirtualItem;
}(rxcomp.Context);var VirtualMode = {
  Responsive: 1,
  Grid: 2,
  Centered: 3,
  List: 4
};

var VirtualStructure = /*#__PURE__*/function (_Structure) {
  _inheritsLoose(VirtualStructure, _Structure);

  function VirtualStructure() {
    return _Structure.apply(this, arguments) || this;
  }

  var _proto = VirtualStructure.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var template = node.firstElementChild;
    var expression = node.getAttribute('*virtual');
    node.removeAttribute('*virtual');
    node.removeChild(template);
    var tokens = this.tokens = this.getExpressionTokens(expression);
    this.virtualFunction = module.makeFunction(tokens.iterable);
    this.container = node;
    this.template = template;
    this.mode = this.mode || 1;
    this.width = this.width || 250;
    this.gutter = this.gutter !== undefined ? this.gutter : 20;
    this.options = {
      top: 0,
      width: this.width,
      gutter: this.gutter,
      containerWidth: 0,
      containerHeight: 0,
      cols: [0],
      strategy: 1
    };
    this.cachedRects = {};
    this.cachedInstances = [];
    this.cacheNodes = [];
    this.items$ = new rxjs.BehaviorSubject([]);
    this.update$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (visibleItems) {// console.log(visibleItems.length);
    });
  };

  _proto.onChanges = function onChanges(changes) {
    var context = rxcomp.getContext(this);
    var module = context.module; // resolve

    var items = module.resolve(this.virtualFunction, context.parentInstance, this) || [];
    this.mode = this.mode || 1;
    this.width = this.width || 250;
    this.gutter = this.gutter !== undefined ? this.gutter : 20;
    this.options.width = this.width;
    this.updateView(true);
    this.items$.next(items);
  };

  _proto.update$ = function update$() {
    var _this = this;

    return rxjs.merge(this.scroll$(), this.resize$(), this.items$).pipe(operators.map(function (datas) {
      var options = _this.options;

      var items = _this.items$.getValue();

      var total = items.length;
      _this.container.position = 'relative';
      var highestHeight = 0;

      var width = _this.getWidth();

      var gutter = _this.getGutter(width);

      var visibleItems = items.filter(function (item, i) {
        var col, height, top, left, bottom;
        var rect = _this.cachedRects[i];

        if (rect) {
          col = rect.col;
          height = rect.height;
          left = rect.left; // top = rect.top;
          // bottom = rect.bottom;
        } else {
          col = _this.getCol();
          height = _this.getHeight(width, item);
        }

        top = options.cols[col];

        if (_this.intersect(top + options.top, top + height + options.top, 0, options.containerHeight)) {
          if (!rect) {
            left = _this.getLeft(col, width, gutter);
          }

          var node = _this.cachedNode(i, i, item, total);

          node.style.position = 'absolute';
          node.style.top = top + 'px';
          node.style.left = left + 'px';
          node.style.width = width + 'px';

          if (height !== node.offsetHeight) {
            height = node.offsetHeight;
          }

          bottom = top + height + options.gutter;
          highestHeight = Math.max(highestHeight, bottom);
          options.cols[col] = bottom;

          if (!rect) {
            _this.cachedRects[i] = {
              col: col,
              width: width,
              height: height,
              left: left,
              top: top,
              bottom: bottom
            };
          } else {
            rect.height = height;
            rect.bottom = bottom;
          }

          return true;
        } else {
          _this.removeNode(i);

          bottom = top + height + options.gutter;
          options.cols[col] = bottom;
          highestHeight = Math.max(highestHeight, bottom);
          return false;
        }
      });
      var removeIndex = items.length;

      while (removeIndex < _this.cacheNodes.length) {
        _this.removeNode(removeIndex);

        removeIndex++;
      }

      _this.cacheNodes.length = items.length;
      _this.container.style.height = highestHeight + "px";
      return visibleItems;
    }));
  };

  _proto.getCols = function getCols() {
    var options = this.options;
    var cols = Math.floor((options.containerWidth + options.gutter) / (options.width + options.gutter)) || 1;
    return new Array(cols).fill(0);
  };

  _proto.getCol = function getCol() {
    var options = this.options;
    var col;

    switch (this.mode) {
      case VirtualMode.Grid:
      case VirtualMode.Centered:
      case VirtualMode.Responsive:
        col = options.cols.reduce(function (p, c, i, a) {
          return c < a[p] ? i : p;
        }, 0);
        break;

      case VirtualMode.List:
      default:
        col = 0;
    }

    return col;
  };

  _proto.getWidth = function getWidth() {
    var options = this.options;
    var width;

    switch (this.mode) {
      case VirtualMode.Grid:
      case VirtualMode.Centered:
        width = options.width;
        break;

      case VirtualMode.Responsive:
        width = (options.containerWidth - (options.cols.length - 1) * options.gutter) / options.cols.length;
        break;

      case VirtualMode.List:
      default:
        width = options.containerWidth;
    }

    return width;
  };

  _proto.getHeight = function getHeight(width, item) {
    var options = this.options;
    var height;

    switch (this.mode) {
      case VirtualMode.Grid:
      case VirtualMode.Centered:
      case VirtualMode.Responsive:
        height = options.width;
        break;

      case VirtualMode.List:
      default:
        height = 80;
    }

    return height;
  };

  _proto.getGutter = function getGutter(width) {
    var options = this.options;
    var gutter;

    switch (this.mode) {
      case VirtualMode.Grid:
      case VirtualMode.Centered:
        gutter = options.gutter;
        break;

      case VirtualMode.Responsive:
        gutter = (options.containerWidth - options.cols.length * width) / (options.cols.length - 1);
        break;

      case VirtualMode.List:
      default:
        gutter = 0;
    }

    return gutter;
  };

  _proto.getLeft = function getLeft(index, width, gutter) {
    var options = this.options;
    var left;

    switch (this.mode) {
      case VirtualMode.Grid:
      case VirtualMode.Responsive:
        left = index * (width + gutter);
        break;

      case VirtualMode.Centered:
        left = (options.containerWidth - options.cols.length * (width + gutter) + gutter) / 2 + index * (width + gutter);
        break;

      case VirtualMode.List:
      default:
        left = 0;
    }

    return left;
  };

  _proto.cachedNode = function cachedNode(index, i, value, total) {
    if (this.cacheNodes[index]) {
      return this.updateNode(index, i, value);
    } else {
      return this.createNode(index, i, value, total);
    }
  };

  _proto.createNode = function createNode(index, i, value, total) {
    var clonedNode = this.template.cloneNode(true);
    delete clonedNode.rxcompId;
    this.container.appendChild(clonedNode);
    this.cacheNodes[index] = clonedNode;
    var context = rxcomp.getContext(this);
    var module = context.module;
    var tokens = this.tokens;
    var args = [tokens.key, i, tokens.value, value, i, total, context.parentInstance];
    var instance = module.makeInstance(clonedNode, VirtualItem, context.selector, context.parentInstance, args);
    var forItemContext = rxcomp.getContext(instance);
    module.compile(clonedNode, forItemContext.instance);
    this.cachedInstances[index] = instance;
    return clonedNode;
  };

  _proto.updateNode = function updateNode(index, i, value) {
    var instance = this.cachedInstances[index];
    var tokens = this.tokens;

    if (instance[tokens.key] !== i) {
      instance[tokens.key] = i;
      instance[tokens.value] = value;
      instance.pushChanges();
    } // console.log(index, i, value);


    return this.cacheNodes[index];
  };

  _proto.removeNode = function removeNode(index) {
    this.cachedInstances[index] = undefined;
    var node = this.cacheNodes[index];

    if (node) {
      var context = rxcomp.getContext(this);
      var module = context.module;
      node.parentNode.removeChild(node);
      module.remove(node);
    }

    this.cacheNodes[index] = undefined;
    return node;
  };

  _proto.intersect = function intersect(top1, bottom1, top2, bottom2) {
    return top2 < bottom1 && bottom2 > top1;
  };

  _proto.resize$ = function resize$() {
    var _this2 = this;

    return rxjs.fromEvent(window, 'resize').pipe(operators.auditTime(100), operators.startWith(null), operators.tap(function () {
      return _this2.updateView(true);
    }));
  };

  _proto.scroll$ = function scroll$(node) {
    var _this3 = this;

    return rxjs.fromEvent(window, 'scroll').pipe(operators.tap(function () {
      return _this3.updateView();
    }));
  };

  _proto.updateView = function updateView(reset) {
    var rect = this.container.getBoundingClientRect();
    var options = this.options;
    options.top = rect.top;
    options.containerWidth = rect.width;
    options.containerHeight = window.innerHeight;
    options.cols = this.getCols();

    if (reset) {
      this.cachedRects = {};
    }
  };

  _proto.getExpressionTokens = function getExpressionTokens(expression) {
    if (expression === null) {
      throw new Error('invalid virtual');
    }

    if (expression.trim().indexOf('let ') === -1 || expression.trim().indexOf(' of ') === -1) {
      throw new Error('invalid virtual');
    }

    var expressions = expression.split(';').map(function (x) {
      return x.trim();
    }).filter(function (x) {
      return x !== '';
    });
    var virtualExpressions = expressions[0].split(' of ').map(function (x) {
      return x.trim();
    });
    var value = virtualExpressions[0].replace(/\s*let\s*/, '');
    var iterable = virtualExpressions[1];
    var key = 'index';
    var keyValueMatches = value.match(/\[(.+)\s*,\s*(.+)\]/);

    if (keyValueMatches) {
      key = keyValueMatches[1];
      value = keyValueMatches[2];
    }

    if (expressions.length > 1) {
      var indexExpressions = expressions[1].split(/\s*let\s*|\s*=\s*index/).map(function (x) {
        return x.trim();
      });

      if (indexExpressions.length === 3) {
        key = indexExpressions[1];
      }
    }

    return {
      key: key,
      value: value,
      iterable: iterable
    };
  };

  return VirtualStructure;
}(rxcomp.Structure);
VirtualStructure.meta = {
  selector: '[*virtual]',
  inputs: ['mode', 'width', 'gutter']
};var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, rxcompForm.FormModule],
  declarations: [CardServiceComponent, CardSerieComponent, ClickOutsideDirective, CoverComponent, CoverVideoComponent, DatePipe, DropdownDirective, DropdownItemDirective, ErrorsComponent, FadingGalleryComponent, GalleryComponent, GalleryModalComponent, HeaderComponent, HtmlPipe, LazyDirective, LazyPictureDirective, LocomotiveDirective, ModalComponent, ModalOutletComponent, OverlayEffectDirective, OverlayWebglDirective, ProductsPageComponent, ScrollToDirective, SecureDirective, ShareComponent, SliderComponent, SliderServiceComponent, SlugPipe, VirtualStructure],
  bootstrap: AppComponent
};rxcomp.Browser.bootstrap(AppModule);})));