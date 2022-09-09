import { useHarkStore } from '../state/hark';

const Notifications = props => {
  const { visible } = props;
  const harkStore = useHarkStore();
  const { seen, unseen } = harkStore;

  return (
    <div
      id="notifications"
      class={`notifications ${visible ? 'shown' : ''}`}
    >
      {Object.entries(unseen)
        .sort(([, a], [, b]) => b.time - a.time)
        .map((n, idx) => (
          <div key={idx}>
            Unseen Notification {idx}
          </div>
        ))
      }
      {Object.entries(seen)
        .sort(([, a], [, b]) => b.time - a.time)
        .map((n, idx) => (
          <div key={idx}>
            Seen Notification {idx}
          </div>
        ))
      }
    </div>
  );
}

export default Notifications;
