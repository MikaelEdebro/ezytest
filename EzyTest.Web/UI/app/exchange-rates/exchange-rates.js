import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./exchange-rates.html";

export class ExchangeRates {
    constructor() {

        const exchangeRateApiUrl = "/api/exhangerates";

        let viewModel = {
            rates: ko.observableArray(),
            currencyTo: ko.observable(),
            showLoader: ko.observable(false),
            getExchangeRates: function () {
                viewModel.showLoader(true);

                setTimeout(function () {
                    var jqxhr = $.getJSON(exchangeRateApiUrl)
                    .done(function (response) {
                        console.log("response", response);

                        response.forEach(function (rate) {
                            viewModel.rates.push(rate);
                        });
                    })
                    .always(function () {
                        viewModel.showLoader(false);
                    });
                }, 3000);
            }
        }

        KnockoutService.registerComponent("ezy-exchange-rates", viewModel, template);
    }
}