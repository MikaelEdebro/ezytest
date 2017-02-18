﻿import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./dashboard.html";

export class Dashboard {

    constructor() {
        var self = this;

        const viewModel = function () {
            this.tasks = ko.observableArray(self.getTasks());
            this.hideButton = ko.pureComputed(function () {
                return false;
            });
        };

        KnockoutService.registerComponent("ezy-dashboard", viewModel, template);
    }


    getTasks() {
        var tasks = [];
        tasks.push({
            question: "Two separate .NET systems are set up to validate MD5 keys (or SHA1 etc) from a database. The MD5 keys are generated from a list of employee names. The validation is matching 100% on one system, but only 95% on the other system. What is the most probable reason for this?",
            answer: "Some answer <b>Some thing</b>",
            component: null
        });
        tasks.push({
            question: "The code below is used in an ASP.NET application where ”GreetingService.CurrentGreeting”is fetched at the following times: 08, 12 and 16. Which message is returned on each run?",
            answer: "text",
            component: "ezy-exchange-rates"
        });
        tasks.push({
            question: "Entity Framework is used to fetch data from a table in a database and display the result with a text header that shows the total number of rows returned in the result. Which of the following versions would you suggest, and why?",
            answer: "Some answer 2",
            component: null
        });
        tasks.push({
            question: "Under which circumstances is the in-memory (default) Cache in ASP.NET cleared?",
            answer: "When the Application Pool is recycled.",
            component: null
        });
        tasks.push({
            question: "What is clean code? Please describe key points you use in your everyday work.",
            answer: "Some answer 2",
            component: null
        });
        tasks.push({
            question: "We have problem with scrapers doing a lot of searches on the site. We want to generate a list of ips that do unusual amount of searches, and also have the ability to block them. Imagine “Search” below being called very often by many users at the same time. What potential problems can we run into?",
            answer: "Some answer 2",
            component: null
        });
        tasks.push({
            question: "Take a look at the following badly written page. Please rewrite it as you would have done it, it don’t need to be exactly the same result, but similar. You can change any code that you don’t think is well done and reapply it in a different way. Use best practices regarding HTML, JS, CSS but also regarding architecture and performance.  Using for example javascript module pattern and optionally KnockoutJS or other framework to bind the JS with html.",
            answer: "Created a Knockout component. Please see /ui/app/",
            component: "ezy-better-example"
        });

        return tasks;
    }
}