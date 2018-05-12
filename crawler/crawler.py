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
'''
"Requests" is an elegant and simple HTTP library for Python, built for human beings (http://docs.python-requests.org/en/master/).
Its major function in this project is to request data from API.
'''
from pyquery import PyQuery as pq
'''
"Pyquery" allows you to make jquery queries (query information) on xml documents
(https://pythonhosted.org/pyquery/).
Its major function in this project is to parse and get the information of interest from the xml-formatted data requested from API through Python library "requests".
'''

# Wikipedia urls
uri_scheme = 'https'
api_uri = 'wikipedia.org/w/api.php'
locale_default = 'en'
article_uri = 'wikipedia.org/wiki/'
'''
# MoeGirl urls
uri_scheme = 'https'
api_uri = 'moegirl.org/api.php'
locale_default = 'zh'
article_uri = 'moegirl.org/'
'''

# Common sub sections to exclude from output
UNWANTED_SECTIONS = (
    'External links and resources',
    'External links',
    'Navigation menu',
    'See also',
    'References',
    'Further reading',
    'Contents',
    'Official',
    'Other',
    'Notes',
    'Bibliography',
    'Awards and honors',
)

# Message shown if there is no article with the title provided
EMPTY_MESSAGE = '<b>Wikipedia does not have an article with this exact name.</b>'

class Article(object):

    def __init__(self, data = None):
        data_default = {'heading': '', 'image': '', 'summary': '', 'content': '', 'references': '', 'url': ''}
        if data == None:
            data = data_default
        # Using dictionary.get('key') is a much better habit than using dictionary['key']
        self.heading = data.get('heading')
        self.image = data.get('image')
        self.summary = data.get('summary')
        self.content = data.get('content')
        self.references = data.get('references')
        self.url = data.get('url')

