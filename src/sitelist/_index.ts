import type { SiteList } from "../types/sitelist"
import { abcNewsAu } from "./abc-news-au";
import { hackernews } from "./hackernews";
import { reddit } from "./reddit";
import { shopee } from "./shopee";
import { substack } from "./substack";
import { twitter } from "./twitter";
import { youtube } from "./youtube";
import { facebook } from "./facebook";
import { instagram } from "./instagram";
import { tiktok } from "./tiktok";

const sitelist: SiteList = {
	schemaVersion: 1,
	sites: [
		reddit,
		youtube,
		twitter,
		hackernews,
		substack,
		abcNewsAu,
		shopee,
		facebook,
		instagram,
		tiktok,
	]
}

export default sitelist;
