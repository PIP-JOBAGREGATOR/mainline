import MySQLdb


class DatabaseHandler:
    def __init__(self):
        self.conn = MySQLdb.connect("localhost","panda","","job_agregator")
	
    def Read(self,timestamp):
        rows = []
        cursor = self.conn.cursor();
        data = cursor.execute("select html from jobs_html where date >= %s", [timestamp])
        for html_name in cursor.fetchall():
            rows.append(html_name)
        return rows

    def Write(self,title,description,salary,company):
        params = [title, description, salary, company]
        cursor = self.conn.cursor()
        cursor.execute("insert into jobs(title,description,salary,company) values(%s, %s, %s, %s)", params)
