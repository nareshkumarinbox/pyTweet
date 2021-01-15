var userId = null;

function getUserList() {
  ajaxCallRequest('GET', 'getUserList', {}, renderUserList, renderError);
}

function getTweets() {
  var url = "tweets/all"
  if (userId != null) {
    url += "?user_id=" + userId;
  }
  ajaxCallRequest('GET', url, {}, renderTweets, renderError);
}

function deleteTweet(id) {
  url =  '/tweets/deleteTweet/' + id,
  ajaxCallRequest('DELETE', url, {}, renderSuccessWithOrWithoutError, renderError);
}

function likeOrDisLikeTweet(id, isLike) {
  var data = {
    "id": id,
    "isLike": isLike
  }
  ajaxCallRequest('POST', '/tweets/likeOrDisLikeTweet', data, renderSuccessError, renderError);
}

function createTweet() {
  let input = document.getElementById('image');
  let content = document.getElementById('content');
  let parentId = document.getElementById('parent_id');
  let id = document.getElementById('id');

  let formData = new FormData(this.form);
  formData.append('image', input.files[0]);
  formData.append('content', content.value);
  formData.append('parent', parentId.value);
  formData.append('id', id.value);

  var methodType = 'POST';
  var url = '/tweets/createTweet'
  if (id.value) {
    methodType = 'PUT'
    url = '/tweets/updateTweet/' + id.value
  }
    ajaxFormDataCallRequest(methodType, url, formData, renderCreateSuccessResponse, renderError);
}

 function renderCreateSuccessResponse(response) {
      document.getElementById('content').value = '';
      document.getElementById('image').value = '';
      renderSuccessError(response);
 }


function renderUserList(response) {
  const replaceMeElement = $("#userList");
  replaceMeElement.html("");
  var text = '<table style="width:100%" class="user-container m-b-10"><tr><td> <span class="user-icon"></span><button class="login-form-btn btn btn-success type="button" onclick="getUserTweets(null)" >All Tweets</button></div></td></td>'
  for (var i = 0; i < response.length; i++) {
    text += "<td class='m-b-10'> <span class='user-icon'>" + response[i].username + "</span>";
    text += '<button class="login-form-btn btn btn-primary" type="button" onclick="getUserTweets(' + response[i].id + ')" >Tweets</button></div></td>'
  }
  text += "</tr></table>"
  replaceMeElement.html(text);
}

function renderTweets(response) {
 const replaceMeElement = $("#tweets")
  replaceMeElement.html("");
  var text = '<table style="width:100%" class="main-tweets p-10 no-p-lr">'
  if (response.length > 0) {
    for (var i = 0; i < response.length; i++) {
      text += renderSingleTweet(response[i]);
    }
  } else {
    text += "<tr><td class='m-b-10 text-center' style='padding: 50px'>No Tweets Found</td><tr>";
  }
  text += "</table>"
  replaceMeElement.html(text);
}

function renderSingleTweet(data) {
    var tweetContent = data.content.replace('<', '&lt;').replace('>', '&gt;');
  var text = "<tr><td class='m-b-10 tweet-img-td'"
/*  if (data.re_tweet_list.length > 0) {
    text += " style='border: 2px solid #ccc'";
  }*/
  text += "><img class='tweet-img' src='" + data.image + "' ></img></td><td class='tweet-content'>";
  text += "<div class='date-span'>" + data.user.username + "@ (" + new Date(data.timestamp).toLocaleString() + ") </div><div>" + tweetContent + "</div>";
  text += '<div class="pull-left tweet-likes"><button class="login-form-btn btn btn-round btn-default" type="button" onclick="likeOrDisLikeTweet(' + data.id + ', false)" ><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>'
  text += "Likes Count: <span id='like_count_" + data.id + "'>" + data.like_count + "&nbsp;";
  text += '<button class="login-form-btn btn btn-round btn-default" type="button" onclick="likeOrDisLikeTweet(' + data.id + ' , true)" ><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button> &nbsp;'
  text += '</div></td><td class="tweet-action"><div class="pull-right">';
  text += '<button class="login-form-btn btn btn-round btn-danger" type="button" onclick="deleteTweet(' + data.id + ')" ><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
  text += "<button class='login-form-btn btn btn-round btn-info' type='button' onclick='setReTweet(" + JSON.stringify(data) + ", " + data.parent_id + ")' ><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button>";
  text += '<button class="login-form-btn btn btn-round btn-success" type="button" onclick="setReTweet(null, ' + data.id + ')" ><i class="fa fa-retweet" aria-hidden="true"></i></button></div></td></tr>';
  if (data.re_tweet_list.length > 0) {
    text += '<tr><td colspan="6"><div class="re-tweets-main-container"><table class="re-tweets-container">';
    for (var i = 0; i < data.re_tweet_list.length; i++) {
      text += renderSingleTweet(data.re_tweet_list[i]);
    }
    text += '</table></div></td></tr>';
  }

  return text;
}

function renderSuccessError(response) {
  renderSuccessErrorWithFlag(false, response)
}
function renderSuccessWithOrWithoutError(response) {
  renderSuccessErrorWithFlag(true, response)
}

function renderSuccessErrorWithFlag(bAlwaysGetData, response) {
  var hasErrors = renderError(response)
  if (bAlwaysGetData || !hasErrors) {
    getTweets();
    setReTweet(null, null);
  }
}

function getUserTweets(id) {
  userId = id;
  getTweets();
}

function setReTweet(data, parentId) {
  $("#editSpan").html("Create ");
  $("#parent_id").val(parentId);
  $("#reTweetSpan").hide();
  $("#reTweetCancelBtn").hide();
  $("#content").val(null);
  $("#id").val(null);

  if (data != null) {
    $("#id").val(data.id);
    $("#content").val(data.content);
    $("#editSpan").html("Edit ");
    $("#reTweetCancelBtn").show();
  }
  if (parentId != null) {
    $("#reTweetSpan").show();
    $("#reTweetCancelBtn").show();
  }
}

$(document).ready(function() {
  getUserList();
  getTweets();
  setReTweet(null, null);
  $('#crateTweet_form').on('submit', function(e) {
      e.preventDefault();
       createTweet()
      return false;
    });
});