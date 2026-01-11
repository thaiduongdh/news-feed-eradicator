import { type Site, siteId, regionId } from "../types/sitelist";

export const instagram: Site = {
    id: siteId('instagram'),
    title: 'Instagram',
    hosts: ['www.instagram.com', 'instagram.com'],
    paths: ['/'],
    regions: [
        {
            id: regionId('feed'),
            title: 'Main Feed',
            selectors: [
                'main[role="main"] article',
                'section main > div > div:first-child',
                'div[style*="flex-direction: column"] > div > article',
            ],
            paths: 'inherit',
            type: 'remove',
            inject: {
                mode: 'before',
            },
        },
        {
            id: regionId('stories'),
            title: 'Stories',
            selectors: [
                'div[role="menu"]',
                'section > main > div > div > div:first-child canvas',
            ],
            type: 'remove',
            paths: '*',
        },
        {
            id: regionId('reels'),
            title: 'Reels',
            selectors: [
                'div[aria-label="Reels"]',
            ],
            type: 'remove',
            paths: '*',
        },
        {
            id: regionId('suggested'),
            title: 'Suggested Posts',
            selectors: [
                'article + div[class]',
            ],
            type: 'remove',
            paths: '*',
        },
    ],
};
