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

// const url = `http://localhost:3004`;

const url = `https://chatdev.sparkseekerapi.com`;

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
  it('Should be able to send Start Typing event', (done) => {
    options.query = `userId=617f79759e34065f6cf536c6`;
    const socket = ioc.connect(url, options);
    socket.emit('START_TYPING', {
      chatId: '6193c6617ea24f0022d06242'
    });
    done();
  });
  it('Should be able to receive Start typing', (done) => {
    options.query = `userId=618bb78d0769380022e636f6`;
    const socket = ioc.connect(url, options);
    socket.on('SERVER_START_TYPING', (data) => {
      console.log(data, 'Success');
      done();
    });
  });
  it('Should be able to send Stop Typing event', (done) => {
    options.query = `userId=618bb78d0769380022e636f6`;
    const socket = ioc.connect(url, options);
    socket.emit('STOP_TYPING', {
      chatId: '6193c6617ea24f0022d06242'
    });
    done();
  });
  it('Should be able to receive Stop typing', (done) => {
    options.query = `userId=617f79759e34065f6cf536c6`;
    const socket = ioc.connect(url, options);
    socket.on('SERVER_STOP_TYPING', (data) => {
      console.log(data, 'Success');
      done();
    });
  });
});
