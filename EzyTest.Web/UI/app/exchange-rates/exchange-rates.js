import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./exchange-rates.html";

export class ExchangeRates {

    constructor() {

        const viewModel = function () {
            this.rate = ko.pureComputed(function () {
                return "100$";
            });
        };

        KnockoutService.registerComponent("ezy-exchange-rates", viewModel, template);
    }


    getTasks() {
        var tasks = [];
        tasks.push({
            question: "Two separate .NET systems are set up to validate MD5 keys (or SHA1 etc) from a database. The MD5 keys are generated from a list of employee names. The validation is matching 100% on one system, but only 95% on the other system. What is the most probable reason for this?",
            answer: "Some answer"
        });
        tasks.push({
            question: "The code below is used in an ASP.NET application where ”GreetingService.CurrentGreeting”is fetched at the following times: 08, 12 and 16. Which message is returned on each run?",
            answer: "Some answer 2"
        });
        tasks.push({
            question: "Entity Framework is used to fetch data from a table in a database and display the result with a text header that shows the total number of rows returned in the result. Which of the following versions would you suggest, and why?",
            answer: "Some answer 2"
        });
        tasks.push({
            question: "Under which circumstances is the in-memory (default) Cache in ASP.NET cleared?",
            answer: "Some answer 2"
        });
        tasks.push({
            question: "What is clean code? Please describe key points you use in your everyday work.",
            answer: "Some answer 2"
        });
        tasks.push({
            question: "We have problem with scrapers doing a lot of searches on the site. We want to generate a list of ips that do unusual amount of searches, and also have the ability to block them. Imagine “Search” below being called very often by many users at the same time. What potential problems can we run into?",
            answer: "Some answer 2"
        });

        return tasks;
    }
}