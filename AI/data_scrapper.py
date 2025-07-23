import requests
from bs4 import BeautifulSoup
import json

urls = [
    "https://www.healthline.com/health/gut-health",
    "https://www.healthline.com/health/gut-health#effect-on-health",
    "https://www.healthline.com/health/gut-health#signs-of-an-unhealthy-gut",
    "https://newsinhealth.nih.gov/2017/05/keeping-your-gut-check",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6682904/",
    "https://www.gastrojournal.org/article/S0016-5085(09)00471-5/fulltext",
    "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/good-bacteria-for-your-gut",
    "https://mcpress.mayoclinic.org/living-well/transforming-your-gut-health-simple-steps-for-a-healthier-you/"
]

def scrape_url(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.find('article') or soup.find('div', class_='content') or soup.get_text()
        return content.get_text() if hasattr(content, 'get_text') else content
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

data = []
for url in urls:
    content = scrape_url(url)
    if content:
        data.append({"url": url, "content": content})

with open('scraped_gut_health_data.json', 'w') as f:
    json.dump(data, f, indent=4)

print("Scraping completed and data saved to scraped_gut_health_data.json")
