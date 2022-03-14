import os
from selenium import webdriver
import time
import json
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By

site_url = 'https://dbkpop.com/db/k-pop-music-videos/'
s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=s)

song_data = []

driver.get(site_url)

# Change Drop-down menu to 'All' option 
select = Select(driver.find_element(By.CSS_SELECTOR, 'select.wdt-selectpicker'))
select.select_by_visible_text('All')
time.sleep(3)

# For Each row (Skip first 2 rows)
# for row in driver.find_elements(By.CSS_SELECTOR, '#table_1 tr')[2:4]:
#     data = []

#     for td in row.find_elements(By.CSS_SELECTOR, 'td'):

#         # If data type is link, extract href instead of normal text
#         if len(td.find_elements(By.CSS_SELECTOR, 'a')) > 0:
#             data.append(td.find_element(By.CSS_SELECTOR, 'a').get_attribute('href'))
#         else:
#             data.append(td.text)
            
#     col = [
#         'Post',
#         'Date',
#         'Artist',
#         'Song Name',
#         'Korean Name',
#         'Director', 
#         'Video',
#         'Type',
#         'Release',
#     ]

#     parsed_song_info = {k: data[i] for i, k in enumerate(col)}
#     print(parsed_song_info)

#     song_data.append(parsed_song_info)

# Write JSON file
with open('../songs-data.json', 'w', encoding='utf8') as f:
    json.dump(song_data, f, indent=4, ensure_ascii=True)