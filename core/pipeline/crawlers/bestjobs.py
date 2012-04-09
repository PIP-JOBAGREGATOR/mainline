from BeautifulSoup import BeautifulSoup

from base import CrawlPipelineStep

class BestjobsCrawler(CrawlPipelineStep):
    def __init__(self):
        self.jobs_url = 'http://bestjobs.ro/cautare/locuri-de-munca/'
        self.site = 'bestjobs'

    def process_item(self, html):
        # Receives an html with link to actual jobs
        jobs_soup = BeautifulSoup(html)
        job_urls = []
        links = jobs_soup.findAll('a', {"class": "sr-cell-title"})
        for link in links:
            job_urls.append(link["href"])

        items = []
        for url in job_urls:
            job_html = self.read_page(url)
            items.append((job_html, url))

        return items
