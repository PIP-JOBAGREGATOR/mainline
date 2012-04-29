from BeautifulSoup import BeautifulSoup

from base import CrawlPipelineStep

class EjobsCrawler(CrawlPipelineStep):
    def __init__(self):
        self.jobs_url = 'http://www.ejobs.ro/user/searchjobs'
        self.site = 'ejobs'

    def get_pages_count(self, html):
        return 700

    def get_page_url(self, page_num):
        return self.jobs_url + "?page=" + str(page_num)

    def process_item(self, html):
        # Receives an html with link to actual jobs
        jobs_soup = BeautifulSoup(html)
        job_urls = []
        links = jobs_soup.findAll('span', {"class": "jobs"})
        for link in links:
        	job_urls.append(link.find("a")["href"])
	td = jobs_soup.findAll('td',{'class':'jobs'}) 
	for t in td :
		job_urls.append(t.find("a")["href"])	       
	items = []
        for url in job_urls:
            job_html = self.read_page(url)
            items.append((job_html, url))

        return items
