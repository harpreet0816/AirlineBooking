const cron = require("node-cron");
const { BookingService } = require("../../services");
 
function scheduleCrons() {
    cron.schedule('*/5 */10 * * * *', async () => {
        // const res = await BookingService.cancelOldBookings();
        console.log("running a task every 10 minute");
    })
}

module.exports = scheduleCrons;