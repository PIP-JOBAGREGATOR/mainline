import json
import os.path
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'core', 'lib')))

from index_manager import IndexManager
from django.http import HttpResponse

RESULTS_PER_PAGE = 10

def search(request):
    response = HttpResponse()

    if request.method == 'POST':
        content = request.POST.get('content')
        data = json.loads(content)

        offset = data.get("offset", 0)
        size = data.get("size", RESULTS_PER_PAGE)
        queryString = data["queryString"]
        cv = data.get("cv", "")

        index = IndexManager()

        temp = index.query(queryString)
        results = []
        for job in temp:
            result = {}
            result["titlu"] = job['title']
            result["descriere"] = job['description'][:200]
            result["link"] = job['url']
            results.append(result)      

        response.content = json.dumps(results)
        response.status_code = 200
        index.close()
    else:
        response.status_code = 400

    return response;

