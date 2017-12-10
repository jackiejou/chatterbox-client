// YOUR CODE HERE:
// $.get('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages', console.log);

// var app = {
//   server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',  
  
//   rooms: [],
  
//   init: function () {
//     app.fetch();
//     //.responseText.results.forEach(function (obj) {
//      // console.log(obj.roomname);
//     //});
//   },
//   send: function (message) {
//     $.ajax({
//       // This is the url you should use to communicate with the parse API server.
//       url: app.server,
//       type: 'POST',
//       data: message,
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Message sent');
//       },
//       error: function (data) {
//         // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message', data);
//       }
//     });
//   },
//   fetch: function () {
//     $.ajax({
//       // This is the url you should use to communicate with the parse API server.
//       url: app.server,
//       type: 'GET',
//       contentType: 'application/json',
//       success: console.log
//     });
//   },
//   clearMessages: function() {
//     $('#chats').text('');
//   },
//   renderMessage: function(message) {
//     $('#chats').append('<span>' + message.data + '</span>');
//   },
//   renderRoom: function(roomName) {
//     $('#roomSelect').append('<option>' + roomName + '</option>');
//   },
//   handleUsernameClick: function () {
    
//   },
// };

// app.init();

// message: {
//   username: 'Mel Brooks',
//   text: '',
//   roomname: 'lobby'
// }

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',  
  rooms: [],
  messages: [],
  friends: [],
  id: [],
  
  init: function () {
    app.fetch();
    
    setInterval(app.fetch, 3000);
  },
  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function () {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: {order: '-createdAt'},
      success: function(data) {
        app.clearMessages();
        _.each(data, function(elem) {
          _.each(elem.reverse(), function(item) {
            // app.rooms.push(item.roomname);
            app.renderRoom(_.escape(item.roomname));
            if (!app.id.includes(item.objectId)) {
              app.messages.push(item);
              app.id.push(item.objectId);
            }
          });
        });

        _.each(app.messages, function(item) {
          if (item.roomname === $('#roomSelect option:selected').text()) {
            // app.renderMessage
            // console.log(item);
            
            app.renderMessage(item);
          }
        });
      },
      error: function(error) {
        console.log('error', error);
      }
    });
  },
  clearMessages: function() {
    console.log('111');
    $('#chats').text('');
  },
  renderMessage: function(message) {
    // var currTime = new Date();
    // var exactTime = app.timeConversion(currTime - message.createdAt);

    if (app.friends.includes(message.username)) {
      $('#chats').append('<p class="chat"><b><a href="#" class ="username" onclick = "app.handleUsernameClick(this)">' + _.escape(message.username) + 
                       '</a>:</b><br><br><b>' + _.escape(message.text) /*+ '<br><br>' + (message.createdAt)*/ + '</b></p>');
    } else {
      $('#chats').append('<p class="chat"><b><a href="#" class ="username" onclick = "app.handleUsernameClick(this)">' + _.escape(message.username) + 
                       '</a>:</b><br><br>' + _.escape(message.text) /*+ '<br><br>' + (message.createdAt)*/ + '</p>');
    }
    $('#chats').prop({ scrollTop: $('#chats').prop('scrollHeight') });
  },
  renderRoom: function(roomName) {
    if (!app.rooms.includes(roomName)) {
      if (roomName) {
        $('select').append('<option>' + roomName + '</option>');
        app.rooms.push(roomName);
      }
    }
  },
  handleUsernameClick: function (name) {
    // add a friend when clicking a username
    // app.friends.push(this);
    if (!app.friends.includes(name.innerHTML)) {
      app.friends.push(name.innerHTML);
    }
    console.log(app.friends);
  },
  handleSubmit: function () {
    // send a message to the server
    var message = {
      username: window.location.search.slice(10),
      text: $('#message').val(),
      roomname: $('#roomSelect option:selected').text()
    };
    console.log(JSON.stringify(message));
    app.send(JSON.stringify(message));
    
  },
};


$( function () {
  // WIP
  app.messages.slice(app.messages.length - 15).forEach(function(item) {
    app.renderMessage(item);
  });


  $('#addRoom').on('click', function () {
    app.renderRoom($('#room').val());
    var message = {
      username: window.location.search.slice(10),
      text: '',
      roomname: $('#room').val()
    };
    app.send(JSON.stringify(message));
    $('#room').val('');
  });
  
  $('#send').on('click', function () {
    app.handleSubmit();
    $('textarea').val('');
  });
  
  $('#selectRooms').change(function () {
    // render message
    app.clearMessages();
    _.each(app.messages, function(item) {
      if (item.roomname === $('#roomSelect option:selected').text()) {
        // app.renderMessage
        console.log(item);
        
        app.renderMessage(item);

      }
    });
  });

  $('a.username').on('click', function() {
    console.log('hi');
    app.handleUsernameClick();
  });


});

app.init();