from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler
from scrapper_base import ScrapperBase

class Object:
	pass

class BestjobsScrapper(ScrapperBase):
    def __init__(self,timestamp):
        ScrapperBase.__init__(self,timestamp)

    def process_item(self,page):
        content = page[0]
        html_content = BeautifulSoup(content)
        job_title_tag = html_content.findAll("h1")[0]

        job = Object()
        job.job_title = job_title_tag.text
        job.employer = job_title_tag.parent.findAll("a")[0].findAll(text=True)
        job.description = html_content.findAll("table")[6].text
        job.salary = 0 
        return job	
