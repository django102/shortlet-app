/* istanbul ignore file */
import cron from "node-cron";
import CountryService from "./CountryService";


const CreateSchedule = (time: string, task: any, zone: cron.ScheduleOptions) => {
    return cron.schedule(time, task, zone);
}


const importCountries = CreateSchedule("0 0 * * *", () => CountryService.getAllCountriesFromService(), {
    scheduled: true,
    timezone: 'Africa/Lagos',
});

// const testSchedule = CreateSchedule("*/10 * * * * *", () => { console.log("CRON executed") }, {
//     scheduled: true,
//     timezone: 'Africa/Lagos'
// })


export const scheduleList = [
    importCountries,
    // testSchedule
];


export const RunSchedules = async (schedules: any = []) => {
    const promises = [];
    for (const schedule of schedules) {
        promises.push(schedule.start());
    }
    await Promise.all(promises);
};