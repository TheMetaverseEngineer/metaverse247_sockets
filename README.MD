# Metaverse247 Sockets
use this line for coonecting to socket server:

    socket = io.connect("https://localhost:3000", { secure: true });

example of using socket in your frontend:

    socket.emit('init', {
            model: "policeman",
            user: "ojIckSD2jqNzOqIrAGzL",
            room: "metaverse247",
            color: "white",
            x: 12565,
            y: 0,
            z: -6952,
            h: 1.26,
            pb: 0
    })

## socket events :

- connection : when new user connect to your socket server

- disconnect : when user dissconnected from your socket server

- changeRoom : when user going to new room

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | model | String | character model name
    | user | String | user id
    | room | String | room name
    | color | String | character color
    | x | Number | character x position
    | y | Number | character y position
    | z | Number | character z position
    | h | Number | character head y rotation
    | pb | Number | character head x rotation

- init : first setup
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | model | String | character model name
    | user | String | user id
    | room | String | room name
    | color | String | character color
    | x | Number | character x position
    | y | Number | character y position
    | z | Number | character z position
    | h | Number | character head y rotation
    | pb | Number | character head x rotation

- update : update user data when character state changed

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | user | String | user id
    | room | String | room name
    | x | Number | character x position
    | y | Number | character y position
    | z | Number | character z position
    | h | Number | character head y rotation
    | pb | Number | character head x rotation
    | action | String | character action , using for animations

- chat message : send and receive chat 

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | id | String | receiver id
    | message | String | message text

- startScreenSharing : start screen sharing over WEBRTC

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- acceptScreenSharing : accept screen sharing

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id


- videochatRequest : send video chat request to another user
    
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- newUserStart : accept and join to video chat

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- videoSdp : send and receive sdp offer over WEBRTC

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id
    | description | String | local description generated from webrtc adapter

- endVideoChat : end video chat
    
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- voicechatRequest : send voice chat request to another user
    
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- newUserStartVoice : accept and join to voice chat
    
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- voiceSdp : send and receive sdp offer over WEBRTC

    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id
    | description | String | local description generated from webrtc adapter

- endVoiceChat : end voice chat
    
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id

- ice candidates : setup ice candidate over WEBRTC for video chat , voice chat and screen sharing
    
    data object parameters:
    | key | Type | description |
    | ------ | ------ | ----- |
    | to | String | receiver , for screen sharing set it to 'all' 
    | sender | String | sender id
    | candidate | String | ice candidate generated from webrtc adapter