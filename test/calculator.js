const expect = require('chai').expect;

const Calculator = require('../src/calculator');
const PowerPlan = require('../src/powerplan');
const Device = require('../src/device');
const Reader = require('../src/reader');
const Rate = require('../src/rate');

describe('Calculator on full input data', function () {
    const data = Reader.read('test/data/input.json');
    const calculator = new Calculator(data.powerplan, data.devices);

    it('should schedule 24h devices', function () {
        const output = calculator.calculate();
        expect(output.schedule['0']).to.include("02DDD23A85DADDD71198305330CC386D");
        expect(output.schedule['0']).to.include("1E6276CC231716FE8EE8BC908486D41E");

        expect(output.schedule['12']).to.include("02DDD23A85DADDD71198305330CC386D");
        expect(output.schedule['12']).to.include("1E6276CC231716FE8EE8BC908486D41E");

        expect(output.schedule['23']).to.include("02DDD23A85DADDD71198305330CC386D");
        expect(output.schedule['23']).to.include("1E6276CC231716FE8EE8BC908486D41E");
    });

    it('should calculate consumed energy for 24h device', function () {
        const output = calculator.calculate();
        const devices = output.consumedEnergy.devices;
        expect(devices['02DDD23A85DADDD71198305330CC386D']).to.be.closeTo(5.398, 0.001);
        expect(devices['1E6276CC231716FE8EE8BC908486D41E']).to.be.closeTo(5.398, 0.001);
    });

    it('should calculate total consumed energy', function () {
        const output = calculator.calculate();
        expect(output.consumedEnergy.value).to.be.closeTo(50.08, 0.001);
    })
});

describe('Calculator on small input data', function () {

    function calculate(input) {
        const data = Reader.materialize(input);
        const calculator = new Calculator(data.powerplan, data.devices);
        return calculator.calculate();
    }

    it('should calculate the simplest schedule', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 2, "mode": "day"}
            ],
            "rates": [
                {"from": 0, "to": 23, "value": 1}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['9']).to.have.length(0);
        expect(output.schedule['7']).to.include("d0");
        expect(output.schedule['8']).to.include("d0");
        expect(output.schedule['9']).to.have.length(0);
    })
});
