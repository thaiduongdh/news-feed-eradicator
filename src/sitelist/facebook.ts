import { type Site, siteId, regionId } from "../types/sitelist";

export const facebook: Site = {
    id: siteId('facebook'),
    title: 'Facebook',
    hosts: ['www.facebook.com', 'web.facebook.com', 'm.facebook.com'],
    paths: ['/'],
    regions: [
        {
            id: regionId('feed'),
            title: 'News Feed',
            selectors: [
                '[role="feed"], div[role="feed"], #ssrb_feed_start + div, .x1hc1fzr.x1unhpq9.x6o7n8i, #m_news_feed_stream, div[id^="feed_stream"]'
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
                'div[aria-label="Stories"]',
                'div[data-pagelet="Stories"]',
            ],
            type: 'remove',
            paths: '*',
        },
        {
            id: regionId('reels'),
            title: 'Reels',
            selectors: [
                'div[aria-label="Reels"]',
                'div[data-pagelet="Reels"]',
            ],
            type: 'remove',
            paths: '*',
        },
        {
            id: regionId('right-sidebar'),
            title: 'Right Sidebar (Sponsored/Contacts)',
            selectors: [
                'div[role="complementary"]',
            ],
            type: 'remove',
            paths: '*',
            default: false
        }
    ],
};
