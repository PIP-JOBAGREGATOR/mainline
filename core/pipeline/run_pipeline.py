#!/usr/bin/env python

from crawlers.bestjobs import BestjobsCrawler

def main():
    crawlers = []
    crawlers.append(BestjobsCrawler())

    while True:
        for crawler in crawlers:
            crawler.run()
        break

if __name__ == '__main__':
    main()
