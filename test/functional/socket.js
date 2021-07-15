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

const url = `http://localhost:${config.get('port')}`;

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
    options.query = `memberId=${member.id}`;
    const socket = ioc.connect(url, options);
    socket.on('connect', async () => {
      socket.emit('subscribe', `/Member/Message/1`);

      socket.on(`/Member/Message`, () => {
        done();
      });
      await sleep(1000);
      await messageFacade.create({ memberId: member.id, message: 'Hello', groupId: '1' });
    });
  });
  it('Should not be able to connect with socket', (done) => {
    const socket = ioc.connect(url, options);
    socket.on('connect', async () => {
      socket.emit('subscribe', `/Member/Message/2`);

      socket.on(`/Member/Message`, () => {
        done();
      });
      await sleep(1000);
      await messageFacade.create({ memberId: member.id, message: 'Hello', groupId: '1' });
    });
  });
});
