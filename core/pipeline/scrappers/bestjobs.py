from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler

class Object:
	pass

class BestjobsScrapper:
    def __init__(self,timestamp):
        self.database = DatabaseHandler()
        self.timestamp = timestamp 

    def run(self):
        items = self.read()
        cnt = 0
        for item in items:
            try:
                processed_item = self.process_item(item)
                self.write(processed_item)
            except:
                pass

    def write(self,job):
        self.database.Write(job.job_title,job.description,job.salary,job.employer)

    def read(self):
        rows = self.database.Read(self.timestamp);
        return rows

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
