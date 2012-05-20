import json
import os.path
import sys
import urllib
import MySQLdb
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'core', 'lib')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'linkedin')))

from job_map import COLLEGE_JOB
from index_manager import IndexManager
from django.http import HttpResponse
from linkedin_config import *
from cookie import *
from query import *

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

def process_description(description):
    description = re.sub(r'<[^>]*?>', '', description)
    description = re.sub(r'&nbsp;', '', description)
    return description[:200]

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
                result["descriere"] = process_description(job["description"])
                result["link"] = job['url']
                print result
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

def linkedin(request):
    f = open('linkedin.html', 'r')
    return HttpResponse(f.read())


#exchange JSAPI Token for REST API OAuth Token
#and store it in a session
def oauth(request):
    response = HttpResponse()

    cookie_name = 'linkedin_oauth_%s' % API_KEY
    if cookie_name not in request.COOKIES:
        response.content = '%s cookie not found' % (cookie_name,)
        response.status_code = 404
    else:
        credentials_json = urllib.unquote(request.COOKIES[cookie_name])
        credentials = json.loads(credentials_json)

        bearer_token = credentials['access_token']
        member_id = credentials['member_id']

        #signature validation succeeded
        if validate_signature(credentials) == True:
            oauth = exchange(credentials)
            if oauth is not None:
                request.session['token'] = oauth
                response.content = 'token exchange ok'
                response.status_code = 200
            else:
                response.content = 'token exchange failed'
                response.status_code = 404
        #signature validation failed
        else:
            response.content = 'signature validation failed'
            response.status_code = 404

    return response


def update_cv(pers_id, cv_json):
    response = HttpResponse()

    if pers_id is not None and cv_json is not None:
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor()
        cursor.execute("SELECT id "
                       "FROM resume "
                       "WHERE id = %s", [pers_id])

        insert = True
        for row in cursor.fetchall():
            insert = False

        if insert == True:
            cursor.execute("INSERT INTO resume "
                           "VALUES(%s, %s)", [pers_id, cv_json])
        else:
            cursor.execute("UPDATE resume "
                           "SET text = %s "
                           "WHERE id = %s", [cv_json, pers_id])
        cursor.close()
        conn.commit()
        conn.close()

        response.content = 'refresh successful'
        response.status_code = 200
    else:
        response.content = 'refresh resume failed'
        response.status_code = 404

    return response


def cv_refresh(request):
    oauth = request.session['token']
    pers_id = get_id(oauth)
    cv_json = get_cv(oauth)

    return update_cv(pers_id, cv_json)


def cv_set(request):
    response = HttpResponse()

    if request.method == 'POST':
        oauth = request.session['token']
        pers_id = get_id(oauth)
        cv_json = request.POST.get('content')
        return update_cv(pers_id, cv_json)
    else:
        response.content = 'bad request ... use POST'
        response.status_code = 404

    return response


def cv_get(request):
    response = HttpResponse()

    oauth = request.session['token']
    pers_id = get_id(oauth)

    if pers_id is not None:
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor()
        cursor.execute("SELECT text "
                       "FROM resume "
                       "WHERE id = %s", [pers_id])

        if cursor.rowcount == 0:
            response.content = 'no resume stored'
            response.status_code = 404
        else:
            row = cursor.fetchone()
            response.content = row[0]
            response.status_code = 200

        cursor.close()
        conn.close()
    else:
        response.content = 'error'
        response.status_code = 404

    return response
