from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import TweetSerializer
from .models import Tweet, TweetLike
from rest_framework import status, generics
from django.db.models import Count
from rest_framework.views import APIView
from django.views.generic import TemplateView
from rest_framework.exceptions import NotAcceptable
# Create your views here.


class LoadUserTweetPage(TemplateView):
    template_name = "views/userTweet.html"


class TweetList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TweetSerializer

    def get_queryset(self):
        queryset = Tweet.objects.order_by('-id').filter(parent=None).annotate(like_count=Count('tweetlike'))
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TweetDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer

    def perform_update(self, serializer):
        if self.get_object().user.id == self.request.user.id:
            serializer.save()
        else:
            raise NotAcceptable({'errors': "You cant Edit"})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user_id == self.request.user.id:
            self.perform_destroy(instance)
            return Response({'errors': "Tweet Deleted"})
        else:
            raise NotAcceptable({'errors': "You can't Delete"})


class TweetLikeOrDisLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tweet_id = request.POST['id']
        is_like = request.POST['isLike']
        msg = None
        if tweet_id:
            tweet = Tweet.objects.filter(id=tweet_id).first()
            if tweet:
                tweet_like = TweetLike.objects.filter(tweet=tweet, user=request.user).first()
                if is_like == "true":
                    if not tweet_like:
                        tweet_like = TweetLike(tweet=tweet, user=request.user)
                        tweet_like.save()
                    else:
                        msg = 'Already you liked'
                else:
                    if tweet_like:
                        tweet_like.delete()
                    else:
                        msg = "You did't liked"
        return Response({'errors': msg}, status=status.HTTP_200_OK)
