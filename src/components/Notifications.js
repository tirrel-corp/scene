import _ from 'lodash';
import { harkBinToId } from '@urbit/api';
import { useHarkStore } from '../state/hark';

const MAX_CONTENTS = 3;

const Notifications = props => {
  const { charges, visible } = props;
  const harkStore = useHarkStore();
  const { seen, unseen } = harkStore;

  return (
    <div
      id="notifications"
      class={`notifications ${visible ? 'shown' : ''}`}
    >
      {Object.values(unseen)
        .sort((a, b) => b.time - a.time)
        .filter(n => !!n?.body?.[0])
        .filter(n => !!charges?.[n.bin.place.desk])
        .map(n => ([n, charges[n.bin.place.desk]]))
        .map(([n, charge], idx) => (
          <Notification key={idx} {...{notification: n, charge}}>
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
    <div className={`notification ${className}`}>
      <header>
        <div>{charge?.title || notification.bin.place.desk}</div>
        <h2>{notification.body[0].title.map(i => i.text).join()}</h2>
      </header>
      <div>
        {_.take(contents, MAX_CONTENTS).map(c => (<p key={c}>{c}</p>))}
        {contents.length > MAX_CONTENTS && (
          <p>...and {contents.length - MAX_CONTENTS} more</p>
        )}
      </div>
    </div>
  )
};

export default Notifications;
