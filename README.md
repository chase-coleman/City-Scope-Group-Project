

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
App : Trip
- Method Endpoints :
  This is an example of what the endpoint library could look like
  - GET, PUT, POST, DELETE - http:127.0.0.1:8000/api/v1/trip/:id/



