/* eslint-disable no-param-reassign */
import {
  BigIntOrderedMap,
  makePatDa,
  decToUd,
  unixToDa,
  harkBinToId,
  opened,
  archive,
  archiveAll
} from '@urbit/api';
/* eslint-disable-next-line camelcase */
import produce from 'immer';
import _ from 'lodash';
import { api } from './api';
import { createState, createSubscription, reduceStateN } from './base';

// export interface HarkState {
//   seen: Timebox;
//   unseen: Timebox;
//   archive: BigIntOrderedMap<Timebox>;
//   set: (f: (s: HarkState) => void) => void;
//   opened: () => Promise<void>;
//   notificationsGraphConfig: NotificationGraphConfig;
//   archiveAll: () => Promise<void>;
//   archiveNote: (bin: HarkBin, lid: HarkLid) => Promise<void>;
//   getMore: () => Promise<void>;
//   webNotes: {
//     [binId: string]: Notification[];
//   };
//   [ref: string]: unknown;
// }

// type BaseHarkState = BaseState<HarkState> & HarkState;

function updateState(key, transform) {
  return (json, state) => {
    if (_.has(json, key)) {
      transform(state, _.get(json, key, undefined));
    }
    return state;
  };
}

export const reduceGraph = [
  updateState('initial', (draft, data) => {
    draft.notificationsGraphConfig = data;
  }),
  updateState('set-mentions', (draft, data) => {
    draft.notificationsGraphConfig.mentions = data;
  })
];

export const useHarkStore = createState(
  'Hark',
  (set, get) => ({
    seen: {},
    unseen: {},
    archive: new BigIntOrderedMap(),
    webNotes: {},
    notificationsGraphConfig: {
      watchOnSelf: false,
      mentions: false,
      watching: []
    },

    set: (f) => {
      const newState = produce(get(), f);
      set(newState);
    },
    archiveAll: async () => {
      get().set((draft) => {
        draft.unseen = {};
        draft.seen = {};
      });
      await api.poke(archiveAll);
    },
    archiveNote: async (bin, lid) => {
      get().set((draft) => {
        const seen = 'seen' in lid ? 'seen' : 'unseen';
        const binId = harkBinToId(bin);
        delete draft[seen][binId];
      });
      await api.poke(archive(bin, lid));
    },
    opened: async () => {
      reduceHark({ opened: null });

      await api.poke(opened);
    },
    getMore: async () => {
      const { archive: arch } = get();
      const idx = decToUd((arch?.peekSmallest?.()?.[0] || unixToDa(Date.now() * 1000)).toString());
      const update = await api.scry({
        app: 'hark-store',
        path: `/recent/inbox/${idx}/5`
      });
      reduceHark(update);
    }
  }),
  ['archive', 'unseen', 'seen'],
  [
    (set, get) =>
      createSubscription('hark-graph-hook', '/updates', (j) => {
        const graphHookData = _.get(j, 'hark-graph-hook-update', false);
        if (graphHookData) {
          reduceStateN(get(), graphHookData, reduceGraph);
        }
      }),
    () =>
      createSubscription('hark-store', '/updates', (u) => {
        /* eslint-ignore-next-line camelcase */
        reduceHark(u);
      }),
    () =>
      createSubscription('hark-store', '/notes', (n) => {
        if (!('add-note' in n)) {
          return;
        }
        const nativeNotifs = window.localStorage.getItem('nativeNotifs');
        if (!nativeNotifs || !JSON.parse(nativeNotifs)) {
          return;
        }
        const { bin, body } = n['add-note'];
        const binId = harkBinToId(bin);
        const { title, content } = body;

        const note = new Notification(harkContentsToPlainText(title), {
          body: harkContentsToPlainText(content),
          tag: binId,
          renotify: true
        });
        note.onclick = () => {};
      })
  ]
);

export function reduceHark(u) {
  const { set } = useHarkStore.getState();
  if (!u) {
    return;
  }
  if ('more' in u) {
    u.more.forEach((upd) => {
      reduceHark(upd);
    });
  } else if ('all-stats' in u) {
    // TODO: probably ignore?
  } else if ('added' in u) {
    set((draft) => {
      const { bin } = u.added;
      const binId = harkBinToId(bin);
      draft.unseen[binId] = u.added;
    });
  } else if ('timebox' in u) {
    const { timebox } = u;
    const { lid, notifications } = timebox;
    if ('archive' in lid) {
      set((draft) => {
        const time = makePatDa(lid.archive);
        const old = draft.archive.get(time) || {};
        notifications.forEach((note) => {
          const binId = harkBinToId(note.bin);
          old[binId] = note;
        });
        draft.archive = draft.archive.set(time, old);
      });
    } else {
      set((draft) => {
        const seen = 'seen' in lid ? 'seen' : 'unseen';
        notifications.forEach((note) => {
          const binId = harkBinToId(note.bin);
          draft[seen][binId] = note;
        });
      });
    }
  } else if ('archived' in u) {
    const { lid, notification } = u.archived;
    set((draft) => {
      const seen = 'seen' in lid ? 'seen' : 'unseen';
      const binId = harkBinToId(notification.bin);
      delete draft[seen][binId];
      const time = makePatDa(u.archived.time);
      const timebox = draft.archive?.get(time) || {};
      timebox[binId] = notification;
      draft.archive = draft.archive.set(time, timebox);
    });
  } else if ('opened' in u) {
    set((draft) => {
      const bins = Object.keys(draft.unseen);
      bins.forEach((bin) => {
        const old = draft.seen[bin];
        const curr = draft.unseen[bin];
        curr.body = [...curr.body, ...(old?.body || [])];
        draft.seen[bin] = curr;
        delete draft.unseen[bin];
      });
    });
  } else if ('del-place' in u) {
    const { path, desk } = u['del-place'];
    const pathId = `${desk}${path}`;
    const wipeBox = (t) => {
      Object.keys(t).forEach((bin) => {
        if (bin.startsWith(pathId)) {
          delete t[bin];
        }
      });
    };
    set((draft) => {
      wipeBox(draft.unseen);
      wipeBox(draft.seen);
      draft.archive.keys().forEach((key) => {
        // wipeBox(draft.archive.get(key)!);
        wipeBox(draft.archive.get(key));
      });
    });
  }
}

function harkContentsToPlainText(contents) {
  return contents
    .map((c) => {
      if ('ship' in c) {
        return c.ship;
      }
      return c.text;
    })
    .join('');
}
