import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./better-example.html";

export class BetterExample {

    constructor() {
        var self = this;

        const viewModel = function () {
            this.currentDateTime = ko.observable(new Date());
        };

        KnockoutService.registerComponent("ezy-better-example", viewModel, template);
    }

}