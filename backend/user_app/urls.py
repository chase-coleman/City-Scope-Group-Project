from django.urls import path
from .views import User_View, SignUp, Login, Logout, DeleteAccount

urlpatterns = [
  path('info/', User_View.as_view(), name="user_info"),
  path('signup/', SignUp.as_view(), name="sign_up"),
  path('login/', Login.as_view(), name="login"),
  path('logout/', Logout.as_view(), name="logout"),
  path('delete/', DeleteAccount.as_view(), name='account_delete')
]