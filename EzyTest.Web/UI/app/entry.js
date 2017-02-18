import ko from "knockout";
import { Dashboard } from "./dashboard/dashboard";
import { ExchangeRates } from "./exchange-rates/exchange-rates";
import { BetterExample } from "./better-example/better-example";

activateKnockoutComponents();


function activateKnockoutComponents() {
    var dash = new Dashboard();
    var exchangeRates = new ExchangeRates();
    var betterExample = new BetterExample();
    
    ko.applyBindings();
}

