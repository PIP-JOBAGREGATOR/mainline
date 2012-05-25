import oauth2
import urllib
import json
from linkedin_config import *

def get_client(credentials):
    try:
        consumer = oauth2.Consumer(
            key = API_KEY,
            secret = SECRET_KEY
        )

        token = oauth2.Token(
            key = credentials["oauth_token"],
            secret = credentials["oauth_token_secret"]
        )

        return oauth2.Client(consumer, token)
    except:
        return None

def get_id(credentials):
    try:
        client = get_client(credentials)
        resp, content = client.request(
            uri = '%s:(id)?format=json' % (BASE_PROFILE_FIELDS_URL),
            method = 'GET'
        )

        if resp['status'] == '200':
            return json.loads(content)["id"]
        else:
            print "a crapat linkedin %s" %(resp['status'])
            return None
    except:
        return None


def get_cv(credentials):
    try:
        client = get_client(credentials)
        queryString = ','.join(PROFILE_FIELDS)
        resp, content = client.request(
            uri = '%s:(%s)?format=json' % (BASE_PROFILE_FIELDS_URL, queryString),
            method = 'GET'
        )

        if resp['status'] == '200':
            return content
        else:
            print "a crapat linkedin %s" %(resp['status'])
            return None
    except:
        return None

def get_profile_pic(credentials):
    try:
        client = get_client(credentials)
        resp, content = client.request(
            uri = "https://api.linkedin.com/v1/people/~:(picture-url)?format=json",
            method = "GET"
        )

        if resp['status'] == '200':
            temp = json.loads(content)
            if 'pictureUrl' in temp:
                print "profile pic url: %s" % json.loads(content)['pictureUrl']
                return json.loads(content)['pictureUrl']
            else:
                return ""
        else:
            print "nu a luat profile pic"
            return None
    except:
        return None
