import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
from collections import deque
from anthropic import Anthropic

# -------------------------
# CONFIGURATION
# -------------------------
MAX_PAGES = 10000
MAX_DEPTH = 10
QUERIES = [
    "sustainable materials for consumer products",
    "green alternatives to plastic packaging",
    "renewable energy solutions for transportation",
    "eco-friendly construction materials",
    "biodegradable alternatives to pesticides and fertilizers",
    "circular economy product design",
    "low carbon alternatives to cement and concrete",
    "sustainable textiles and fabrics innovations",
    "zero waste packaging solutions",
    "plant-based alternatives to plastics",
    "energy efficient appliances and electronics",
    "sustainable water management technologies",
    "climate-friendly alternatives in agriculture",
    "innovations in biodegradable polymers",
    "eco-friendly alternatives for household cleaning products",
    "sustainable alternatives to single-use plastics",
    "low-emission urban mobility solutions",
    "sustainable alternatives to animal-based leather",
    "biodegradable alternatives in medical devices",
    "green chemistry alternatives to toxic solvents"
]


OUTPUT_FILE = "sustainability_data.jsonl"

CLAUDE_API_KEY =  # replace with your Claude API key
SERPER_API_KEY =   # replace with your Serper API key

anthropic = Anthropic(api_key=CLAUDE_API_KEY)

def claude_extract(text):
    """Use Claude to extract structured sustainability info."""
    prompt = f"""
Extract structured sustainability info from the following text:

{text}

Return strictly as JSON.
- If there are multiple products/materials, return a JSON **list** of objects.
- Each object must have keys:
  product (string NOT NULL),
  carbon_footprint (string can be in units or numbers),
  unsustainable_materials (list of strings NOT NULL),
  sustainable_alternatives (list of strings NOT NULL).
- If info is missing, use empty string or empty list.
Respond with ONLY valid JSON.
"""

    try:
        response = anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            temperature=0,
            messages=[{"role": "user", "content": prompt}]
        )
        output_text = response.content[0].text.strip()
        if output_text.startswith("```"):
            output_text = output_text.strip("`")
        if output_text.lower().startswith("json"):
            output_text = output_text[4:].strip()

        print(f"Claude output: {output_text[:200]}...")  # preview only
        data = json.loads(output_text)

        # Normalize: always return a list
        if isinstance(data, dict):
            data = [data]
        return data
    except Exception as e:
        print(f"Claude extraction error: {e}")
        return []

# -------------------------
# Helper Functions
# -------------------------
def fetch_page(url):
    try:
        resp = requests.get(url, timeout=10)
        if "text/html" in resp.headers.get("Content-Type", ""):
            soup = BeautifulSoup(resp.text, "html.parser")
            for s in soup(["script", "style", "header", "footer", "nav"]):
                s.decompose()
            return soup.get_text(separator="\n")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
    return None

def extract_links(base_url, html_text):
    soup = BeautifulSoup(html_text, "html.parser")
    links = set()
    for a in soup.find_all("a", href=True):
        href = a['href']
        if href.startswith("http"):
            links.add(href)
        else:
            links.add(urljoin(base_url, href))
    return links

# -------------------------
# BFS Crawler (Streaming writes)
# -------------------------
def bfs_crawl(seed_urls, max_pages=MAX_PAGES, max_depth=MAX_DEPTH):
    visited = set()
    queue = deque([(url, 0) for url in seed_urls])

    while queue and len(visited) < max_pages:
        url, depth = queue.popleft()
        if url in visited or depth > max_depth:
            continue

        print(f"Crawling ({len(visited)+1}/{max_pages}): {url}")
        visited.add(url)

        text = fetch_page(url)
        if text:
            data_list = claude_extract(text)
            with open(OUTPUT_FILE, "a") as f:
                for data in data_list:
                    data["source_url"] = url
                    f.write(json.dumps(data) + "\n")  # ✅ stream as you go

            if depth + 1 <= max_depth:
                links = extract_links(url, text)
                for link in links:
                    if link not in visited:
                        queue.append((link, depth + 1))

# -------------------------
# Seed URLs from Serper API
# -------------------------
def get_google_search_urls(query, num_results=50):
    url = "https://google.serper.dev/search"
    headers = {"X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json"}
    payload = {"q": query, "num": num_results}

    try:
        resp = requests.post(url, headers=headers, json=payload)
        data = resp.json()
        urls = [item["link"] for item in data.get("organic", [])[:num_results]]
        return urls
    except Exception as e:
        print(f"Serper API error: {e}")
        return []

# -------------------------
# Main
# -------------------------
if __name__ == "__main__":
    # clear file before writing
    open(OUTPUT_FILE, "w").close()

    for q in QUERIES:
        print(f"\n🔎 Running query: {q}")
        seed_urls = get_google_search_urls(q, num_results=10)
        print(f"Seed URLs: {seed_urls}")

        bfs_crawl(seed_urls)

    print(f"\n✅ Data streaming complete. Check {OUTPUT_FILE}")
