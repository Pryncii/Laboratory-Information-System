$(document).ready(function(){
  $("#msg-btn").click(function(){
    $.post('chatbot-answer',
      { msg: $('#msg-txt').val() },
      function(data, status){
        if(status === 'success'){
          $('#message-area').append("<tr><td><span>"+data.original+"</span></td></tr>");
          $('#message-area').append("<tr><td><span>"+data.response+"</span></td></tr>");
          $('#msg-txt').val('');
        }//if
      });//fn+post
  });//btn
});//doc
