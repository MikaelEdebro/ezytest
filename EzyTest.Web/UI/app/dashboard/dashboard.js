import ko from "knockout";
import { KnockoutService } from "../services/knockout.service";
import template from "./dashboard.html";

export class Dashboard {

    constructor() {

        let viewModel = {
            tasks: ko.observableArray(this.getTasks()),
            finalResult: ko.observable(),
            createSummary: this.createSummary
        };

        KnockoutService.registerComponent("ezy-dashboard", viewModel, template);
    }

    getTasks() {
        var tasks = [];
        tasks.push({
            question: "Two separate .NET systems are set up to validate MD5 keys (or SHA1 etc) from a database. The MD5 keys are generated from a list of employee names. The validation is matching 100% on one system, but only 95% on the other system. What is the most probable reason for this?",
            answer: "Jag har dessvärre inte jobbat med kryptering så jag kan dessvärre bara spekulera vilt. Några tänkbara scenarier jag skulle kika på är dock ifall några inställningar på servrarna diffar.",
            component: null,
            approved: ko.observable(null)
        });
        tasks.push({
            question: "The code below is used in an ASP.NET application where ”GreetingService.CurrentGreeting”is fetched at the following times: 08, 12 and 16. Which message is returned on each run?",
            answer: "08 = Good morning<br>12 = Good evening<br>16 = Good evening",
            component: null,
            approved: ko.observable(null)
        });
        tasks.push({
            question: "Entity Framework is used to fetch data from a table in a database and display the result with a text header that shows the total number of rows returned in the result. Which of the following versions would you suggest, and why?",
            answer: "Jag tror att entity framework itererar över alla rader ifall man kör .ToList(). Så i detta fallet är Version 2 bättre.",
            component: null,
            approved: ko.observable(null)
        });
        tasks.push({
            question: "Under which circumstances is the in-memory (default) Cache in ASP.NET cleared?",
            answer: "När Applikationspoolen startas om.",
            component: null,
            approved: ko.observable(null)
        });
        tasks.push({
            question: "What is clean code? Please describe key points you use in your everyday work.",
            answer: "Some answer 2",
            component: null,
            approved: ko.observable(null)
        });
        tasks.push({
            question: "We have problem with scrapers doing a lot of searches on the site. We want to generate a list of ips that do unusual amount of searches, and also have the ability to block them. Imagine “Search” below being called very often by many users at the same time. What potential problems can we run into?",
            answer: "Some answer 2",
            component: null,
            approved: ko.observable(null)
        });
        tasks.push({
            question: "Take a look at the following badly written page. Please rewrite it as you would have done it, it don’t need to be exactly the same result, but similar. You can change any code that you don’t think is well done and reapply it in a different way. Use best practices regarding HTML, JS, CSS but also regarding architecture and performance.  Using for example javascript module pattern and optionally KnockoutJS or other framework to bind the JS with html.",
            answer: "Created a Knockout component. Please see /ui/app/",
            component: "ezy-better-example",
            approved: ko.observable(null)
        });
        tasks.push({
            question: "Create a web page with a button. When you click on the button the application should retrieve the currency rates for USD and EUR and display them on the page. Currency rates can be found on: http://www.forex.se/ratesxml.asp?id=492. Please use ASP.NET Mvc Project that calls via AJAX either calls a webapi method or a jsonresult method, that's consuming the exchange service. Please think of how you structure your code.Use: MVC, Javascript Modulepattern, async calls, Knockoutjs (optional)",
            answer: "Created a Knockout component. Click button below. For src, see /ui/app/exchange-rates and ExhangeRatesController.cs",
            component: "ezy-exchange-rates",
            approved: ko.observable(null)
        });

        return tasks;
    }

    createSummary() {
        var tasks = this.tasks();
        var result = 0;

        tasks.forEach(function (task) {
            if (task.approved()) {
                result++;
            }
        });

        var percent = (result/tasks.length) * 100;
        var resultText = `${percent}% correct (${result}/${tasks.length})`;
        this.finalResult(resultText);
    }
}