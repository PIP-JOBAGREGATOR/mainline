from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler
from scrapper_base import ScrapperBase

from hashlib import md5

class Object:
	pass

class BestjobsScrapper(ScrapperBase):
    def __init__(self,timestamp):
        ScrapperBase.__init__(self,timestamp)
        self.site = 'bestjobs'

    def _compute_hash(self, string):
        return md5(string).hexdigest()

    def process_item(self, page):	
        content = page["html"]
        url = page["url"]

        html_content = BeautifulSoup(content)
        job_title_tag = html_content.findAll("h1")[0]

        job = Object()
        job.title = job_title_tag.text
        job.employer = job_title_tag.parent.findAll("a")[0].findAll(text=True)[0]
        job.description = html_content.findAll("table")[6].text
        job.salary = 0
        job.url = url
        header = html_content.findAll("table")[2].findAll(text = True)
        header = filter( lambda  it: it != '\n' and it != ' ' and it != '&nbsp;',header)
        job.level=""
        job.job__type=""
        job.city=""
        if 'Nivel cariera' in header:
            index = header.index('Nivel cariera') 
            job.level = header[index + 1]
        if 'Tipul ofertei' in header:
            index = header.index('Tipul ofertei')
            job.job_type = header[index + 1]
        if 'Oras(e)' in header:
            index = header.index('Oras(e)')
            job.city = header[index + 1]
            job.city = filter(lambda it : it != '\t' and it != '\n',job.city)

        job.id_url = self.site[0] + url.split('/')[-2] + '/' + url.split('/')[-1]
        job.id_url = self._compute_hash(job.id_url)
        return job	
