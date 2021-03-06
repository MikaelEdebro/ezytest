﻿import ko from "knockout";
import { Dashboard } from "./dashboard/dashboard";
import { ExchangeRates } from "./exchange-rates/exchange-rates";
import { BetterExample } from "./better-example/better-example";
import { RateTask } from "./rate-task/rate-task";
import { Loader } from "./loader/loader";

activateKnockoutComponents();


function activateKnockoutComponents() {
    var dash = new Dashboard();
    var exchangeRates = new ExchangeRates();
    var betterExample = new BetterExample();
    var rateTask = new RateTask();
    var loader = new Loader();
    
    ko.applyBindings();
}

