from rest_framework import serializers
from .models import Tweet, TweetLike
from django.db.models import Count
from accounts.serializers import CurrentUserSerializer


class TweetSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    re_tweet_list = serializers.SerializerMethodField()
    user = CurrentUserSerializer(required=False)

    class Meta:
        model = Tweet
        fields = ['content', 'id', 'image', 'parent', 'parent_id', 'timestamp',  'user', 'user_id',
                  'like_count', 're_tweet_list']
        extra_kwargs = {"content": {"error_messages": {"blank": 'This field is required.'}},
                        "image": {"error_messages": {"invalid": 'This field is required.'}}}

    def get_re_tweet_list(self, obj):
        qs = Tweet.objects.order_by('-id').filter(parent=obj.id).annotate(like_count=Count('tweetlike'))
        return TweetSerializer(qs, many=True).data

    def get_like_count(self, obj):
        try:
            return obj.like_count
        except:
            return None


class TweetLikeSerializer(serializers.ModelSerializer):
    tweet = TweetSerializer()

    class Meta:
        model = TweetLike
        fields = ['id', 'user', 'user_id', 'tweet', 'tweet_id', 'timestamp']
        extra_kwargs = {'user': {'required': False}}

    def get_content(self, obj):
        content = obj.content
        if obj.is_retweet:
            content = obj.parent.content
        return content
