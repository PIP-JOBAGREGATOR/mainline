import os
import MySQLdb
import simplejson as json

from lucene import *

INDEX_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'pipeline', 'job-index'))

class IndexManager():
    def __init__(self):
        try:
            getVMEnv().attachCurrentThread()
        except:
            initVM()

        self.store = SimpleFSDirectory(File(INDEX_PATH))
        self.analyzer = StandardAnalyzer(Version.LUCENE_CURRENT)
        self.searcher = IndexSearcher(self.store, True)
        self.reader = IndexReader.open(self.store, False)

    def doc_to_dict(self, doc):
        #fields = self.reader.getFieldNames(IndexReader.FieldOption.ALL)
 	fields = ["title","description","url"]
        job_dict = {}
        for field in fields:
            try:
                job_dict[field] = doc[field]
            except:
                pass
        return job_dict

    def scoredocs_to_jobs(self, scoreDocs):
        docs = []
        for score_doc in scoreDocs:
            docid = score_doc.doc
            doc = self.searcher.doc(docid)
            job_dict = self.doc_to_dict(doc)
            job_dict["score"] = score_doc.score
            docs.append(job_dict)
        return docs
 
    def build_query(self, query_string, additional_fields):
        should = BooleanClause.Occur.SHOULD
        must = BooleanClause.Occur.MUST

        field_names = ["title", "description"]
        field_values = [query_string, query_string]
        for key, value in additional_fields.iteritems():
            field_names.append(key)
            field_values.append(value)

        flags = [must, should]
        flags.extend([must] * len(additional_fields))

        query = MultiFieldQueryParser.parse(Version.LUCENE_CURRENT,
                                            field_values,
                                            field_names,
                                            flags,
                                            self.analyzer)
        return query

    def close(self):
        self.searcher.close()
        self.reader.close()
        self.store.close()

    def get_last_jobs(self, count=20, offset=0):
        conn = MySQLdb.connect("localhost","root","root","job_agregator")

        query = "SELECT job_info FROM jobs ORDER BY `last_update` LIMIT %s, %s"
        cursor = conn.cursor()
        cursor.execute(query, [offset, count])
        results = []
        for row in cursor.fetchall():
            job_info = json.loads(row[0])
            results.append(job_info)
        return results

    def query(self, query_string, additional_fields={}):
        if query_string.strip() == "":
            return self.get_last_jobs()
            
        query = self.build_query(query_string, additional_fields)
        topDocs = self.searcher.search(query, 20)
        return self.scoredocs_to_jobs(topDocs.scoreDocs)
