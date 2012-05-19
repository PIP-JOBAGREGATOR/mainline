import json
import os.path
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'core', 'lib')))

from index_manager import IndexManager
from django.http import HttpResponse

RESULTS_PER_PAGE = 10

def get_positions(cv):
    positions = cv["positions"]["values"]
    return [pos["title"] for pos in positions]

def get_education_jobs(cv):
    educations = cv["educations"]["values"]
    results = []
    for edu in educations:
        school_name = edu["schoolName"].lower()
        common_bits = {}
        for key in COLLEGE_JOB:
            school_bits = set(school_name.split(" "))
            college_bits = set(key.lower().split(" "))
            common_bits[key] = school_bits & college_bits

        for key in common_bits:
            if len(common_bits) > 2:
                results.extend(COLLEGE_JOB[key])

    return results

def parse_cv(cv):
    jobs = get_positions(cv)
    jobs.extend(get_education_jobs(cv))
    return jobs

def search(request):
    try:
        response = HttpResponse()

        if request.method == 'POST':
            content = request.POST.get('content')
            data = json.loads(content)

            offset = data.get("offset", 0)
            size = data.get("size", RESULTS_PER_PAGE)
            queryString = data["queryString"]
            cv = data.get("cv", "")
            queryString += " " + ' '.join(parse_cv(cv))    

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
    except:
        import traceback
        traceback.print_exc()

    return response
