import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./rate-task.html";

export class RateTask {

    constructor() {
        
        const viewModel = function (params) {
            this.approved = ko.observable(params.approved);
            this.approveTask = function () {
                this.approved(true);
                params.approved(true);
            };
            this.disapproveTask = function () {
                this.approved(false);
                params.approved(false);
            };
        };

        KnockoutService.registerComponent("ezy-rate-task", viewModel, template);
    }
}