import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import { ReminderService } from "../services/reminder.service";
import template from "./better-example.html";

export class BetterExample {

    constructor() {
        
        let viewModel = {
            listItems: ko.observableArray(new Array(10)),
            greeting: "The fantastic javascript example",
            currentTime: ko.observable(new Date(new Date().getTime()).toLocaleTimeString()),
            listVisible: ko.observable(false),
            initReminder: this.initReminder,
            reminderButtonText: ko.observable("Start reminder timer"),
            showList: function () {
                this.listVisible(true);
            },
            showAlert: this.showAlert
        }

        KnockoutService.registerComponent("ezy-better-example", viewModel, template);
    }

    initReminder() {
        var self = this;
        let reminderTimeoutInSeconds = 10;
        let buttonCounter = reminderTimeoutInSeconds - 1;
        var reminderButtonText = "";

        var reminderInterval = setInterval(function () {
            reminderButtonText = `${buttonCounter--} seconds left`;
            self.reminderButtonText(reminderButtonText);

            if (buttonCounter < 0) {
                window.clearInterval(reminderInterval);
            }
        }, 1000);

        ReminderService.remindUser(reminderTimeoutInSeconds);
    }

    showAlert(index) {
        if (index === 5) {
            alert("five");
        } else {
            alert(index);
        }
    }
}