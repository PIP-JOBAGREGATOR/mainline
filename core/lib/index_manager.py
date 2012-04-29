import os

from lucene import *

INDEX_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'pipeline', 'job-index'))

class IndexManager():
    def __init__(self):
        initVM()
        self.store = SimpleFSDirectory(File(INDEX_PATH))
        self.analyzer = StandardAnalyzer(Version.LUCENE_CURRENT)
        self.searcher = IndexSearcher(self.store, True)
        self.reader = IndexReader.open(self.store, False)

    def build_query(self, query_string):    
        query = MultiFieldQueryParser.parse(Version.LUCENE_CURRENT,
                                            [query_string, query_string],
                                            ["title", "description"],
                                            self.analyzer)
        return query

    def simple_query(self, query_string):
        query = self.build_query(query_string)
        topDocs = self.searcher.search(query, 20)
        docs = []
        for score_doc in topDocs.scoreDocs:
            docid = score_doc.doc
            doc = self.searcher.doc(docid)

            doc_dict = {"title": doc["title"], "description": doc["description"], "score": score_doc.score}
            docs.append(doc_dict)

        return docs
