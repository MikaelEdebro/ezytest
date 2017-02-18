import ko from "knockout";
import { Dashboard } from "./dashboard/dashboard";


activateKnockoutComponents();

ko.applyBindings();


function activateKnockoutComponents() {
    var dash = new Dashboard();
}

