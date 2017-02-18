import ko from "knockout";

export class KnockoutService {

    static registerComponent(name, viewModel, template) {
        const componentConfig = {
            template: template,
            viewModel: viewModel
        };

        ko.components.register(name, componentConfig);
    }
}