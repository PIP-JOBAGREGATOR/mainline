#!/usr/bin/env python
import time

from crawlers.bestjobs import BestjobsCrawler
from crawlers.ejobs import EjobsCrawler
from scrappers.bestjobs import BestjobsScrapper
from scrappers.ejobs import EjobsScrapper

from indexer import IndexStep

def main():
    start_time = int(time.time())
    crawlers = []
    crawlers.append(BestjobsCrawler())
    crawlers.append(EjobsCrawler())

    scrappers = []
    scrappers.append(BestjobsScrapper(start_time))
    scrappers.append(EjobsScrapper(start_time))

    indexer = IndexStep() 

    while True:
        print "Running crawlers"
        for crawler in crawlers:
            crawler.run()
        print "Running scrappers"
        for scrapper in scrappers:            
            scrapper.run()
        print "Indexing... God Speed"
        indexer.run()

        break

if __name__ == '__main__':
    main()
