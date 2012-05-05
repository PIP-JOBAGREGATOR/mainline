import MySQLdb

class AlertDataReader:
	def __init__(self):
		 self.conn = MySQLdb.connect("localhost","root","root","job_agregator")

	def Read(self):
		results = []
		cursor = self.conn.cursor()
		cursor.execute("SELECT user_email,keywords from alerts")
		for row in cursor.fetchall():
			results.append({"mail": row[0], "keywords": row[1]})
		return results

