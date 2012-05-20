#/usr/bin/env python

from core.lib.index_manager import IndexManager
import sys
from lucene import *

query_string = sys.argv[1]

initVM()
manager = IndexManager()
results = manager.query(query_string)

ret = []
for result in results:
    ret.append({"title": result["title"], "link": result["url"], "description": result["description"][:200]})
print ret
