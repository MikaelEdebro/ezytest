import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./rate-task.html";

export class RateTask {

    constructor() {
        
        const viewModel = function () {
            var self = this;
            
            this.approved = ko.observable(null);
            this.approveTask = function () {
                this.approved(true);
            };
            this.disapproveTask = function () {
                this.approved(false);
            };
        };

        KnockoutService.registerComponent("ezy-rate-task", viewModel, template);
    }
}