function RTCDataChannelForChrome() {
  var iceServers = {
    iceServers: [{
      url: 'stun:stun.l.google.com:19302'
    }]
  };

  var optionalRtpDataChannels = {
    optional: [{
      RtpDataChannels: true
    }]
  };

  var offerer = new webkitRTCPeerConnection(iceServers, optionalRtpDataChannels),
  answerer;

  offererDataChannel = offerer.createDataChannel('RTCDataChannel', {
    reliable: false
  });

  setChannelEvents(offererDataChannel, 'offerer');

  offerer.onicecandidate = function (event) {
    if (!event || !event.candidate) return;
    answerer && (function(){
      console.log(event.candidate);
      answerer.addIceCandidate(event.candidate);
    })();
  };

  var mediaConstraints = {
    optional: [],
    mandatory: {
      OfferToReceiveAudio: false, // Hmm!!
      OfferToReceiveVideo: false // Hmm!!
    }
  };

  offerer.createOffer(function (sessionDescription) {
    offerer.setLocalDescription(sessionDescription);
    createAnswer(sessionDescription);
  }, null, mediaConstraints);


  function createAnswer(offerSDP) {
    answerer = new webkitRTCPeerConnection(iceServers, optionalRtpDataChannels);
    answererDataChannel = answerer.createDataChannel('RTCDataChannel', {
      reliable: false
    });

    setChannelEvents(answererDataChannel, 'answerer');

    answerer.onicecandidate = function (event) {
      if (!event || !event.candidate) return;
      offerer && offerer.addIceCandidate(event.candidate);
    };

    answerer.setRemoteDescription(offerSDP);
    answerer.createAnswer(function (sessionDescription) {
      answerer.setLocalDescription(sessionDescription);
      offerer.setRemoteDescription(sessionDescription);
    }, null, mediaConstraints);
  }

  function setChannelEvents(channel, channelNameForConsoleOutput) {
    channel.onmessage = function (event) {
      console.debug(channelNameForConsoleOutput, 'received a message:', event.data);

      if (channelNameForConsoleOutput == 'offerer')
        console.log(event.data);
      else
        console.log(event.data);
    };

    channel.onopen = function () {
      channel.send('first text message over RTP data ports');
    };
  }
}
RTCDataChannelForChrome();
