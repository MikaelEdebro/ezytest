import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./exchange-rates.html";

export class ExchangeRates {
    constructor() {

        let viewModel = {
            rates: ko.observableArray(),
            currencyTo: ko.observable(),
            showLoader: ko.observable(false),
            getExchangeRates: this.getExchangeRates
        }

        KnockoutService.registerComponent("ezy-exchange-rates", viewModel, template);
    }

    getExchangeRates() {
        const self = this;
        const exchangeRateApiUrl = "/api/exchangerates";

        self.rates([]);
        self.showLoader(true);

        setTimeout(function () {

            var exchangeRateRequest = {
                currencies: ["USD", "EUR"]
            }

            var jqxhr = $.getJSON(exchangeRateApiUrl, exchangeRateRequest)
                .done(function (response) {
                    console.log("response", response);

                    response.forEach(function (rate) {
                        self.rates.push(rate);
                    });
                })
                .fail(function() {
                    alert("Could not load exchange rates");
                })
                .always(function () {
                    self.showLoader(false);
                });
        }, 3000);
    }
}