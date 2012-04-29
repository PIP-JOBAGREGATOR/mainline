from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler

class Object:
	pass

class ScrapperBase:
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
	url = []
        rows = self.database.Read(self.timestamp,url);
        return rows

    def process_item(self,page):
        pass	
