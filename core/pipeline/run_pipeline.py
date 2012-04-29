#!/usr/bin/env python
import time

from crawlers.bestjobs import BestjobsCrawler
from scrappers.bestjobs import BestjobsScrapper
from indexer import IndexStep

def main():
    start_time = time.time()
    crawlers = []
    crawlers.append(BestjobsCrawler())

    scrappers = []
    scrappers.append(BestjobsScrapper(start_time))

    indexer = IndexStep() 

    while True:
#        for crawler in crawlers:
#            crawler.run()
#        for scrapper in scrappers:
#            scrapper.run()
        indexer.run()
        break

if __name__ == '__main__':
    main()
