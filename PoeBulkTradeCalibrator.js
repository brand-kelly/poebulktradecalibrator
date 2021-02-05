// ==UserScript==
// @name        PoE Bulk Trade Slider Bar Calibrator
// @namespace   Violentmonkey Scripts
// @match       https://www.pathofexile.com/trade/exchange/Ritual/*
// @grant       none
// @version     1.0
// @author      brandnola
// @description Forces PoE's bulk exchange slider bar to be at most the number of items a seller has in stock
// ==/UserScript==

const targetNode = document.body;

const config = { attributes: false, childList: true, subtree: true };

const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        
        const childPriceBlockLength = mutation.target.querySelector('.price-block')?.children.length
        const whatYouGet = mutation.target.querySelector('.price-block')?.children[childPriceBlockLength - 1].textContent;
        const sellerStock = mutation.target.querySelector('.stock')?.children[0].textContent;

        const whatYouGetInteger = parseInt(whatYouGet);
        const sellerStockInteger = parseInt(sellerStock);

        const sliderStockInt = Math.floor(sellerStockInteger / whatYouGetInteger);

        if (sliderStockInt) {
            mutation.target.querySelector('input[type="range"]')?.setAttribute('max', String(sliderStockInt));
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

// observer.disconnect();  DO NOT need to disconnect while we are on bulk item trade page
