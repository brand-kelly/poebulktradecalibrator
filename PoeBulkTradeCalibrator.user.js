// ==UserScript==
// @name        PoE Bulk Trade Slider Bar Calibrator
// @namespace   Violentmonkey Scripts
// @match       https://www.pathofexile.com/trade/exchange/*/*
// @grant       none
// @version     5.0
// @author      brandnola
// @description Forces PoE's bulk exchange slider bar to be at most the number of items a seller has in stock
// ==/UserScript==

const targetNode = document.body;

const config = { attributes: false, childList: true, subtree: true };

const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.target.className !== 'row exchange') {
            return;
        }
        const tradeBox = mutation.target;
        const characterNameArray = tradeBox.querySelector('textarea').childNodes[0].data.match(/[^@ ]+/);
        if (characterNameArray) {
            const characterName = characterNameArray[0];
            let accountName = (tradeBox.querySelector('.right .profile-link').children[0].innerText = characterName);
        }

        const childPriceBlockLength = tradeBox.querySelector('.price-block')?.children.length;
        const whatYouGet = tradeBox.querySelector('.price-block')?.children[childPriceBlockLength - 1].textContent;
        const sellerStock = tradeBox.querySelector('.stock')?.children[0].textContent;

        const whatYouGetInteger = parseInt(whatYouGet);
        const sellerStockInteger = parseInt(sellerStock);

        const sliderMax = Math.floor(sellerStockInteger / whatYouGetInteger);
        if (sliderMax) {
            tradeBox.querySelector('input[type="range"]')?.setAttribute('max', String(sliderMax));
        }

        if (!tradeBox.querySelector('.slider-right button')) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-default';
            btn.style.color = '#e9cf9f';
            btn.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
            btn.style.marginLeft = '.75rem';
            const inputElement = tradeBox.querySelector('input[type="range"]');
            btn.innerHTML = 'Max';
            tradeBox.querySelector('.slider-right').appendChild(btn);
            btn.onclick = () => {
                inputElement.value = inputElement.max;
                inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            };

            if (sliderMax === 1) {
                btn.disabled = true;
            }
        }

        // Changes opacity of trade box when textarea is clicked
        const formEvent = tradeBox.querySelector('textarea');
        formEvent.onclick = () => {
            tradeBox.style.opacity = 0.5;
        };
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

// observer.disconnect();  DO NOT need to disconnect while we are on bulk item trade page
