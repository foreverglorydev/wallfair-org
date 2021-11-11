//import { io } from 'socket.io-client';
import { emit } from 'process';
import { BACKEND_SOCKET_URL } from '../constants/Api';

export let websocket = null;
export const createSocket = token => {
  let socket = null;

  try {
    let wsUri = BACKEND_SOCKET_URL.replace('http', 'ws');
    wsUri = token ? `${wsUri}?token=${token}` : wsUri;

    socket = new WebSocket(wsUri);
    console.log('creating the socket on', wsUri, socket);
    socket.onerror = m => {
      console.log('-----> socket ===> error', m);
      if (websocket['onEvent']) websocket.onEvent('error', m);
    };

    socket.onopen = m => {
      console.log('-----> socket ===> open', m);
      if (websocket['onEvent'])
        websocket.onEvent('connect', { date: new Date().toISOString() });
    };

    socket.onclose = event => {
      console.log('-----> socket ===> close: ', event);
      //socket.send(`goodbye, leaving because ${event?.code}`);
    };

    socket.onmessage = msg => {
      const { data } = msg;
      console.log('-----> socket ===> received:', msg, data);
      try {
        const payload = JSON.parse(data);
        const event = payload[0];
        const eventData = payload[1];
        //socket.call('newMsgArrived', eventData);
        if (websocket['onEvent']) websocket.onEvent(event, eventData);
        //socket.call(event,eventData);
      } catch (err) {}
    };

    websocket = {
      emit: (event, data) => {
        if (socket.readyState !== 1) {
          console.log(
            `a websocket.emit was invoked when the socket wasn't ready, state: ${socket.readyState}. Is this an error?`
          );
          return;
        }
        const payload = JSON.stringify([event, data]);
        try {
          socket.send(payload);
        } catch (err) {
          console.log('on emit error', err, socket.readyState);
        }
      },
      onEvent: null,
    };
  } catch (err) {
    console.log('-----> socket ===> exception', err);
  }
};

export default {
  websocket,
  createSocket,
};
