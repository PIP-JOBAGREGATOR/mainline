import MySQLdb

from pstep import PipelineStep
from lucene import *

INDEX_PATH = 'job-index'

PARAMS = ["title", "description", "salary", "company"]

class IndexStep(PipelineStep): 
    def __init__(self):
        # Init lucene jvm
        initVM()

        # open store and init analyzer
        self.store = SimpleFSDirectory(File(INDEX_PATH))
        self.analyzer = StandardAnalyzer(Version.LUCENE_CURRENT)

        # Init writer
        self.writer = IndexWriter(self.store, self.analyzer, True, IndexWriter.MaxFieldLength.LIMITED) 

    def read(self):
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor();
        cursor.execute("SELECT %s FROM jobs" % ','.join(PARAMS))

        rows = []
        for row in cursor.fetchall():
            column_index = 0
            row_dict = {}
            for param in PARAMS:
                row_dict[param] = row[column_index]
                column_index += 1
            rows.append(row_dict)
        return rows

    def process_item(self, job):
        print job
        doc = Document()
        for key, value in job.iteritems():
            doc.add(Field(key, str(value), Field.Store.YES, Field.Index.ANALYZED))
        return [doc]

    def close(self):            
        self.writer.close()
        self.store.close()

    def write(self, documents):
        for doc in documents:
            self.writer.addDocument(doc) 
