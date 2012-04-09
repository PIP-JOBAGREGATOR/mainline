import sys
import os.path
import urllib2
import BeautifulSoup

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))

from pstep import PipelineStep

class CrawlPipelineStep(PipelineStep):
    def __init__(self):
        # jobs_url points to a page where we have several links to a page
        self.jobs_url = None

    def read_page(self, url):
        response = urllib2.urlopen(url)
        html = response.read()

    def read(self):
        jobs_page = self.read_page(self.jobs_url)    
