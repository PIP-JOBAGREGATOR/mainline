import sys
import os.path
import urllib2
import BeautifulSoup

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))

from pstep import PipelineStep
from writer import CrawlerWriter

class CrawlPipelineStep(PipelineStep):
    def __init__(self):
        # jobs_url points to a page where we have several links to a page
        self.jobs_url = None

    def read_page(self, url):
        tries = 0
        while tries < 5:
            try:
                response = urllib2.urlopen(url)
                html = response.read()
                return html
            except:
                tries += 1
        return ""

    def get_pages_count(self, html):
        return NotImplementedError()

    def read(self):
        jobs_page = self.read_page(self.jobs_url)
        pages = [jobs_page]
        num_pages = self.get_pages_count(jobs_page)
       
        # For testing
        num_pages = min(num_pages, 20)

        for i in xrange(2, num_pages + 1):
            print "Reading page %d " % i
            url = self.get_page_url(i)
            pages.append(self.read_page(url))
        return pages

    def write(self, items):
        self.writer = CrawlerWriter('localhost', 'root', 'root', self.site, 'job_agregator') 
        cnt = 0
        for item in items:
            # Item[0] = html, item[1] = url
            self.writer.write_job(item[0], item[1])
