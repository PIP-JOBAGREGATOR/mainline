import smtplib
from email.mime.text import MIMEText

class AlertMail :
        def __init__(self):
                pass
        def sendMail(self, To , Subject, Content):
                msg = MIMEText(Content)
                From = "dumnezeu@scesiltium-labs.ro"
                msg['Subject'] = Subject
                msg['To'] = To
                msg['From'] = From

                try:
                        smtp = smtplib.SMTP('localhost')
                        smtp.sendmail(From , To , msg.as_string())
                except Exception as strerror:
                        print strerror
