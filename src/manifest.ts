import packageJson from '../package.json';

export default {
	"name": "Focus Mode",
	"version": packageJson.version,
	"description": "Remove distractions from your browsing.",
	"manifest_version": 3,
	"permissions": ["storage", "scripting"],
	"host_permissions": ["*://*/*"],
	"action": {
		"default_icon": {
			"16": "assets/icon16.png",
			"32": "assets/icon32.png",
			"48": "assets/icon48.png",
			"64": "assets/icon64.png",
			"128": "assets/icon128.png"
		},
		"default_title": "Focus Mode"
	},
	"background": {
		"service_worker": "entrypoints/service-worker/service-worker.js",
		"type": "module"
	},
	"content_scripts": [
		{
			"matches": [
				"*://*.facebook.com/*",
				"*://*.reddit.com/*",
				"*://*.twitter.com/*",
				"*://*.x.com/*",
				"*://*.youtube.com/*",
				"*://*.abc.net.au/*",
				"*://shopee.sg/*",
				"*://shopee.com.my/*",
				"*://shopee.co.th/*",
				"*://shopee.co.id/*",
				"*://shopee.ph/*",
				"*://shopee.vn/*",
				"*://shopee.com.br/*",
				"*://shopee.com.mx/*",
				"*://shopee.com.co/*",
				"*://shopee.cl/*",
				"*://*.substack.com/*",
				"*://*.instagram.com/*",
				"*://*.tiktok.com/*"
			],
			"js": ["entrypoints/intercept/intercept.js"],
			"run_at": "document_start",
			"all_frames": false
		}
	],
	"icons": {
		"16": "assets/icon16.png",
		"32": "assets/icon32.png",
		"48": "assets/icon48.png",
		"64": "assets/icon64.png",
		"128": "assets/icon128.png"
	},
	"web_accessible_resources": [
		{
			"resources": ["sitelist.json"],
			"extension_ids": [],
		}
	],
	"browser_specific_settings": {
		"gecko": {
			"id": "@focus-mode"
		},
		"gecko_android": {
			"strict_min_version": "113.0"
		}
	}
}
