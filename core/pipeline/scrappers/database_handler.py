import MySQLdb


class DatabaseHandler:
    def __init__(self):
        self.conn = MySQLdb.connect("localhost","root","root","job_agregator")
	
    def Read(self,timestamp,url):
        rows = []
        cursor = self.conn.cursor()
        data = cursor.execute("select html from jobs_html where date >= %s", [timestamp])
	for html_name in cursor.fetchall():
            rows.append(html_name)
	cursor2 = self.conn.cursor()
	urls = cursor2.execute("select url from jobs_html where date >= %s",[timestamp])
	for u in urls:
		temp_string = ""
		if u.find("bestjobs") == True:
			temp_string = "b"
		else :
			temp_string = "e"
		temp = u.split("/")
		url.append(temp_string + temp[len(temp) - 2])
        return rows

    def Write(self,title,description,salary,company):
        params = [title, description, salary, company]
        cursor = self.conn.cursor()
        cursor.execute("insert into jobs(title,description,salary,company) values(%s, %s, %s, %s)", params)
