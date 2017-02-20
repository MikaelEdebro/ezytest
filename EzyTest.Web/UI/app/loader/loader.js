import { KnockoutService } from "../services/knockout.service";
import template from "./loader.html";

export class Loader {

    constructor() {

        const defaultLoaderText = "Loading...";

        const viewModel = function (params) {
            this.showLoader = params.showLoader;
            this.text = params.text || defaultLoaderText;
        };

        KnockoutService.registerComponent("ezy-loader", viewModel, template);
    }
}