import MySQLdb
import time

class CrawlerWriter:
    def __init__(self, host, user, password, site, db):
        self.host = host
        self.user = user
        self.password = password
        self.site = site
        self.db = db
        self.table = "jobs_html"
        self.conn = MySQLdb.connect(host=host, user=user,
            passwd=password, db=db)

    def write_job(self, html, url):
        # check if we should write this
        cursor = self.conn.cursor()
        query = "SELECT COUNT(*) FROM " + self.table + " WHERE url = %s"
        cursor.execute(query, url)
        cnt = cursor.fetchone()[0]
        if cnt > 0:
            return False

        cursor = self.conn.cursor()
        query = "INSERT INTO " + self.table + " (`html`, `site`, `url`) VALUES (%s, %s, %s)"
        cursor.execute(query, [html, self.site, url])
        return True
