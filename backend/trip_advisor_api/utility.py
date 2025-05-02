from dotenv import dotenv_values, load_dotenv
from os import getenv, environ
from requests_oauthlib import OAuth1
import requests
import os
import logging
import requests
from os import getenv

if 'TAKey' not in environ:
    load_dotenv()

# logging.basicConfig(level=print)
def get_locID(city, country, category):
    key = getenv("TAKey")
    if not key:
        print("API key is missing.")
        return {"error": "The key was not provided or was invalid"}

    base_url = "https://api.content.tripadvisor.com/api/v1/location/search"
    params = {
        "key": key,
        "searchQuery": f"{city}, {country}",
        "category": category,
        "language": "en"
    }
    headers = {
        "accept": "application/json"
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        results = response.json()

        loc_ids = [item['location_id'] for item in results.get('data', [])[:3]]
        print(f"Found location IDs: {loc_ids}")
        
        combined_data = {}
        for loc_id in loc_ids:
            try:
                print(f"Fetching details for location {loc_id}")
                details = get_details(loc_id)
                print(f"Fetching photos for location {loc_id}")
                photos = get_photos(loc_id)

                if isinstance(details, dict) and isinstance(photos, dict):
                    combined_data[loc_id] = {
                        'details': details,
                        'photos': photos,
                    }
            except Exception as e:
                print(f"Error fetching data for location {loc_id}: {e}")

        return combined_data

    except Exception as e:
        print(f"Request failed: {e}")
        return {"error": "error occurred"}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": "There was an error with your request"}

def get_details(loc_id):
    key = getenv("TAKey")
    if not key:
        print("API key is missing.")
        return {"error": "The key was not provided or was invalid"}

    base_url = f"https://api.content.tripadvisor.com/api/v1/location/{loc_id}/details"
    params = {
        "language": "en",
        "currency": "USD",
        "key": key
    }
    headers = {
        "accept": "application/json"
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request failed for location {loc_id}: {e}")
        return {"error": "Network error occurred"}
    except Exception as e:
        print(f"Unexpected error for location {loc_id}: {e}")
        return {"error": "There was an error"}

def get_photos(loc_id):
    key = getenv("TAKey")
    if not key:
        print("API key is missing.")
        return {"error": "The key was not provided or it was invalid"}

    base_url = f"https://api.content.tripadvisor.com/api/v1/location/{loc_id}/photos"
    params = {
        "language": "en",
        "key": key,
        "limit": 5
    }
    headers = {"accept": "application/json"}

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for bad HTTP status
        return response.json()
    except Exception as e:
        print(f"Request failed for location {loc_id}: {e}")
        return {"error": "Network error occurred"}
    except Exception as e:
        print(f"Unexpected error for location {loc_id}: {e}")
        return {"error": "There was an error"}