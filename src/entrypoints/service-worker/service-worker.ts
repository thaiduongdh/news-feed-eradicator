import { getBrowser, type MessageSender, type SendResponse, type TabId } from '../../lib/webextension';
import type { Region, SiteId, SiteList } from '../../types/sitelist';
import type { DesiredRegionState, ToServiceWorkerMessage } from '../../messaging/messages';
import { loadRegionsForSite, loadSitelist } from '../../storage/storage';
import { originsForSite } from '../../lib/util';
import themeDark from '../../themes/dark.css?raw';
import themeLight from '../../themes/light.css?raw';

const browser = getBrowser();

// Hardcoded list of sites to enable (excluding Hacker News per user request)
// If you want to enable a site, add its ID here.
const SITES_TO_ENABLE = ['reddit', 'twitter', 'youtube', 'abc-news-au', 'shopee', 'substack'];

const sendMessage = (tabId: TabId, message: any) => browser.tabs.sendMessage(tabId, message);

browser.runtime.onInstalled.addListener(async () => {
	// Static content scripts enabled. No logic needed here.
	console.log('Focus Mode Ext installed.');
});

const cssForType = (type: Region['type']): string => {
	switch (type) {
		case 'remove':
			return 'display: none !important;';
		case 'hide':
			// Per user request: "Change the UI". Defaulting "Hide" to "Remove" for a cleaner look.
			return 'display: none !important;';
		case 'dull':
			return 'filter: grayscale(100%) !important';
		default:
			return '';
	}
}

const sanitizeSelector = (selector: string): string => {
	return selector.replaceAll('{', '').replaceAll('}', '');
}

// function enableSite removed - using static content scripts


const handleMessage = async (msg: ToServiceWorkerMessage, sender: MessageSender) => {
	if (msg.type === 'requestSiteDetails') {
		const siteList = await loadSitelist();
		const url = new URL(sender.url);
		const site = siteList.sites.find(site => site.hosts.includes(url.host));

		if (site != null && SITES_TO_ENABLE.includes(site.id as string)) {
			// Always return regions enabled
			const regions = site.regions.map((region): DesiredRegionState => {
				// Check path if necessary
				if (region.paths !== '*' && !site.paths.includes(msg.path)) {
					// Logic for path checking - reusing existing logic if needed or simplifying
					// For now, let's just assume we want to eradicate if it matches the site, 
					// but we should respect the region's path requirements if strict.
					// Existing logic:
					// isEnabledPath(site, msg.path)
					// Let's bring back isEnabledPath if needed, or assume simple enabling.

					// Re-implementing isEnabledPath inline for simplicity:
					if (!site.paths.includes(msg.path)) {
						return { config: region, css: null, enabled: false };
					}
				}

				const selector = region.selectors.map(sanitizeSelector).join(',');
				return { config: region, css: `${selector} { ${cssForType(region.type)} }`, enabled: true };
			});

			sendMessage(sender.tab.id, {
				type: 'nfe#siteDetails',
				regions,
				token: msg.token,
				snoozeUntil: null, // Snooze feature removed
				siteId: site.id,
				hideQuotes: true, // Always hide quotes
				theme: {
					css: themeLight, // Default to light or just empty, doesn't matter as quote is hidden
					id: 'light',
				}
			})
		}
	}

	if (msg.type === 'injectCss') {
		await browser.scripting.insertCSS({
			target: { tabId: sender.tab.id },
			css: msg.css,
		});
		return { css: msg.css };
	}

	if (msg.type === 'removeCss') {
		try {
			await browser.scripting.removeCSS({
				target: { tabId: sender.tab.id },
				css: msg.css,
			});
		} catch (e) {
			// Ignore errors if CSS wasn't injected
		}
		return { css: msg.css };
	}
}

browser.runtime.onMessage.addListener((msg: ToServiceWorkerMessage, sender, sendResponse) => {
	handleMessage(msg, sender).then(sendResponse);
	return true;
});
