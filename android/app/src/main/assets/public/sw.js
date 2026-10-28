/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "4ca9cb4ac6befc61b6767bb224329753"
  }, {
    "url": "pwa-512x512.png",
    "revision": "3c16dae7c8e95fb6cbeae9476f2412ef"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d1f651e1fddb57eb730e283b1491f976"
  }, {
    "url": "index.html",
    "revision": "9904fccffc865877b2c784ed616fd862"
  }, {
    "url": "icon.svg",
    "revision": "bb9a3510f5641d80a5dbf24334392943"
  }, {
    "url": "favicon.ico",
    "revision": "98cb89bb85cc547e1da5038f7c06265f"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0e23b3b604de9aaf6237c5b6ea6763d5"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-DpF4qQY4.css",
    "revision": null
  }, {
    "url": "assets/index-DosMX1Hv.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0e23b3b604de9aaf6237c5b6ea6763d5"
  }, {
    "url": "favicon.ico",
    "revision": "98cb89bb85cc547e1da5038f7c06265f"
  }, {
    "url": "icon.svg",
    "revision": "bb9a3510f5641d80a5dbf24334392943"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d1f651e1fddb57eb730e283b1491f976"
  }, {
    "url": "pwa-512x512.png",
    "revision": "3c16dae7c8e95fb6cbeae9476f2412ef"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "4ca9cb4ac6befc61b6767bb224329753"
  }, {
    "url": "manifest.webmanifest",
    "revision": "c78ed8dbcebfd216be5738644f44ffee"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
