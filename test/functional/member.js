/* eslint-disable global-require */
const config = require('config');
const version = config.get('version');
/* eslint-disable no-await-in-loop */
const ioc = require('socket.io-client');

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

let group;
const data = {
  name: 'Nikhil',
  email: 'admin@hackbuddy.in',
  password: 'zxcvbnms'
};

describe('MEMBER', () => {
  before(async () => {
    memberFacade = require('../../models/member/facade');
    messageFacade = require('../../models/messages/facade');
    member = await memberFacade.findOne({ where: { email: 'nikhilmisra63@gmail.com' } });
  });
  it('Should be able to signUp', async () => {
    await request.post(`/${version}/Member`).send(data).expect(200);
  });

  it('Member should not be able to login with invalid email', async () => {
    await request
      .post(`/${version}/Member/Login`)
      .send({
        email: 'nikhilmisra63',
        password: 'zxcvbnm'
      })
      .expect(422);
  });

  it('it should be able to login account', async () => {
    const res = await request
      .post(`/${version}/Member/Login`)
      .send({
        email: 'admin@hackbuddy.in',
        password: 'zxcvbnms'
      })
      .expect(200);
    member = res.body;
  });

  it('it should be able to get your own profile ', async () => {
    await request.get(`/${version}/Member/`).set({ Authorization: member.token }).expect(200);
  });

  it('it should be able to create group', async () => {
    const res = await request
      .post(`/${version}/Member/Group`)
      .set({ Authorization: member.token })
      .send({
        name: 'Test'
      })
      .expect(200);
    group = res.body;
  });

  it('it should be able to add member in group', async () => {
    await request
      .post(`/${version}/Member/Group/Member`)
      .set({ Authorization: member.token })
      .send({
        memberId: member.id,
        groupId: group.id
      })
      .expect(200);
  });

  it('member should be able to add message in group', async () => {
    await request
      .post(`/${version}/Member/Message`)
      .set({ Authorization: member.token })
      .send({
        senderId: member.id,
        receiverId: member.id,
        message: 'Hello',
        groupId: group.id
      })
      .expect(200);
  });
  it('member should be able to add message in group', async () => {
    await request.get(`/${version}/Member/Message`).set({ Authorization: member.token }).expect(200);
  });

  it('Should be able to logout', async () => {
    await request.delete(`/${version}/Member`).set({ Authorization: member.token }).expect(200);
  });
  describe('sdsd', () => {
    it('Should be able to connect with socket', (done) => {
      options.query = `memberId=${member.id}`;
      const socket = ioc.connect(url, options);
      socket.on('connect', async () => {
        socket.emit('subscribe', `/Member/Message/${group.id}`);

        socket.on(`/Member/Message`, () => {
          done();
        });
        await sleep(1000);
        await messageFacade.create({ memberId: member.id, message: 'Hello', groupId: group.id });
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
});