class WikiAPI(object):

    def __init__(self, options = None):
        if options is None:
            options = {}
        self.options = options
        # Set locale to locale_default if not spcified
        if 'locale' not in options:
            self.options['locale'] = locale_default

    def search(self, term, limit = 10):
        '''
        Search related items on MediaWiki using Opensearch API.
        https://www.mediawiki.org/wiki/API:Opensearch
        The JSON format returns an array containing the search query and an array of result titles.
        '''

        # Define search parameters
        # Parameter description could be found at https://www.mediawiki.org/wiki/API:Opensearch
        term = term.decode('utf-8')
        search_params = {
            'action': 'opensearch', # use 'opensearch' API
            'search': term, # search term that the user provided
            'format': 'json', # retrieved data format
            'limit': limit # maximum number of results to return (default:10, maximum: 500 or 5000?)
        }
        # Specify API url
        url = u"{scheme}://{locale_sub}.{hostname_path}".format(
            scheme = uri_scheme,
            locale_sub = self.options['locale'],
            hostname_path = api_uri
        )
        # Retrieve data from API url
        # The data retrieved from Opensearch API is an array
        # Here is a sample return from Opensearch API: https://en.wikipedia.org/w/api.php?action=opensearch&search=api&limit=10&namespace=0&format=jsonfm
        response = requests.get(url, params = search_params)
        # Parse the retrieved data to json format
        response_json = response.json()
        # Return search results as titles
        # response_json[0] is the query term, response_json[1] is the result title, response_json[2] is the result abstract, response_json[3] is the result url to the web page
        results = response_json[1]

        return results

    def retrieve_deprecated(self, title):
        '''
        Retrieve article with the title from MediaWiki using TextExtracts API Extention.
        https://www.mediawiki.org/wiki/Extension:TextExtracts
        This does not work with the MediaWiki which has not installed the TextExtracts API Extention.
        It is not powerful compared to the extraction and process from the raw webpage.
        '''

        # Define retrieve parameters
        # Parameter description could be found at https://www.mediawiki.org/wiki/Extension:TextExtracts
        search_params = {
            'action': 'query', # TextExtracts extention was integrated with the query action
            'titles': title, # a list of titles to work on (here we only work on one single title)
            'format': 'json', # retrieved data format
            'prop': 'extracts', # makes us use the TextExtracts extension
            'explaintext': True, # return extracts as plain text instead of limited HTML

        }

        '''
        # A more comprehensive list of parameters
        # It should be noted that for 'exintro' and 'explaintext', True or False does not affect the query result. To remove the effect, simply remove them from the parameter list.
        search_params = {
            'action': 'query', # TextExtracts extention was integrated with the query action
            'titles': title, # a list of titles to work on
            'format': 'json', # retrieved data format
            'prop': 'extracts', # makes us use the TextExtracts extension
            'exintro': True, # return only content (summary) before the first section
            'explaintext': True, # return extracts as plain text instead of limited HTML
            'exlimit': 'max', # how many extracts to return. (Multiple extracts can only be returned if exintro is set to true.) No more than 20 (20 for bots) allowed. Type: integer or max

        }
        '''

        # Specify API url
        url = u"{scheme}://{locale_sub}.{hostname_path}".format(
            scheme = uri_scheme,
            locale_sub = self.options['locale'],
            hostname_path = api_uri
        )
        # Retrieve data from API url
        # The data retrieved from the API using TextExtracts extention is in JSON format
        # Here is a sample return from the API using TextExtracts extention: https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=Barack%20Obama&redirects=
        response = requests.get(url, params = search_params)
        # Parse the retrieved data to json format
        response_json = response.json()

        page_content = response_json['query']['pages'][response_json['query']['pages'].keys()[0]]['extract']
        page_title = response_json['query']['pages'][response_json['query']['pages'].keys()[0]]['title']
        page_id = response_json['query']['pages'][response_json['query']['pages'].keys()[0]]['pageid']
        page_summary = page_content.split('\n\n\n==')[0]

        return

    def retrieve(self, title):
        '''
        Retrieve and parse article content with the title from MediaWiki webpage without using API.
        '''

        title = title.decode('utf-8')
        url = u'{scheme}://{locale_sub}.{hostname_path}{article_title}'.format(
            scheme = uri_scheme,
            locale_sub = self.options['locale'],
            hostname_path = article_uri,
            article_title = title
        )
        # print(url)
        response = requests.get(url)
        response_content = response.content # response_content is the html content of the url webpage as string

        # Check if an article with the title provided could be found.
        empty_regex = re.compile(EMPTY_MESSAGE)
        if re.findall(pattern = empty_regex, string = response_content) != []:
            print("No article with such title found.")
            return Article()

        # Make PyQuery object
        html = pq(response_content)
        html_summary = pq(response_content[:response_content.find('<h2>')]) # summary content is right before the first <h2> section
        # html_summary = pq(re.findall(pattern = r'(.*?)<h2>', string = response_content, flags = re.DOTALL)[0]) # alternative way to extract summary content using regualr expression, but might be memory-expensive

        # Parse MediaWiki page content using PyQuery
        # Brief instruction
        # '#' is used for 'id', '.' is used for class
        data = {}
        paragraphs = html('body').find('h2, p') # content paragraphs are wrapped inside the <p> and <h2>
        # paragraphs = html('.mw-content-ltr').find('p') # content paragraphs are wrapped inside the class 'mw-content-ltr' or id 'mw-content-text'
        paragraphs_summary = html_summary('.mw-content-ltr').find('p') # summary content paragraphs are wrapped inside the class 'mw-content-ltr' or id 'mw-content-text'
        image_url = html('body').find('.image').find('img').attr('src') # find the url to the first image of the article
        references = html('body').find('.references') # reference are wrapped inside the class 'references'
        data['heading'] = html('#firstHeading').text() # heading might be different to the query title
        data['image'] = 'http:{url}'.format(url = image_url)
        data['summary'] = ''
        data['content'] = ''
        data['url'] = url

        # Gather references
        data['references'] = []
        for ref in references.items():
            data['references'].append(self._strip_text(ref.text()))

        # Gather summary
        # The summary is right before the first <h2> section in the Wikipedia page html.
        summary_max = 2000
        chars = 0
        for paragraph in paragraphs_summary.items():
            if chars < summary_max:
                chars += len(paragraph.text())
                text_no_tags = self._strip_html(paragraph.outer_html())
                stripped_summary = self._strip_text(text_no_tags)
                data['summary'] += stripped_summary

        # Gather full content
        for idx, paragraph in enumerate(paragraphs.items()):
            if idx == 0:
                data['content'] += data['heading']

            clean_text = self._strip_text(paragraph.text())
            if clean_text:
                data['content'] += '\n\n' + clean_text

        data['content'] = self._remove_ads_from_content(data['content']).strip()

        # Combine data to article object
        article = Article(data)

        return article

    def _strip_html(self, text):

        return BeautifulSoup(text, 'lxml').text

    def _strip_text(self, text):
        """
        Removed unwanted information from article.
        """

        # Remove citation numbers, such as '[12]', '[36]'
        text = re.sub(r'\[\d+]', '', text)
        # Correct spacing around fullstops + commas, such as correcting '   . ' to '. '
        text = re.sub(r' +[.] +', '. ', text)
        text = re.sub(r' +[,] +', ', ', text)
        # Remove sub heading edits tags
        text = re.sub(r'\s*\[\s*edit\s*\]\s*', '\n', text)
        # Remove unwanted areas
        text = re.sub(
            '|'.join(UNWANTED_SECTIONS), '', text, flags = re.I | re.M | re.S
        )

        return text

    def _remove_ads_from_content(self, text):
        """
        Returns article content without references to Wikipedia.
        """

        pattern = r'([^.]*?Wikipedia[^.]*\.)'
        return re.sub(pattern, '', text)

