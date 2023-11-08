const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../Server.js');
const request = supertest(app);
describe('Weather App API', () => {
    it('should return weather data for a valid location', async () => {
        const location = 'burwood';
        const response = await request.post('/').send({
            query: location
        }).expect(200);
        expect(response.body).to.have.property('currentConditions');
        expect(response.body).to.have.property('resolvedAddress');
    });
    it('should handle errors for an invalid location', async () => {
        const location = 'mumbai';
        const response = await request.post('/').send({
            query: location
        }).expect(200);
        expect(response.body).to.have.property('error');
    });
    it('should return a JSON response', async () => {
        const location = 'burwood';
        const response = await request.post('/').send({
            query: location
        }).expect('Content-Type', /json/).expect(200);
    });
    it('should handle empty query data', async () => {
        const response = await request.post('/').send({}).expect(400); // Expecting a 400 status code for bad request
        expect(response.body).to.have.property('error');
    });
});