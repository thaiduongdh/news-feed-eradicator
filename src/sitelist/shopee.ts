import { regionId, siteId, type Site } from "../types/sitelist";

export const shopee: Site = {
	id: siteId('shopee'),
	title: "Shopee",
	hosts: [
		'shopee.vn',
		'shopee.sg',
		'shopee.com.my',
		'shopee.ph',
		'shopee.co.th',
		'shopee.co.id',
		'shopee.tw',
		'shopee.com.br',
		'shopee.com.mx',
		'shopee.com.co',
		'shopee.cl'
	],
	paths: ['/'],
	regions: [
		{
			id: regionId('feed'),
			title: 'Daily Discover Feed',
			selectors: [
				'.section-recommend-products-wrapper',
				'.daily-discover-main',
				'.shopee-daily-discover'
			],
			type: 'remove',
			paths: 'inherit',
			inject: {
				mode: 'before',
			}
		},
		{
			id: regionId('banner'),
			title: 'Home Banner',
			selectors: [
				'.full-home-banners-wrapper',
				'.home-banner-main',
				'.shopee-header-section__content'
			],
			type: 'remove',
			paths: 'inherit',
		}
	],
};
