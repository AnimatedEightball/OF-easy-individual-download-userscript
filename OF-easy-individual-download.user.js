// ==UserScript==
// @name         OnlyFans - Restore Right-click to Save and Long-Press Downloads on Mobile
// @namespace    github.com/AnimatedEightball
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/AnimatedEightball/OF-mobile-userscript/refs/heads/main/OF-easy-individual-download.user.js
// @updateURL    https://raw.githubusercontent.com/AnimatedEightball/OF-mobile-userscript/refs/heads/main/OF-easy-individual-download.user.js
// @homepageURL  https://github.com/AnimatedEightball/OF-easy-individual-download-userscript/
// @version      1.1.0
// @author       AnimatedEightball
// @description  Re-enable right-click, image context menus, and long-press behavior
// ==/UserScript==

(function () {
    "use strict";

    // Override CSS restrictions, including pointer-events: none.
    const style = document.createElement("style");
    style.textContent = `
        img,
        picture,
        picture > img,
        video,
        canvas {
            pointer-events: auto !important;
            user-select: auto !important;
            -webkit-user-select: auto !important;
            -webkit-touch-callout: default !important;
        }
    `;

    (document.head || document.documentElement).appendChild(style);

    function restoreImage(img) {
        img.oncontextmenu = null;
        img.ontouchstart = null;
        img.ontouchend = null;

        img.style.setProperty("pointer-events", "auto", "important");
        img.style.setProperty("user-select", "auto", "important");
        img.style.setProperty("-webkit-user-select", "auto", "important");
        img.style.setProperty("-webkit-touch-callout", "default", "important");
    }

    function restoreImages(root = document) {
        if (root.matches?.("img")) {
            restoreImage(root);
        }

        root.querySelectorAll?.("img").forEach(restoreImage);
    }

    // Prevent page handlers from suppressing the native context menu.
    window.addEventListener(
        "contextmenu",
        event => event.stopImmediatePropagation(),
        true
    );

    // Remove restrictions from existing and dynamically added images.
    restoreImages();

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    restoreImages(node);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
