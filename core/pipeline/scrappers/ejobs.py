from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler
from scrapper_base import ScrapperBase

class Object:
	pass

class EjobsScrapper(ScrapperBase):
    def __init__(self,timestamp):
        ScrapperBase.__init__(self,timestamp)
	pass

    def process_item(self,page,id_url):
        content = page[0]
        html_content = BeautifulSoup(content)
	header = html_content.findAll(text=True)
        header = filter(lambda it : it != '\n' and it != '&nbsp' and it != ' ', header)
	job = Object()

	job.employer = ""
	job.title = ""
	job.level = ""
	job.city = ""
	job.description = ""
	job.job_type = ""
	job.id_url = id_url
	if "Compania:&nbsp; " in header:
		index = header.index("Compania:&nbsp; ")
		job.employer = header[index+1]
	if " candidati" in header:
		index = header.index(" candidati")
		job.title = header[index+1]
	if "Nivel cariera:&nbsp; " in header:
		index = header.index("Nivel cariera:&nbsp; ")
		job.level = header[index+1]
        if "Orasul:&nbsp; " in header:
		index = header.index("Orasul:&nbsp; ")
		job.city = header[index+1]
	if "Tip Job:&nbsp; " in header:
		index = header.index("Tip Job:&nbsp; ")
		job.job_type = header[index+1]
	temp1 = []
	if "CANDIDATUL IDEAL:" in header:
		index = header.index("CANDIDATUL IDEAL:")
		temp1.append( str(header[index].parent.parent.parent))
	if "RESPONSABILITATI / BENEFICII:" in header:
		index = header.index("RESPONSABILITATI / BENEFICII:")
		temp1.append( str(header[index].parent.parent.parent))
	if "DESCRIEREA COMPANIEI:" in header:
		index = header.index("DESCRIEREA COMPANIEI:")
		temp1.append( str(header[index].parent.parent.parent))
	job.description = ''.join(temp1)
        job.salary = 0	

        return job	