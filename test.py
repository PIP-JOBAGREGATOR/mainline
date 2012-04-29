from core.lib.index_manager import IndexManager
import sys

query_string = sys.argv[1]
print query_string

manager = IndexManager()
results = manager.simple_query(query_string)

for result in results:
    print result["title"], result["score"]
