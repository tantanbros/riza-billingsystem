import { Status } from './constants';

const getStatus = (status, role, datePaid = null) => {
  if (status === Status.Sent) {
    return Status.Unpaid;
  }
  if (status === Status.Paid && datePaid !== null) {
    return `PAID on ${new Date(datePaid).toDateString()}`;
  }
  return status;
};

export { getStatus };
