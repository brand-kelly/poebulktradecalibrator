// ==UserScript==
// @name        PoE Bulk Trade Slider Bar Calibrator
// @namespace   Violentmonkey Scripts
// @match       https://www.pathofexile.com/trade/exchange/*/*
// @grant       none
// @version     2.0
// @author      brandnola
// @description Forces PoE's bulk exchange slider bar to be at most the number of items a seller has in stock
// ==/UserScript==

const targetNode = document.body;

const config = { attributes: false, childList: true, subtree: true };

const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (!mutation.target.querySelector('.slider-right')) {
            return;
        }

        const childPriceBlockLength = mutation.target.querySelector('.price-block')?.children.length;
        const whatYouGet = mutation.target.querySelector('.price-block')?.children[childPriceBlockLength - 1]
            .textContent;
        const sellerStock = mutation.target.querySelector('.stock')?.children[0].textContent;

        const whatYouGetInteger = parseInt(whatYouGet);
        const sellerStockInteger = parseInt(sellerStock);

        const sliderMax = Math.floor(sellerStockInteger / whatYouGetInteger);

        if (sliderMax) {
            mutation.target.querySelector('input[type="range"]')?.setAttribute('max', String(sliderMax));
        }

        if (!mutation.target.querySelector('.slider-right button')) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-default';
            btn.style.color = '#e9cf9f';
            btn.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
            btn.style.marginLeft = '.75rem';
            btn.innerHTML = 'Max';
            
            const inputElement = mutation.target.querySelector('input[type="range"]');
            mutation.target.querySelector('.slider-right').appendChild(btn);
            btn.onclick = () => {
                inputElement.value = inputElement.max;
                inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            };
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

// observer.disconnect();  DO NOT need to disconnect while we are on bulk item trade page
