import _ from 'lodash';
import { differenceInDays, format, endOfToday } from 'date-fns';
import useHarkState from '../state/hark';

function getYarns(thread, yarns) {
    return _.values(_.pickBy(yarns, (v, k) => thread.includes(k))).sort((a, b) => b.time - a.time);
}

function isYarnShip(obj) {
    return typeof obj !== 'string' && 'ship' in obj;
}

function getBin(thread, yarns, unread) {
    const ys = getYarns(thread, yarns);
    const topYarn = _.head(ys);
    const shipCount = _.uniqBy(ys, (y) => y.con.find(isYarnShip)?.ship).length;

    return {
        time: topYarn?.time || 0,
        count: thread.length,
        shipCount,
        unread,
        topYarn
    };
}

export function makePrettyDay(date) {
    const diff = differenceInDays(endOfToday(), date);
    switch (diff) {
        case 0:
            return 'Today';
        case 1:
            return 'Yesterday';
        default:
            return `${format(date, 'LLLL')} ${format(date, 'do')}`;
    }
}

function groupBinsByDate(bins) {
    const groups = _.groupBy(bins, (b) => makePrettyDay(new Date(b.time)));

    return Object.entries(groups)
        .map(([k, v]) => ({
            date: k,
            latest: _.head(v)?.time || 0,
            bins: v.sort((a, b) => b.time - a.time)
        }))
        .sort((a, b) => b.latest - a.latest);
}

const selNotifications = (state) => ({ carpet: state.carpet, blanket: state.blanket });
export const useNotifications = () => {
    const { carpet, blanket } = useHarkState(selNotifications);
    const bins = carpet.cable.map((c) => getBin(c.thread, carpet.yarns, true));
    const oldBins = Object.values(blanket.quilt).map((t) => getBin(t, blanket.yarns, false));
    const notifications = groupBinsByDate(bins.concat(oldBins));

    return {
        count: carpet.cable.length,
        notifications
    };
};
