export class ReminderService {

    static remindUser(seconds, callback) {
        let milliseconds = seconds * 1000;
        let message = `You have now been on the page for ${seconds} seconds`;

        if (!callback) {
            callback = function () {
                alert(message);
            }
        }

        setTimeout(function () {
            callback();
        }, milliseconds);
    }

}