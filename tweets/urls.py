from django.urls import path
from . import views

app_name = 'tweets'
urlpatterns = [
        path('load_userTweet_page', views.LoadUserTweetPage.as_view(), name="load_userTweet_page"),

        path('all', views.TweetList.as_view(), name="tweetList"),
        path('createTweet', views.TweetList.as_view(), name="createTweet"),

        path('tweet/<int:pk>', views.TweetDetail.as_view(), name="tweet"),
        path('deleteTweet/<int:pk>', views.TweetDetail.as_view(), name="deleteTweet"),
        path('updateTweet/<int:pk>', views.TweetDetail.as_view(), name="deleteTweet"),

        path('likeOrDisLikeTweet', views.TweetLikeOrDisLikeView.as_view(), name="likeOrDisLikeTweet"),

]
