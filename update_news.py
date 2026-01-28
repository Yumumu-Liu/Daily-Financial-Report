import yfinance as yf
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

def update_news():
    """
    Fetches the latest news from Yahoo Finance for major tickers and translates titles to Chinese.
    Saves the data to news_data.json.
    """
    # Use major indices and tech giants to get broad market news
    tickers = ["^GSPC", "NVDA", "AAPL", "MSFT"]
    
    all_news = []
    seen_titles = set()
    
    translator = GoogleTranslator(source='auto', target='zh-CN')

    for ticker_symbol in tickers:
        try:
            ticker = yf.Ticker(ticker_symbol)
            news_items = ticker.news
            
            for item in news_items:
                title = item.get('title')
                link = item.get('link')
                publisher = item.get('publisher')
                publish_time = item.get('providerPublishTime')
                
                # Deduplicate news based on title
                if title in seen_titles:
                    continue
                seen_titles.add(title)
                
                # Translate title
                try:
                    title_zh = translator.translate(title)
                except Exception as e:
                    print(f"Translation failed for '{title}': {e}")
                    title_zh = title # Fallback to English

                all_news.append({
                    'title': title,
                    'title_zh': title_zh,
                    'link': link,
                    'publisher': publisher,
                    'publish_time': publish_time,
                    'type': item.get('type', 'News')
                })
                
                # Limit to latest 10 news items overall to keep it clean
                if len(all_news) >= 10:
                    break
        except Exception as e:
            print(f"Error fetching news for {ticker_symbol}: {e}")
        
        if len(all_news) >= 10:
            break

    # Sort by publish time descending
    all_news.sort(key=lambda x: x.get('publish_time', 0), reverse=True)
    
    # Keep top 8
    all_news = all_news[:8]

    if not all_news:
        print("Warning: No news found.")
    
    # Define the output path
    output_path = Path(__file__).parent / 'news_data.json'
    
    # Write data to the JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_news, f, ensure_ascii=False, indent=4)

    print(f"Successfully updated news data to {output_path}")

if __name__ == '__main__':
    update_news()
