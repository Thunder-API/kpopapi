# from cmath import exp
# from gettext import install
# import os
# from re import S
# from statistics import quantiles
# from jmespath import search
# import selenium
# from selenium import webdriver
# import time
# import io
# import requests
# from PIL import Image
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.common.exceptions import ElementClickInterceptedException, ElementNotInteractableException

# opts = webdriver.ChromeOptions()
# opts.headless = True

# driver = webdriver.Chrome(ChromeDriverManager(),install(), options=opts)


# os.chdir('asset')

# def scroll_to_end(driver):
#     driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#     time.sleep(5)

# def get_image_urls(n_total_imgs, driver, q='Car'):
#     search_url = f'https://www.google.com/search?q={q}&tbm=isch&tbs=sur%3Afc&hl=en&ved=0CAIQpwVqFwoTCKCa1c6s4-oCFQAAAAAdAAAAABAC&biw=1251&bih=568'
#     driver.get(search_url)

#     img_urls = set()
#     img_count = 0
#     results_start = 0

#     while (img_count < n_total_imgs):
#         scroll_to_end(driver)

#         thumbnail_results = driver.find_elements_by_css_selector('img.Q4LuWd')
#         print(f"Found: {len(thumbnail_results)} Results!!! :)")

#         for img in thumbnail_results[results_start: len(thumbnail_results)] :
#             img.click()
#             time.sleep(2)
#             actual_images = driver.find_elements_by_css_selector('img.n3VNCb')

#             for actual_image in actual_images:
#                 url = actual_image.get_attribute('src')
#                 if 'https' in url:
#                     img_urls.add(url)
            
#             img_count = len(img_urls)

#             if img_count >= n_total_imgs:
#                 print(f"Found {img_count} image links")
#                 break
#             else:
#                 print(f"Found: {img_count} images. Looking for more images!")
#                 results_start = len(thumbnail_results)
#     return img_urls

           
# def download_images(folder_path, file_name, url):
    

# for i, img_element in enumerate(img_results):
#     try:
#         img_element.click()
#         time.sleep(20)

#     except ElementClickInterceptedException or ElementNotInteractableException as err:
#         print(err)


# # Saving images to folder

# for i, url in enumerate(img_urls):
#     file_name = f"{i:150}.jpg"
#     try:
#         image_content = requests.get(url).content
#     except Exception as e:
#         print(f"Couldn't download file error: {e}")

#     try:
#         image_file = io.BytesIO(image_content)
#         image = Image.open(image_file).convert('RGB')

#         file_path = os.path.join(os.getcwd(), file_name)

#         with open(file_path, 'wb') as f:
#             image.save(f, "JPEG", quality=85)
#         print(f"SAVED Image at {file_path}")
#     except Exception as e:
#         print(f"Couldn't Save the image {e}")
