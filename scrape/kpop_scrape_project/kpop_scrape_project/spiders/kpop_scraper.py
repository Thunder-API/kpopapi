import json
from re import A
from textwrap import indent
from tokenize import group
import scrapy


class IdolSpider(scrapy.Spider):
    name = 'idol'
    start_urls = ['https://dbkpop.com/db/all-k-pop-idols']

    def parse(self, response):
        arr = []
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
            
            arr.append(person_info)

        print(f"============={len(arr)}============")
        with open("../../asset/idol.json", "w", encoding="utf8") as f:
            json.dump(arr, f, indent=4)



class BoyGroupSpider(scrapy.Spider):
    name = 'boy-group'
    start_urls = ['https://dbkpop.com/db/k-pop-boybands']
    
    def parse(self, response):
        arr = []
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
            arr.append(group_info)
        
        print(f"============={len(arr)}============")
        print(arr)
        with open("../../asset/boy-group.json", "w", encoding="utf8") as f:
            json.dump(arr, f, indent=4)


class GirlGroupSpider(scrapy.Spider):
    name = 'girl-group'
    start_urls = ['https://dbkpop.com/db/k-pop-girlgroups']

    def parse(self, response):
        arr = []
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
            arr.append(group_info)
        
        print(f"============={len(arr)}============")
        with open("../../asset/girl-group.json", "w", encoding="utf8") as f:
            json.dump(arr, f, indent=4) 