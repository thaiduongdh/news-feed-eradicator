// Injected into the relevant site
import { getBrowser } from '../../lib/webextension';
import type { FromServiceWorkerMessage, ToServiceWorkerMessage } from '../../messaging/messages';

const browser = getBrowser();

const token = Math.floor(Math.random() * 1000000);

const sendMessage = (message: ToServiceWorkerMessage) => browser.runtime.sendMessage(message);

type ContentScriptState = {
	injectedCss?: string | null;
	ready?: boolean;
};

let state: ContentScriptState = {
	injectedCss: null,
	ready: false,
};

let path = window.location.pathname;
setInterval(() => {
	if (path != window.location.pathname) {
		path = window.location.pathname;

		console.log('path changed', path);

		sendMessage({
			type: 'requestSiteDetails',
			path: window.location.pathname,
			token
		});
	}
}, 15);

const setCss = async (css: string | null) => {
	if (css === state.injectedCss) {
		return;
	}

	let oldCss = state.injectedCss;

	// Inject new css to avoid flashing content
	if (css != null) {
		state.injectedCss = css;

		const injected = await sendMessage({ type: 'injectCss', css });
		console.log('got response injected', injected)
	} else {
		state.injectedCss = null;
	}

	// Remove any existing css
	if (oldCss != null) {
		const removed = await sendMessage({ type: 'removeCss', css: oldCss });
		console.log('got response remove', removed)
	}
}

browser.runtime.onMessage.addListener(async (msg: FromServiceWorkerMessage) => {
	console.log("Got message", msg);
	if (msg.type == 'nfe#siteDetails' && msg.token === token) {
		state.ready = true;

		// Apply CSS from regions
		let css = "";
		if (msg.regions) {
			for (const region of msg.regions) {
				if (region.enabled && region.css) {
					css += region.css + '\n';
				}
			}
		}

		setCss(css);
	}
})

const pingServiceWorker = () => {
	if (state.ready) {
		return;
	}

	sendMessage({
		type: 'requestSiteDetails',
		path: window.location.pathname,
		token
	});

	setTimeout(pingServiceWorker, 10);
}

pingServiceWorker();
