from bs4 import BeautifulSoup
import urllib
import database_handlers

class Object:
	pass

class BestJobs_Scrapper:
	def __init__(self,timestamp):
		self.database = DatabaseHandler()
		self.timestamp = timestamp 
	def Write(self,job):
		self.database.Write(job.job_title,job.description,job.salary,job.employer)
	def Read(self):
		rows = self.database.Read(self.timestamp);
		return rows
	def ParsePage(self,page):
		file = urllib.urlopen(page)
		job = Object()
		content = file.read()
		file.close()
		html_content = BeautifulSoup(content)
		job_title_tag = html_content.findAll("h1")[0]
		job.job_title = job_title_tag.findAll(text=True)
		job.employer = job_title_tag.parent.findAll("a")[0].findAll(text=True)
		job.description = html_content.findAll("table")[6].findAll("ul")[0]
		job.salary = 0 
		return job
		
		
