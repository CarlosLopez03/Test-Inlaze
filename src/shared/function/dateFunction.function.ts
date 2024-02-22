import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

// Config Dayjs
dayjs.locale(dayjs.locale('es'));
dayjs.extend(utc);

/**
 * Adjust the date and time to save in the database.
 * @param {Date|string} date - The date and time to be adjusted, represented as an object date or a text chain.
 * @returns {Date} - The date and time for saving in the database.
 */
export function dateFunctionSave(date: Date | string): Date {
  return dayjs(date).subtract(5, 'hours').toDate();
}
