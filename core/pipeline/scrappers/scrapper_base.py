from BeautifulSoup import BeautifulSoup
import urllib
import md5
from database_handler import DatabaseHandler
import time
import random

class Object:
	pass

class ScrapperBase:
    def __init__(self, timestamp):
        self.database = DatabaseHandler()
        self.timestamp = timestamp 

    def process_hash(self, processed):
        string = ''
        string += processed.title
        string += processed.employer

        hasher = md5.new()
        hasher.update(string)
        processed.hash = hasher.hexdigest()

    def run(self):
        url=[]
        items = self.read()
        cnt = 0
        for item in items:
            try:
                processed_item = self.process_item(item)
                self.process_hash(processed_item)
                print processed_item.salary
                self.write(processed_item)
            except Exception as strerror:
                pass
        self.timestamp = int(time.time())

    def write(self,job):
        self.database.Write(job)

    def read(self):
        rows = self.database.Read(self.timestamp, self.site)
	
        return rows

    def process_item(self,page):
        pass	
