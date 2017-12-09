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
//   text: 'I didn\'t get a harumph outa that guy.!',
//   roomname: 'lobby'
// }

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',  
  rooms: [],
  messages: [],
  friends: [],
  
  init: function () {
    app.fetch();
    
    //setInterval(app.fetch, 5000);
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
      success: function(data) {
        _.each(data, function(elem) {
          _.each(elem, function(item) {
            // app.rooms.push(item.roomname);
            app.renderRoom(item.roomname);
            app.messages.push(item);
          });
        });
      }
    });
  },
  clearMessages: function() {
    $('#chats').text('');
  },
  renderMessage: function(message) {
    $('#chats').append('<p><b><a href="#">' + _.escape(message.username) + '</a>:</b><br><br>' + _.escape(message.text) + '</p>');
  },
  renderRoom: function(roomName) {
    if (!app.rooms.includes(roomName)) {
      if (roomName) {
        $('select').append('<option>' + roomName + '</option>');
        app.rooms.push(roomName);
      }
    }
  },
  handleUsernameClick: function () {
    
  },
  handleSubmit: function () {
    
  }
};


$( function () {
  app.messages.slice(app.messages.length - 15).forEach(function(item) {
    app.renderMessage(item);
  });
  $('#addRoom').on('click', function () {
    app.renderRoom($('#room').val());
  });
  
  $('#newChat').on('click', function () {
    var message = {
      username: window.location.search.slice(10),
      text: $('#chatText').val(),
      roomname: $('#roomSelect option:selected').text()
    };
    console.log(JSON.stringify(message));
    app.send(message);
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
});

app.init();