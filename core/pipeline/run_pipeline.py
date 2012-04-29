#!/usr/bin/env python
import time

from crawlers.bestjobs import BestjobsCrawler
from crawlers.ejobs import EjobsCrawler
from scrappers.bestjobs import BestjobsScrapper
from scrappers.ejobs import EjobsScrapper

def main():
    start_time = time.time()
    crawlers = []
    crawlers.append(BestjobsCrawler())
    crawlers.append(EjobsCrawler())

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
