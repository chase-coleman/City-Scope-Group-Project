

### To get working with the project:
1) create your own virtual environment on your computer
  - python -m venv <your-virtual-environment-name>
2) git clone down this repo to your computer
3) activate your virtual environment
  - source virtual-environment-name/bin/activate
4) cd into the backend directory and install the venv dependency file :
  - pip install -r requirements.txt
5) cd out to root and then into the frontend directory and install frontend dependency file :
  - npm install

### Quick Note :
- I have already created an app for User, named "user_app".
- I have already created a database, named "city_scope_db".
- I have already added both of those into the backend/city_scope_project/settings.py file - so no need for yall to do it.

- I created an Endpoint library where I think we should put each endpoint for a specific request. Yes we could technically just click into the specific app's urls file to get an endpoint, but I think it would be good to have all of the server endpoints in one place.

### Endpoints
example : 
app : User
  - api/v1/user/info/     - GET/PUT - user account info
  - api/v1/user/signup/   - POST - create new user account
  - api/v1/user/login/    - POST - user login
  - api/v1/user/logout/   - POST - user logout
  - api/v1/user/delete/   - DELETE - user account deletion

Stays
- api/v1/stay/all/      - GET - view all of a users stays
- api/v1/stay/<int:id>/ - GET/PUT/DELETE/POST view a specific stay

Activities
- api/v1/activity/all/<int:itinerary_id>/  - GET,POST - view all of a users activites on a trip, create new activity in that itinerary
- api/v1/activity/<int:id>/                - GET/PUT/DELETE view a specific activity


Itinerary
- api/v1/itinerary/all/<int:trip_id>/   - GET - view all of a trips itineraries
- api/v1/itinerary/<int:id>/            - GET/PUT/DELETE/POST view a specific itinerary

Trips
- api/v1/trip/all/        - GET - view all of a users trips
- api/v1/trip/<int:id>/   - GET/PUT/DELETE/POST view a specific trip