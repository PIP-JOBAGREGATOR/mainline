#!/usr/bin/env python
import time

from crawlers.bestjobs import BestjobsCrawler
from crawlers.ejobs import EjobsCrawler
from scrappers.bestjobs import BestjobsScrapper
<<<<<<< HEAD
from scrappers.ejobs import EjobsScrapper
=======
from indexer import IndexStep
>>>>>>> a243d11532217f3ab7fa03e0f76910337c9ca34d

def main():
    start_time = time.time()
    crawlers = []
    crawlers.append(BestjobsCrawler())
    crawlers.append(EjobsCrawler())

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
