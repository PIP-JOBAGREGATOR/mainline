import MySQLdb
import simplejson as json

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

    def Write(self, job):
        job_json = self.get_json(job)
        hashString = job.hash

        job_id = job.id_url

        cursor = self.conn.cursor()
        cursor.execute("select COUNT(*) from jobs where job_id = %s", job_id)       
        for row in cursor.fetchall():
            size = row[0]
        if size == 0:
            cursor.execute("insert into jobs(job_id, job_info, hash) values(%s, %s, %s)", [job_id, job_json, hashString])
        else:
            cursor.execute("UPDATE jobs SET job_info = %s, hash = %s WHERE job_id = %s", [job_json, hashString, job_id])
