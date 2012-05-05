import MySQLdb
import simplejson as json
import time

class DatabaseHandler:
    def __init__(self):
        self.conn = MySQLdb.connect("localhost","root","root","job_agregator")

    def get_json(self, job):
        job_dict = job.__dict__
        return json.dumps(job_dict)

    def Read(self, timestamp, site):
        rows = []
        cursor = self.conn.cursor()
        cursor.execute("SELECT html, url, site from jobs_html WHERE site = %s", [site])
    	for row in cursor.fetchall():
            rows.append({"html": row[0], "url": row[1]})
        return rows

    def is_diff(self, job_dict1, job_dict2):
        if len(job_dict1) != len(job_dict2):
            return true
        
        for key in job_dict1:
            val1 = job_dict1.get(key,none)
            val2 = job_dict2.get(key,none)
            if val1 != val2:
                return true
        return false
        
    def Write(self, job):
        job_json = self.get_json(job)
        hashString = job.hash
        job_id = job.id_url
        timestamp = int (time.time())
        
        job_dict = job.__dict__
        update = False
        insert = True
        
        cursor = self.conn.cursor()
        cursor.execute("select job_info from jobs where job_id = %s", job_id)
        for row in cursor.fetchall():
            insert = False
            job_info = row[0]
            if is_diff(job_dict, job_info)
                update = True
        
        if insert == True:
            cursor.execute("insert into jobs(job_id, job_info, hash, last_update) values(%s, %s, %s)", [job_id, job_json, hashString, timestamp])
        elif update == True:
            cursor.execute("UPDATE jobs SET job_info = %s, hash = %s, last_update = %s WHERE job_id = %s", [job_json, hashString, job_id, timestamp])
            
