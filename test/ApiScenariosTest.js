process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const {Posting, User, Channel} = require("../src/util/schema");
const should = chai.should();
const config = require('../config.json');
require('dotenv').config();
chai.use(chaiHttp);

let access_token = process.env.TEST_APP_TMP_ACCESS_TOKEN;

async function clearDb() {
    await Channel.deleteMany({});
    await User.deleteMany({});
    await Posting.deleteMany({});
}

async function getAccessToken(done) {
    chai.request(config.auth0.domain)
        .post('/oauth/token')
        .send({
            "client_id": process.env.TEST_APP_CLIENT_ID,
            "client_secret": process.env.TEST_APP_CLIENT_SECRET,
            "grant_type": "password",
            "audience": config.auth0.api.audience,
            "username": process.env.TEST_APP_USERNAME,
            "password": process.env.TEST_APP_PASSWORD,
            "scope": "openid email profile"
        })
        .end((err, res) => {
            access_token = res.body.access_token
            done();
        });
}

async function createMyUserAccount(done, verifier) {
    chai.request(server)
        .post('/api/users/me')
        .set('Authorization', `Bearer ${access_token}`)
        .send({})
        .end((err, res) => {
            if (verifier) {
                verifier(res)
            }
            if (done) {
                done()
            }
        });
}

describe('User scenarios', () => {
    beforeEach((done) => {
        clearDb().then(() => {
            done()
            getAccessToken(done)
        })
    });

    describe('Initially, no data exists in the fresh database', () => {
        it('No postings available', (done) => {
            chai.request(server)
                .get('/api/postings')
                .set('Authorization', `Bearer ${access_token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
        it('No channels available', (done) => {
            chai.request(server)
                .get('/api/channels')
                .set('Authorization', `Bearer ${access_token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('Creates my own user account', () => {
        it('Should create a new user account with my authenticated user info', (done) => {
            createMyUserAccount(done, (res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.success.should.equal(true)
                res.body.message.should.equal('New user account created.')
            })
        });
    });

    describe('Inserts a Channel and verify it.', () => {
        it('Should add a new Channel', (done) => {
            createMyUserAccount(false, (res) => {
                chai.request(server)
                    .post('/api/channels')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({
                        name: 'Test Channel',
                        description: 'Test Channel Description'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.equal(true)
                        res.body.data.channel.name.should.equal('Test Channel')
                        res.body.data.channel.description.should.equal('Test Channel Description')
                        res.body.data.channel.owner.uid.should.equal('auth0|62cae09ce38a114d01cc1730')
                        res.body.data.channel.owner.email.should.equal('tibzon@live.com')
                        done();
                    });
            })
        });
    });

    describe('Inserts a Posting and verify it.', () => {
        it('Should add a new Posting', (done) => {
            createMyUserAccount(false, (res) => {
                chai.request(server)
                    .post('/api/postings')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({
                        title: 'Test Posting',
                        url: 'https://example.com/test-posting',
                        note: 'This Posting was added by the test suite'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.equal(true)
                        const posting = res.body.data.posting;
                        posting.title.should.equal('Test Posting')
                        posting.url.should.equal('https://example.com/test-posting')
                        posting.note.should.equal('This Posting was added by the test suite')
                        posting.user.uid.should.equal('auth0|62cae09ce38a114d01cc1730')
                        posting.user.email.should.equal('tibzon@live.com')
                        posting.meta.favorites.should.equal(0)
                        done();
                    });
            })
        });
    });

});