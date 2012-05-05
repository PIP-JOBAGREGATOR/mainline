#!/usr/bin/env python

from alert_mail import AlertMail
from alerts_table_reader import AlertDataReader
import sys
import os

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir,os.path.pardir)))

from lib.index_manager import IndexManager

WELCOME_MESSAGE = """ Joburi de la dumnezo\n"""

def render_job(suggestion):
    return suggestion["title"] + "\n" + suggestion["url"] + "\n"

def main():
    MailObject = AlertMail()
    ReaderObject = AlertDataReader()
    IndexObject = IndexManager()
    alerts = ReaderObject.Read()
    content = WELCOME_MESSAGE
    for alert in alerts:
        mail = alert["mail"]
        keywords = alert["keywords"]
        suggestions = IndexObject.query(keywords)     
        content += '\n'.join([render_job(suggestion) for suggestion in suggestions])
        MailObject.sendMail(mail,"Sugestii joburi",content)
		


if __name__ == '__main__':
	main()

