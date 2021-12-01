/* eslint-disable no-await-in-loop */
const ioc = require('socket.io-client');
const config = require('config');

const options = {
  transports: ['websocket'],
  'force new connection': true,
  forceNew: true,
  reconnection: false
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const url = `http://localhost:3004`;

// const url = `https://chatdev.sparkseekerapi.com`;

let memberFacade;
let messageFacade;
let member;

describe('SOCKETS', () => {
  before(async () => {
    memberFacade = require('../../models/member/facade');
    messageFacade = require('../../models/messages/facade');
    member = await memberFacade.findOne({ where: { email: 'nikhilmisra63@gmail.com' } });
  });
  it('Should be able to connect with socket', (done) => {
    options.query = `userId=618bb78d0769380022e636f6`;
    const socket = ioc.connect(url, options);
    socket.on('connect', async () => {
      socket.on('EXCEPTION', (data) => {
        console.log(data, 'error');
        done();
      });
      done();
    });
  });
  it('Should be able to connect with socket', (done) => {
    options.query = `userId=617f79759e34065f6cf536c6`;
    const socket = ioc.connect(url, options);
    socket.on('connect', async () => {
      socket.on('EXCEPTION', (data) => {
        console.log(data, 'error');
        done();
      });
      done();
    });
  });
  it('Should be able to send delete message event', (done) => {
    options.query = `userId=617bf5d410b7f275b188f7b7`;
    const socket = ioc.connect(url, options);
    socket.emit('MESSAGE_DELETE', {
      chatId: '618ccf022fdfc63eff5db9fc',
      messageId: '618c9c5cc3374129747994d6',
      isDeleted: true
    });
    socket.on('EXCEPTION', (data) => {
      console.log(data, 'error');
      done();
    });
    done();
  });
  it('Should be able to receive delete message event', (done) => {
    options.query = `userId=6188c9f1c01d291f188e541d`;
    const socket = ioc.connect(url, options);
    socket.on('SERVER_MESSAGE_DELETE', (data) => {
      console.log(data, 'Success');
      done();
    });
    socket.on('EXCEPTION', (data) => {
      console.log(data, 'error');
      done();
    });
  });
  it('Should be able to send Stop Typing event', (done) => {
    options.query = `userId=617bf5d410b7f275b188f7b7`;
    const socket = ioc.connect(url, options);
    socket.emit('STOP_TYPING', {
      chatId: '618ccf022fdfc63eff5db9fc'
    });
    done();
  });
  it('Should be able to receive Stop typing', (done) => {
    options.query = `userId=6188c9f1c01d291f188e541d`;
    const socket = ioc.connect(url, options);
    socket.on('SERVER_STOP_TYPING', (data) => {
      console.log(data, 'Success');
      done();
    });
  });
});
