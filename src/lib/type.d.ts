interface RedirectUrlData {
  short_code: string;
  url: string;
}

type ShortUrl = {
  shortUrl: string;
  destUrl: string;
  created_at: string;
  updated_at: string;
};

interface ClicksOverTime {
  day: string;
  click_count: number;
}

interface ClicksPerBrowser {
  browser: string;
  click_count: number;
}

interface TrafficFromReferrer {
  referrer: string;
  click_count: number;
}

interface TrafficFromCountry {
  country_name: string;
  country_iso_code: string;
  click_count: string;
}

type FilterTimeRange = '7d' | '30d' | '90d' | '180d' | '365d'