# WikiMidas

```
Version: 0.1
Author: Lei Mao
Updated: 8/9/2017
Institution: The University of Chicago
```

## Description

WikiMidas is a Python spidering API wrapper program specifically designed for data crawling from MediaWiki APIs (https://www.mediawiki.org/). It could be used to retrieve information from Wikipedia API (https://en.wikipedia.org/w/api.php) and MoeGirl API (https://zh.moegirl.org/api.php) which uses MediaWiki as their APIs. The page content format of MoeGirl is a little bit different to Wikipedia's. The code optimization for MoeGirl is still undergoing.

## Features

Search and retrieve for articles from Wikipedia.

## Dependencies

* re (https://docs.python.org/2/library/re.html)
* bs4 (https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
* requests (http://docs.python-requests.org/en/master/)
* pyquery (https://pythonhosted.org/pyquery/)

## Usage

WikiMidas was wrapped into a class object called "WikiAPI". To use WikiMidas in your Python program:

```python
from wikimidas import WikiAPI
wiki = WikiAPI()
# To search for certain query in Wikipedia
# term is the keyword you are interested in; limit is the maximum number of returns
# the return is a list of relavant article titles found
search_result = wiki.search(term = 'Michael Jordan', limit = 50)
for item in search_result:
    print(item)

# To retrieve article from Wikipedia
# title is the title of the article you want to retrieve from Wikipedia
# the return is article-class object containing 'heading', 'summary', 'content', 'image', 'references' and 'url'
article = wiki.retrieve(title = 'Michael Jordan')
# To view the article content
print article.heading
print article.summary
print article.content
```

The Python script could also be run directly in the shell:

To search article
```shell
python wikimidas.py -s "Michael Jordan"
```

To retrieve article
```shell
python wikimidas.py -r "Michael Jordan"
```

## Disclaimer

I am truely a newbee of data crawling. I learned a lot from the WikiAPI program at https://github.com/richardasaurus/wiki-api, and used some of the codes for my program. The old WikiAPI program has a little bit problem in parsing and getting the correct summary from Wikipedia. I fixed this problem in my version.

## Future Updates

* Add support for MoeGirl API
* Allow spidering large amount of data from the MediaWiki APIs