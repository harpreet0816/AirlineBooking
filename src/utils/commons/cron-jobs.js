const cron = require("node-cron");
const { BookingService } = require("../../services");


function scheduleCrons() {
    cron.schedule('0 0 */30 * * *', async () => {
        await BookingService.cancelOldBookings();
        console.log("Cron job executed");
    })
}

module.exports = scheduleCrons;