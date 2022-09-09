import { useHarkStore } from '../state/hark';

const Notifications = props => {
  const { visible } = props;
  const harkStore = useHarkStore();

  return (
    <div class="notifications">
    </div>
  );
}

export default Notifications;
