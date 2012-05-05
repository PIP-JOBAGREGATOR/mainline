from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler
from scrapper_base import ScrapperBase

class Object:
	pass

class BestjobsScrapper(ScrapperBase):
    def __init__(self,timestamp):
        ScrapperBase.__init__(self,timestamp)
	pass

    def process_item(self,page,id_url):
	
        content = page[0]
        html_content = BeautifulSoup(content)
        job_title_tag = html_content.findAll("h1")[0]

        job = Object()
	
        job.employer = ""
        job.job_title = ""
        job.level = ""
        job.city = ""
        job.description = ""
        job.job_type = ""
        job.id_url = id_url
        job.department = ""
	job.salary = ""

        job.job_title = job_title_tag.text
        job.employer = job_title_tag.parent.findAll("a")[0].findAll(text=True)
        job.description = ''.join( html_content.findAll("table")[6].findAll(text=True))
        job.salary = 0
	header = html_content.findAll("table")[2].findAll(text = True)
	header = filter( lambda  it: it != '\n' and it != ' ' and it != '&nbsp;',header)
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
	check_salary = re.findall("[0-9]+ euro",html_content)
	check_salary.join(re.findall("[0-9]+ ron",html_content))
	check_salary.join(re.findall("[0-9]+ dol",html_content))
	check_salary.join(re.findall("[0-9]+ $",html_content))
	check_salary.join(re.findall("[0-9]+ €",html_content))
	if check_salary.size() > 0 : 
		job.salary = check_salary[0]	
        return job	