#def main1():
#
#    parser = argparse.ArgumentParser(description = 'Designate function and keywords')
#    group = parser.add_mutually_exclusive_group()
#    group.add_argument('-s','--search', action = 'store_true', help = 'search article')
#    group.add_argument('-r','--retrieve', action = 'store_true', help = 'retrieve article')
#    parser.add_argument('keywords', type = unicode, help = 'keywords')
#    args = parser.parse_args()
#
#    if args.search:
#        wiki = WikiAPI()
#        results = wiki.search(term = args.keywords, limit = 50)
#        print ("Query: %s" %args.keywords)
#        print ("Number of Terms Found: %d" %len(results))
#        print ("Search Results:")
#        for result in results:
#            print(result)
#
#    if args.retrieve:
#        wiki = WikiAPI()
#        article = wiki.retrieve(title = args.keywords)
#        print(article.heading.encode('gbk', 'ignore'))
#        print('-'*50)
#        print(article.summary.encode('gbk', 'ignore'))
#        #        print('-'*50)
#        #print article.content.encode('gbk', 'ignore')

def main():
    with open('final_Actors.csv', 'r') as dataset:
        reader = csv.DictReader(dataset)
        
        with open('description.csv', 'w') as output:
            fieldnames =['actor_id','name','description','image url']
            writer = csv.DictWriter(output, fieldnames = fieldnames)
            
            writer.writeheader();
            num = 1
            for line in reader:
                wiki = WikiAPI()
                keyword = line['name']
#                keyword = line['name'].encode('utf-8')
#                keyword = unicode(keyword, errors = 'ignore')
                article = wiki.retrieve(title = keyword)
                result = article.summary.encode('gbk', 'ignore')
                image_url = ''
                image_url = article.image.encode('gbk', 'ignore')
                imagename = line['id'] + '.jpg'
                debug = 'crawling sucessfully at line {0} for actor {1}'.format(num, line['name'])
                writer.writerow({'actor_id': line['id'],'name': line['name'], 'description': result, 'image url': image_url})
                if image_url != '' and image_url != 'http:None':
                    urllib.urlretrieve(image_url, imagename)
                    debug = debug + 'with image'
                else:
                    debug = debug + 'without image'
                print(debug)
#                print result
                num = num +1

if __name__ == '__main__':
    main()

