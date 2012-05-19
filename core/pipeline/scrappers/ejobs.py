from BeautifulSoup import BeautifulSoup
import urllib
from database_handler import DatabaseHandler
from scrapper_base import ScrapperBase
import re

class Object:
	pass

class EjobsScrapper(ScrapperBase):
    def __init__(self,timestamp):
        ScrapperBase.__init__(self,timestamp)
        self.site = 'ejobs'

    def process_item(self, page):
        content = page["html"]
        url = page["url"]

        html_content = BeautifulSoup(content)
    	header = html_content.findAll(text=True)
        header = filter(lambda it : it != '\n' and it != '&nbsp' and it != ' ', header)
        job = Object()

        job.employer = ""
        job.title = ""
        job.level = ""
        job.url = url
        job.city = ""
        job.description = ""
        job.job_type = ""
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
        
        job_parts = []
        if "CANDIDATUL IDEAL:" in header:
            index = header.index("CANDIDATUL IDEAL:")
            job_parts.append( str(''.join(header[index].parent.parent.parent.findAll(text=True))))
        if "RESPONSABILITATI / BENEFICII:" in header:
            index = header.index("RESPONSABILITATI / BENEFICII:")
            job_parts.append( str(''.join(header[index].parent.parent.parent.findAll(text=True))))            
        if "DESCRIEREA COMPANIEI:" in header:
            index = header.index("DESCRIEREA COMPANIEI:")
            job_parts.append(str(''.join(header[index].parent.parent.parent.findAll(text=True))))
        
        job.description = ''.join(job_parts)
        job.salary = 0	
        check_salary = re.findall("[0-9]+ euro", content, flags=re.IGNORECASE)
        check_salary.extend(re.findall("[0-9]+ ron", content, flags=re.IGNORECASE))
        check_salary.extend(re.findall("[0-9]+ dol", content, flags=re.IGNORECASE))
        check_salary.extend(re.findall("[0-9]+ $", content, flags=re.IGNORECASE))
        if len(check_salary) > 0 : 
            job.salary = check_salary[0] 

        job.id_url = self.site[0] + url.split('/')[-2] 

        return job	
