import MySQLdb
import simplejson as json

class DatabaseHandler:
    def __init__(self):
        self.conn = MySQLdb.connect("localhost","root","root","job_agregator")

    def GetJson(self,job):
        dictionar = job.__dict
        dummy = dictionar.pop("id")
        dummy = dictionar.pop("hash")
        retval = json.dumps(dictionar)
        return retval
    
    def Read(self,timestamp):
        rows = []
        cursor = self.conn.cursor();
        data = cursor.execute("select html from jobs_html where date >= %s", [timestamp])
        for html_name in cursor.fetchall():
            rows.append(html_name)
        return rows    

    def Write(self,job):
        job_json = self.GetJson(job)
        hashString = job.hash
        job_id = job.id
        cursor = self.conn.cursor()
        data = cursor.execute("select COUNT(*) from jobs where jobid = %s",job_id)
        size = 0;
        for count in cursor.fetchall():
            ++size
        if(size == 0):
            cursor.execute("insert into jobs(jobid,jobinfo,hash) values(%s, %s, %s)",job_id, job_json, hashString)
        else:
            cursor.execute("UPDATE jobs SET jobinfo = %s, hash = %s WHERE jobid = %s", job_json, hashString, job_id)
            

    
