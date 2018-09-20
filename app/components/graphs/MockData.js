import Moment from 'moment';

import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

var jStat = require('jStat').jStat;

var MockData = function(mu, sigma, startingPrice, intraDaySteps, filter) {
    this.mu = mu;
    this.sigma = sigma;
    this.startingPrice = startingPrice;
    this.intraDaySteps = intraDaySteps;
    this.filter = filter;
}

MockData.prototype = {
    generateOHLC: function (fromDate, toDate) {
        console.log('Generating', fromDate, toDate);
        var range = moment().range(fromDate, toDate),
            rangeYears = range / 3.15569e10,
            daysIncluded = 0,
            steps,
            prices,
            ohlc = [],
            daySteps,
            currentStep = 0,
            self = this;


        const acc = Array.from(range.by('day', { exclusive: true}))

        // range.by('days', function (moment) {
        //     if (self.filter(moment)) {
        //         daysIncluded += 1;
        //     }
        // });

        let newAcc = acc.filter(self.filter)

        daysIncluded = newAcc.length;

        steps = daysIncluded * this.intraDaySteps;

        prices = this.generatePrices(rangeYears, steps);


        for (let day of range.by('day')) {
            if (self.filter(day)) {
                daySteps = prices.slice(currentStep, currentStep += self.intraDaySteps);
                ohlc.push({
                    date: day.toDate(),
                    open: daySteps[0],
                    high: Math.max.apply({}, daySteps),
                    low: Math.min.apply({}, daySteps),
                    close: daySteps[self.intraDaySteps - 1]
                })
            }
        }

        // range.by('days', function (moment) {
        //     if (self.filter(moment)) {
        //         daySteps = prices.slice(currentStep, currentStep += self.intraDaySteps);
        //         ohlc.push({
        //             date: moment.toDate(),
        //             open: daySteps[0],
        //             high: Math.max.apply({}, daySteps),
        //             low: Math.min.apply({}, daySteps),
        //             close: daySteps[self.intraDaySteps - 1]
        //         })
        //     }
        // });

        return ohlc;
    },

    generatePrices: function (period, steps) {
        var increments = this._generateIncrements(period, steps),
            i, prices = [];

        prices[0] = this.startingPrice;
        for (i = 1; i < increments.length; i += 1) {
            prices[i] = prices[i - 1] * increments[i];
        }
        return prices;
    },

    _generateIncrements: function (period, steps) {
        // Geometric Brownian motion model.
        var deltaY = period / steps,
            sqrtDeltaY = Math.sqrt(deltaY),
            deltaW = jStat().randn(1, steps).multiply(sqrtDeltaY),
            increments =  deltaW
                .multiply(this.sigma)
                .add((this.mu - ((this.sigma * this.sigma) / 2)) * deltaY),
            expIncrements = increments.map(function (x) {
                return Math.exp(x);
            });

        return jStat.row(expIncrements, 0);
    }
}

export default MockData;