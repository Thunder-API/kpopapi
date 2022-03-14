from re import A
from tokenize import group
import scrapy


class IdolSpider(scrapy.Spider):
    name = 'idol'
    start_urls = ['https://dbkpop.com/db/all-k-pop-idols']

    def parse(self, response):
        for row in response.css('tr')[2:]:

            data = [td.css('a::attr(href)').get() if td.css(
                'a') else td.css('td::text').get() for td in row.css('td')]

            col = [
                'Profile',
                'Stage Name',
                'Full Name',
                'Korean Name',
                'K. Stage Name',
                'Date of Birth',
                'Group',
                'Country',
                'Second Country',
                'Height',
                'Weight',
                'Birthplace',
                'Other Group',
                'Former Group',
                'Gender',
                'Position',
                'Instagram',
                'Twitter'
            ]
            person_info = {k: data[i] for i, k in enumerate(col)}

            # Preprocess Instagram, Twitter info
            if person_info['Instagram'] == "https:/www.instagram.com/":
                person_info['Instagram'] = None

            if person_info['Twitter'] == "https:/www.twitter.com/":
                person_info['Twitter'] = None

            yield person_info


class BoyGroupSpider(scrapy.Spider):
    name = 'boy-group'
    start_urls = ['https://dbkpop.com/db/k-pop-boybands']

    def parse(self, response):
        for row in response.css('tr')[1:]:
            data = [td.css('a::attr(href)').get() if td.css(
                'a') else td.css('td::text').get() for td in row.css('td')]

            col = [
                'Group Profile',
                'Group Name',
                'Short Group Name',
                'Korean Name',
                'Date of Debut',
                'Company',
                'Members',
                'Orginal Members',
                'Fanclub Name',
                'Active',
            ]
            group_info = {k: data[i] for i, k in enumerate(col)}

            yield group_info


class GirlGroupSpider(scrapy.Spider):
    name = 'girl-group'
    start_urls = ['https://dbkpop.com/db/k-pop-girlgroups']

    def parse(self, response):
        for row in response.css('tr')[1:]:
            data = [td.css('a::attr(href)').get() if td.css(
                'a') else td.css('td::text').get() for td in row.css('td')]

            col = [
                'Group Profile',
                'Group Name',
                'Short Group Name',
                'Korean Name',
                'Date of Debut',
                'Company',
                'Members',
                'Orginal Members',
                'Fanclub Name',
                'Active',
            ]
            group_info = {k: data[i] for i, k in enumerate(col)}

            yield group_info


class SongSpider(scrapy.Spider):
    name = 'songs'
    start_urls = ['https://dbkpop.com/db/k-pop-music-videos']

    def parse(self, response):
        for row in response.css('tr')[2:]:
            data = [td.css('a::attr(href)').get() if td.css(
                'a') else td.css('td::text').get() for td in row.css('td')]

            col = [
                'Post',
                'Date',
                'Artist',
                'Song Name',
                'Korean name',
                'Director',
                'Video',
                'Type',
                'Release'
            ]
            song_info = {k: data[i] for i, k in enumerate(col)}

            yield song_info
