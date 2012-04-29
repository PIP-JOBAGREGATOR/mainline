#!/usr/bin/env python
import time

from crawlers.bestjobs import BestjobsCrawler
from scrappers.bestjobs import BestjobsScrapper

def main():
    start_time = time.time()
    crawlers = []
    crawlers.append(BestjobsCrawler())

    scrappers = []
    scrappers.append(BestjobsScrapper(start_time))

    while True:
        for crawler in crawlers:
            crawler.run()
        for scrapper in scrappers:
            scrapper.run()
        break

if __name__ == '__main__':
    main()
