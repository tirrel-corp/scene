import _ from 'lodash';
import { harkBinToId } from '@urbit/api';
import { useHarkStore } from '../state/hark';
import { normalizeUrbitColor } from '../state/util';

const MAX_CONTENTS = 3;

const Notifications = props => {
  const { charges, visible } = props;
  const harkStore = useHarkStore();
  const { seen, unseen } = harkStore;

  return (
    <div
      id="notifications"
      class={`notifications text-zinc-200 ${visible ? 'shown' : ''}`}
    >
      <section>
        {Object.values(unseen)
          .sort((a, b) => b.time - a.time)
          .filter(n => !!n?.body?.[0])
          .filter(n => !!charges?.[n.bin.place.desk])
          .map(n => ([n, charges[n.bin.place.desk]]))
          .map(([n, charge], idx) => (
            <Notification key={idx} className="unseen" {...{notification: n, charge}}>
              Unseen Notification {idx}
            </Notification>
          ))
        }
        {Object.values(seen)
          .sort((a, b) => b.time - a.time)
          .filter(n => !!n?.body?.[0])
          .filter(n => !!charges?.[n.bin.place.desk])
          .map(n => ([n, charges[n.bin.place.desk]]))
          .map(([n, charge], idx) => (
            <Notification key={idx} {...{notification: n, charge}}>
              Seen Notification {idx}
            </Notification>
          ))
        }
      </section>
    </div>
  );
}

const Notification = props => {
  const { charge, className = '', notification, lid } = props;
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
      onClick={() => console.debug(notification.body?.[0])}
      className={`notification bg-neutral-700 text-white ${className}`}>
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
        {_.take(contents, MAX_CONTENTS).map((c, idx) => (<p key={idx}>{c.text}</p>))}
        {contents.length > MAX_CONTENTS && (
          <p>...and {contents.length - MAX_CONTENTS} more</p>
        )}
      </article>
    </div>
  )
};

const DocketImage = props => {
  const { className = '', color, image } = props;

  const bgColor = normalizeUrbitColor(color);
  
  return (
    <div className={`docket-image ${className}`} style={{background: bgColor}}>
      <img src={image} alt="" />
    </div>
  )
}

export default Notifications;
