$(document).ready(function() {
  chats.init();
  setInterval(chats.renderChat, 1000);

});//end doc ready

var chats = {
  init: function() {
    chats.initStyling();
    chats.initEvents();
  },
  initStyling: function() {
    chats.renderChat();
  },

  initEvents: function() {
    $('.userId').on('submit', function(event){
      event.preventDefault();
      $('.chatbox').html();
      chats.createUser();
    });//end submit userId

    $('.userDisplay').on('click', function(event){
      event.preventDefault();
      $('.changeUser').addClass('show');
      $('.chatbox').html();
    });//end submit userId

    $('.changeUser').on('submit', function(event){
      event.preventDefault();
      $('.changeUser').removeClass('show');
      chats.editUser();
    });


    //on click of send msg button trigger these events
    $('#create').on('submit', function(event){
      event.preventDefault();
      var newMessage = {
        userId: localStorage.getItem( 'userId' ),
        message: $(this).find('input[name="message"]').val(),
      };//end of newMessage variable
      chats.createMessage(newMessage);

    });//end submit event for .sendMessage button


    $('article').on('click', '.deleteMsg', function(event){
      event.preventDefault();
      var msgId = $(this).closest('article').data('chatid');
      var currentUser = $(this).closest('article').data('userid');
      console.log(currentUser);
      console.log(msgId);
      chats.deleteMessage(msgId, currentUser);
    });//end of delete click event

    $('.logout').on('submit', function(event){
      event.preventDefault();
      chats.logoutUser();
    });//end of logout submit event

  },
  config: {
    url:'http://tiy-fee-rest.herokuapp.com/collections/chatInTheBox2',
  },
  // render: function (data, tmpl, $el){ //declares what is passed into template
  //   var template= _.template(data, tmpl);
  //   $el.prepend(template);
  // },
  renderChat: function(){
    if (!localStorage.userId) {
      $('.chatbox').removeClass('show');
      $('.create').removeClass('show');
      $('.logout').removeClass('show');
      $('.sendMessage').removeClass('show');
      $('.editUser').hide();
      $('.userDisplay').removeClass('show');
    } else {
      $.ajax({
        url: chats.config.url,
        type: 'GET',
        success: function(chats) { //passes info through function and it is added into empty string
          var template= _.template($('#chatTmpl').html());
          var markup = "";
          chats.forEach(function(item, idx, arr){
            markup +=template(item);
          });//end forEach
          $('article').html(markup);
        },
        error: function(err) {
          console.log(err, "render error");
        }
      });//end ajax for render
      $('.userDisplay').addClass('show');
      $('.userDisplay').html(localStorage.userId);
      $('.chatbox').addClass('show');
      $('.create').addClass('show');
      $('.userId').removeClass('show');
      $('.editUser').show();
      $('.logout').addClass('show');
      $('.usersList').addClass('show');
      $('.sendMessage').addClass('show');
    }

  },
  createMessage: function(message) {
    $.ajax({
      url: chats.config.url,
      userName: "userId",
      data: message,
      type: 'POST', //request to add info to server and will appear when render function is run
      success: function(data) {
        ('#create').val("");
        chats.renderChat(); //reload chat if new data is received
      },
      error: function(err) {
        console.log(err , "createMessage error" ); //oops
      }
    });//end createMessage ajax

  },
  createUser: function() {
    var userName = $('#userInput').val();
    localStorage.setItem( 'userId', userName);
    console.log(userName);
  },

  editUser: function(userId) {
    var userEdit = $('#edituserInput').val();
    localStorage.setItem('userId', userEdit);
    console.log(userEdit);
  },

  logoutUser: function() {
    localStorage.removeItem('userId');
    $('#userInput').val("");
    $('.userDisplay').removeClass('show').val("");
    $('.userId').addClass('show');
    // $('.message').removeClass('show');
    console.log('logout success');

    chats.renderChat();
},

deleteMessage: function (id, user) {
  console.log(user, "currentUser");
  console.log(localStorage.userId ,"localStorage.userId");
  if ( user === localStorage.userId ) {
    $.ajax({
      url: chats.config.url + '/' + id,
      type: 'DELETE',
      success: function (data) {
       console.log(data);

       chats.renderChat();
      },
      error: function (err) {
       console.log(err);
      }
    });
 }//end delete for matching userId values
 else{
   alert("You cannot delete other user messages")
 }
}

};//end chats methods

// editUser: function (id, name) {
//   $.ajax({
//     userName: userId,
//     data: message,
//     type: 'PUT',
//     success: function(newId) {
//      console.log(newId);
//      chats.renderChat();
//   },
//     error: function(err){
//
//     }
//   });
//
// }
//  }
  // editName: function (id, name) {
  //   $.ajax({
  //     userName: userId,
  //     data: message,
  //     type: 'PUT',
  //     success: function() {
  //
  //   },
  //     error: function(err){
  //
  //     }
  //   });
  //
  // }
