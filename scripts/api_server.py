from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import re
import json

# ---------------- Terminal text formatting ----------------
def redText(Text): return(f"\033[91m{Text}\033[0m")
def greenBackground(Text): return "\x1b[6;30;42m" + Text + "\x1b[0m"

def greenText(Text): return(f"\033[92m{Text}\033[0m")
def headerText(Text): return(f"\033[95m{Text}\033[0m")
def blueText(Text): return(f"\033[94m{Text}\033[0m")
def cyanText(Text): return(f"\033[96m{Text}\033[0m")
def yellowText(Text): return(f"\033[93m{Text}\033[0m")
def redText(Text): return(f"\033[91m{Text}\033[0m")
def boldText(Text): return(f"\033[1m{Text}\033[0m")
def underlineText(Text): return(f"\033[4m{Text}\033[0m")
# ----------------------------------------------------------

app = Flask(__name__)

def retrieve_weather_data():
    url = "https://weather.com/en-AU/weather/today/l/ASXX0023:1:AS?Goto=Redirected"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup

def get_soup(url):
    response = requests.get(url)
    html_content = response.content
    return BeautifulSoup(html_content, 'html.parser')

def get_time(a_tag):
    return a_tag.find('span', class_='Ellipsis--ellipsis--3ADai').text

def get_temperature(a_tag):
    return a_tag.find('span', {'data-testid': 'TemperatureValue'}).text

def get_condition(details):
    cond_match = re.search(r'(\d+°.*)(?=Chance of Rain)', details)
    if cond_match:
        condition = cond_match.group(1)
        return (re.sub(r'[^a-zA-Z\s]', '', condition)).replace('Rain', '')
    else:
        return "error"

def get_chance_of_rain(a_tag):
    chance_of_rain = a_tag.find('span', class_='Column--precip--3JCDO').text
    rain_match = re.search(r'(\d+)%', chance_of_rain)
    if rain_match:
        return str(int(rain_match.group(1))) + '%'
    else:
        return "There should be no rain to be expected"

def extract_forecasts(soup, weather_forecast):
    forecasts = {}

    for event in weather_forecast:
        forecast_type = event['forecast_type']
        forecasts[forecast_type] = {}

        text = soup.find('div', class_=event['class_name'])

        for ul_tag in text:
            li_tags = ul_tag.find_all('li')
            tag_count = 0

            for li_tag in li_tags:
                a_tags = li_tag.find_all('a')

                for a_tag in a_tags:
                    details = a_tag.text 
                    time = get_time(a_tag)
                    temperature = get_temperature(a_tag)
                    condition = get_condition(details)
                    chance_of_rain = get_chance_of_rain(a_tag)

                    forecasts[forecast_type][tag_count] = {
                        'time': time,
                        'temperature': temperature,
                        'rain': chance_of_rain,
                        'condition': condition
                    }
                    tag_count += 1

    return forecasts


# Endpoint to get today's forecast
@app.route('/weather/today', methods=['GET'])
def get_todays_forecast():
    soup = retrieve_weather_data()
    weather_forecasts = [{'forecast_type': 'todays_forecast', 'class_name': 'TodayWeatherCard--TableWrapper--globn'}]
    forecasts = extract_forecasts(soup, weather_forecasts)
    
    return jsonify(forecasts)

# Endpoint to get hourly forecast
@app.route('/weather/hourly', methods=['GET'])
def get_hourly_forecast():
    soup = retrieve_weather_data()
    weather_forecasts = [{'forecast_type': 'hourly_forecast', 'class_name': 'HourlyWeatherCard--TableWrapper--1OobO'}]
    forecasts = extract_forecasts(soup, weather_forecasts)
    
    return jsonify(forecasts)

# Endpoint to get daily forecast
@app.route('/weather/daily', methods=['GET'])
def get_daily_forecast():
    soup = retrieve_weather_data()
    weather_forecasts = [{'forecast_type': 'daily_forecast', 'class_name': 'DailyWeatherCard--TableWrapper--2bB37'}]
    forecasts = extract_forecasts(soup, weather_forecasts)
    
    return jsonify(forecasts)

if __name__ == '__main__':
    app.run(debug=True)

