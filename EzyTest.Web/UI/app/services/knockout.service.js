import ko from "knockout";

export class KnockoutService {

    static registerComponent(name, viewModel, template) {
        const componentConfig = {
            template: template,
            viewModel: viewModel
        };

        if (typeof viewModel === "object") {    // allow the possibility to pass in both functions and POJO
            componentConfig.viewModel = { instance: viewModel };
        }

        ko.components.register(name, componentConfig);
    }
}