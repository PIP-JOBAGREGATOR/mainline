from BeautifulSoup import BeautifulSoup
import urllib
import md5
from database_handler import DatabaseHandler

class Object:
	pass

class ScrapperBase:
    def __init__(self,timestamp):
        self.database = DatabaseHandler()
        self.timestamp = timestamp

    def processHash(self,processed):
        string = ''
        string += self.job.job_title
        string += self.job.employer
        hasher = md5.new()
        hasher.update(string)
        hashed = hasher.hexdigest()        
        processed.hash = hashed

    def run(self):
        items = self.read()
        cnt = 0
        for item in items:
            try:
                processed_item = self.process_item(item)
                self.processHash(processed_item)
                self.write(processed_item)
            except:
                pass

    def write(self,job):
        self.database.Write(job)

    def read(self):
        rows = self.database.Read(self.timestamp);
        return rows

    def process_item(self,page):
        pass	
