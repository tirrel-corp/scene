import { unstable_batchedUpdates as batchUpdates } from 'react-dom';
import produce from 'immer';
import create from 'zustand';
import { decToUd } from '@urbit/api';

export function emptyCarpet(seam) {
    return {
        seam,
        yarns: {},
        cable: [],
        stitch: 0,
    };
}

export function emptyBlanket(seam) {
    return {
        seam,
        yarns: {},
        quilt: {},
    };
}

function harkAction(action) {
    return {
        app: 'hark',
        mark: 'hark-action',
        json: action,
    };
}

const useHarkState = create((set, get) => ({
    set: (fn) => {
        set(produce(get(), fn));
    },
    batchSet: (fn) => {
        batchUpdates(() => {
            get().set(fn);
        });
    },
    carpet: emptyCarpet({ all: null }),
    blanket: emptyBlanket({ all: null }),
    start: () => {
        get().retrieve();

        window.api.subscribe({
            app: 'hark',
            path: '/ui',
            event: (event) => {
                console.log(event, get().carpet);
                const { retrieve } = get();
                retrieve();
            },
        });
    },
    retrieve: async () => {
        const carpet = await window.api.scry({
            app: 'hark',
            path: `/all/latest`,
        });

        const blanket = await window.api.scry({
            app: 'hark',
            path: `/all/quilt/${decToUd(carpet.stitch.toString())}`,
        });

        get().batchSet((draft) => {
            draft.carpet = carpet;
            draft.blanket = blanket;
        });
    },
    sawRope: (rope) => {
        window.api.poke(
            harkAction({
                'saw-rope': rope,
            })
        );
    },
    sawSeam: (seam) => {
        window.api.poke(
            harkAction({
                'saw-seam': seam,
            })
        );
    },
}));

export default useHarkState;
