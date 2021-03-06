import { getNotificationEvents } from 'api';
import { useEffect, useState } from 'react';

export function useNotificationFilter(category) {

  const [notifications, setNotifications] = useState([]);

  const filterByCategory = (notificationArr) => {
    return notificationArr.filter(item => item.type === category);
  }

  useEffect(() => {
    (async () => {
      const initialActivities = await getNotificationEvents({
        limit: 50,
        category: 'bets',
      }).catch(err => {
        console.error("Can't get trade by id:", err);
      });

      if (category) {
        const notificationByCategory = filterByCategory(initialActivities?.data);
        console.log('bycategory', notificationByCategory)
        setNotifications(notificationByCategory);
      } else {
        setNotifications(initialActivities?.data);
      }
    })().catch(err => {
      console.error('initialNotification error', err);
    });
  }, []);

  return { notifications };
}
