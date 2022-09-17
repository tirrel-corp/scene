import _ from 'lodash';
import { harkBinToId } from '@urbit/api';
import { useHarkStore } from '../state/hark';

const MAX_CONTENTS = 3;

const Notifications = props => {
  const { charges, focusByCharge, visible } = props;
  const harkStore = useHarkStore();
  const { seen, unseen } = harkStore;
  const empty = Object.values(unseen).length === 0
    && Object.values(seen).length === 0;

  return (
    <div
      id="notifications"
      className={`notifications text-zinc-200 ${visible.value ? 'shown' : ''}`}
    >
      <section>
        {empty && (
          <div className="p-3 text-center">
            <p>No notifications</p>
          </div>
        )}
        {Object.values(unseen)
          .sort((a, b) => b.time - a.time)
          .filter(n => !!n?.body?.[0])
          .filter(n => !!charges?.[n.bin.place.desk])
          .map(n => ([n, charges[n.bin.place.desk]]))
          .filter(([n, charge]) => charge?.title !== 'System')
          .map(([n, charge], idx) => (
            <Notification {...{
              key: idx,
              className: 'unseen',
              notification: n,
              charge,
              lid: { unseen: null },
              onClick: () => {
                focusByCharge(charge);
                visible.set(false);
              },
            }}>
              Unseen Notification {idx}
            </Notification>
          ))
        }
        {Object.values(seen)
          .sort((a, b) => b.time - a.time)
          .filter(n => !!n?.body?.[0])
          .filter(n => !!charges?.[n.bin.place.desk])
          .map(n => ([n, charges[n.bin.place.desk]]))
          .filter(([n, charge]) => charge?.title !== 'System')
          .map(([n, charge], idx) => (
            <Notification {...{
              key: idx,
              notification: n,
              charge,
              lid: { seen: null },
              onClick: () => {
                focusByCharge(charge)
                visible.set(false);
              },
            }}>
              Seen Notification {idx}
            </Notification>
          ))
        }
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

  const archiveNoFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <button className="archive ml-auto" onClick={archiveNoFollow}>
          <svg width="9" height="9" className="icon inline">
            <use href="/icons.svg#cross-circle" />
          </svg>
        </button>
      </header>
      <article>
        <h2>{notification.body[0].title.map(i =>
          i.ship ? (<span className="ship">{i.ship}</span>) : (<span>{i.text}</span>)
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
