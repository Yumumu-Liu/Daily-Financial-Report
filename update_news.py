import yfinance as yf
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator
from datetime import datetime

def parse_iso_date(date_str):
    try:
        # Example: 2026-01-26T14:30:00Z
        dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")
        return int(dt.timestamp())
    except Exception:
        return 0

def fetch_news(tickers, limit=10, keywords=None):
    all_news = []
    seen_titles = set()
    translator = GoogleTranslator(source='auto', target='zh-CN')

    for ticker_symbol in tickers:
        try:
            ticker = yf.Ticker(ticker_symbol)
            news_items = ticker.news
            
            for item in news_items:
                # Handle different data structures
                title = None
                link = None
                publisher = None
                publish_time = 0

                if 'content' in item and isinstance(item['content'], dict):
                    # New structure
                    content = item['content']
                    title = content.get('title')
                    
                    # Try to find link
                    if content.get('clickThroughUrl'):
                        link = content['clickThroughUrl'].get('url')
                    elif content.get('canonicalUrl'):
                        link = content['canonicalUrl'].get('url')
                    
                    if content.get('provider'):
                        publisher = content['provider'].get('displayName')
                    
                    if content.get('pubDate'):
                        publish_time = parse_iso_date(content['pubDate'])
                else:
                    # Old structure
                    title = item.get('title')
                    link = item.get('link')
                    publisher = item.get('publisher')
                    publish_time = item.get('providerPublishTime')

                # Validation
                if not title or not link:
                    continue
                
                # Deduplication
                if title in seen_titles:
                    continue
                
                # Keyword filtering
                if keywords:
                    if not any(k.lower() in title.lower() for k in keywords):
                        continue

                seen_titles.add(title)
                
                # Translate title
                try:
                    title_zh = translator.translate(title)
                except Exception as e:
                    print(f"Translation failed for '{title}': {e}")
                    title_zh = title 

                all_news.append({
                    'title': title,
                    'title_zh': title_zh,
                    'link': link,
                    'publisher': publisher,
                    'publish_time': publish_time,
                    'type': 'News'
                })
        except Exception as e:
            print(f"Error fetching news for {ticker_symbol}: {e}")
    
    # Sort and limit
    all_news.sort(key=lambda x: x.get('publish_time', 0), reverse=True)
    return all_news[:limit]

def save_json(data, filename):
    output_path = Path(__file__).parent / filename
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Successfully updated {filename}")

def main():
    # 1. General News
    general_tickers = ["^GSPC", "NVDA", "AAPL", "MSFT", "TSLA", "AMZN"]
    news_data = fetch_news(general_tickers, limit=8)
    if not news_data:
        print("Warning: No general news found.")
        save_json([], 'news_data.json')
    else:
        save_json(news_data, 'news_data.json')

    # 2. M&A News
    # MNA is a Merger Arbitrage ETF. Also looking at big tech for deals.
    ma_tickers = ["MNA", "MSFT", "GOOG", "AVGO", "CSCO", "CRM"] 
    ma_keywords = ['acquisition', 'merger', 'buyout', 'deal', 'takeover', 'acquire', 'purchase', 'buying']
    ma_data = fetch_news(ma_tickers, limit=5, keywords=ma_keywords)
    
    if ma_data:
        save_json(ma_data, 'ma_data.json')
    else:
        print("Warning: No M&A news found.")
        save_json([], 'ma_data.json')

    # 3. IPO News
    # IPO, FPX are IPO ETFs
    ipo_tickers = ["IPO", "FPX", "RENA"] 
    ipo_keywords = ['IPO', 'public offering', 'listing', 'debut', 'filing', 'go public']
    ipo_data = fetch_news(ipo_tickers, limit=5, keywords=ipo_keywords)
    
    if ipo_data:
        save_json(ipo_data, 'ipo_data.json')
    else:
        print("Warning: No IPO news found.")
        save_json([], 'ipo_data.json')

if __name__ == '__main__':
    main()
