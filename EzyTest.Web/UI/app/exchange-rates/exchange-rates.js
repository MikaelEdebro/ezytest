import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./exchange-rates.html";

export class ExchangeRates {

    constructor() {

        let self = this;

        const viewModel = function () {
            this.rate = ko.observable(self.getExchangeRates());
        };

        KnockoutService.registerComponent("ezy-exchange-rates", viewModel, template);
    }


    getExchangeRates() {
        return "1001112";
    }
}