import { useEffect, useRef, useMemo } from 'react';
import _ from 'lodash';
import { harkBinToId } from '@urbit/api';
import CloseIcon from './icons/close';
import { useHarkStore } from '../state/hark';

const MAX_CONTENTS = 3;

const Notifications = props => {
  const { charges, focusByCharge, visible } = props;
  const harkStore = useHarkStore();
  const { seen, unseen } = harkStore;
  const empty = Object.values(unseen).length === 0
    && Object.values(seen).length === 0;

  const lastVisible = useRef(visible.value);
  useEffect(() => {
    const previous = lastVisible.current;
    if (!previous && visible.value) {
      useHarkStore.getState().opened();
    }
    lastVisible.current = visible.value;
  }, [visible]);

  const sortedUnseen = useMemo(() =>
    Object.values(unseen)
      .sort((a, b) => b.time - a.time)
      .filter(n => !!n?.body?.[0])
      .filter(n => !!charges?.[n.bin.place.desk])
      .map(n => ([n, charges[n.bin.place.desk]]))
      .filter(([n, charge]) => charge?.title !== 'System'),
  [charges, unseen]);
  const sortedSeen = useMemo(() => 
    Object.values(seen)
    .sort((a, b) => b.time - a.time)
    .filter(n => !!n?.body?.[0])
    .filter(n => !!charges?.[n.bin.place.desk])
    .map(n => ([n, charges[n.bin.place.desk]]))
    .filter(([n, charge]) => charge?.title !== 'System'),
  [charges, seen]);


  return (
    <div
      id="notifications"
      className={`text-zinc-200 ${visible.value ? 'shown' : ''}`}
    >
      <section>
        {empty && (
          <div className="p-3 text-center">
            <p>No notifications</p>
          </div>
        )}
        {sortedUnseen.map(([n, charge], idx) => (
          <Notification {...{
            key: `unseen-${idx}`,
            className: 'unseen',
            notification: n,
            charge,
            lid: { unseen: null },
            onClick: () => {
              focusByCharge(charge);
              visible.set(false);
            },
          }}/>
        ))}
        {sortedSeen.map(([n, charge], idx) => (
          <Notification {...{
            key: `seen-${idx}`,
            notification: n,
            charge,
            lid: { seen: null },
            onClick: () => {
              focusByCharge(charge)
              visible.set(false);
            },
          }}/>
        ))}
      </section>
    </div>
  );
}

const Notification = props => {
  const { charge, className = '', notification, lid, ...rest } = props;
  const binId = harkBinToId(notification.bin);
  const id = `notif-${notification.time}-${binId}`;

  const contents = _.map(notification.body, 'content').filter(c => c.length);
  const large = contents.length === 0;
  const archive = () => {
    useHarkStore.getState().archiveNote(notification.bin, lid);
  };

  const archiveNoFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    archive();
  };

  return (
    <div
      className={`notification bg-neutral-700 text-white ${className}`}
      {...rest}>
      <header>
        <DocketImage {...charge} />
        <h2>{charge?.title || notification.bin.place.desk}</h2>
        <button
          className="weird ml-auto hover:brightness-50"
          style={{
            transition: 'none',
            "--close-icon-bg": "gainsboro",
            "--close-icon-fg": "black",
          }}
          onClick={archiveNoFollow}>
          <CloseIcon />
        </button>
      </header>
      <article>
        <h2>{notification.body[0].title.map(i => i.ship
            ? (<span key={i.ship} className="ship">{i.ship}</span>)
            : (<span key={i.text}>{i.text}</span>)
        )}</h2>
        {_.take(contents, MAX_CONTENTS).map((cs, idx) => (
          <p key={idx}>
            {cs.map((c, idx) => (
              <span className={c?.ship ? 'ship' : ''} key={idx}>
                {c?.ship || c.text}
              </span>
            ))}
          </p>
        ))}
        {contents.length > MAX_CONTENTS && (
          <p>...and {contents.length - MAX_CONTENTS} more</p>
        )}
      </article>
    </div>
  )
};

const DocketImage = props => {
  const { className = '', color, image } = props;

  const bgColor = color;

  return (
    <div className={`docket-image ${className}`} style={{ background: bgColor }}>
      <img src={image} alt="" />
    </div>
  )
}

export default Notifications;
