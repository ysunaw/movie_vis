#-*- coding:utf-8 -*-

'''
WikiMidas
Version: 0.1
Author: Lei Mao
Updated: 8/9/2017
Institution: The University of Chicago
Description: The WikiMidas is a spidering program specifically designed for data crawling from MediaWiki APIs (https://www.mediawiki.org/). It could be used to retrieve information from Wikipedia API (https://en.wikipedia.org/w/api.php) and MoeGirl API (https://zh.moegirl.org/api.php) which uses MediaWiki as their APIs.
Disclaimer: I am truely a newbee of data crawling. I learned a lot from the WikiAPI program at https://github.com/richardasaurus/wiki-api, and used some of the codes for this program.
'''

'''
Notes:
1. The PHP and XML formats have been decrecated in MediaWiki APIs. It is alway recommended to use JSON format (https://www.mediawiki.org/wiki/API:Data_formats).
2. A useful MediaWiki content parsing instruction: https://stackoverflow.com/questions/4452102/how-to-get-plain-text-out-of-wikipedia
'''
import urllib
import re
import argparse
from bs4 import BeautifulSoup
import requests
import csv

def main():
    with open('description.csv', 'r') as dataset:
        reader = csv.DictReader(dataset)
        for line in reader:
            filename = line['actor_id']+'.txt'
            file = open(filename,'w')
            file.write(line['description'])
            file.close()

if __name__ == '__main__':
    main()

