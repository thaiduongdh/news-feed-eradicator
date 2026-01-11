import { type Site, siteId, regionId } from "../types/sitelist";

export const tiktok: Site = {
    id: siteId('tiktok'),
    title: 'TikTok',
    hosts: ['www.tiktok.com', 'tiktok.com'],
    paths: ['/'],
    regions: [
        {
            id: regionId('feed'),
            title: 'For You Feed',
            selectors: [
                'div[data-e2e="recommend-list-item-container"]',
                'div[class*="DivItemContainerV2"]',
                'div[class*="DivVideoFeedV2"]',
                'main div[class*="DivContentContainer"]',
            ],
            paths: 'inherit',
            type: 'remove',
            inject: {
                mode: 'before',
            },
        },
        {
            id: regionId('sidebar'),
            title: 'Sidebar Suggestions',
            selectors: [
                'div[data-e2e="suggest-accounts"]',
                'div[class*="DivSideNavContainer"]',
            ],
            type: 'remove',
            paths: '*',
        },
    ],
};
