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
        response = urllib2.urlopen(url)
        html = response.read()
        return html

    def get_pages_count(self, html):
        return NotImplementedError()

    def read(self):
        jobs_page = self.read_page(self.jobs_url)
        self.get_pages_count(jobs_page)
        return [jobs_page]

    def write(self, items):
        self.writer = CrawlerWriter('localhost', 'root', 'root', self.site, 'job_agregator') 
        cnt = 0
        for item in items:
            # Item[0] = html, item[1] = url
            self.writer.write_job(item[0], item[1])
