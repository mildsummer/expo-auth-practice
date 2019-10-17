import { db } from './firebase';

export default (user) => {
  const batch = db.batch();
  for (let i = 0; i < 100; i++) {
    batch.set(
      db.collection('/posts').doc(),
      {
        author: user.uid,
        text: `${i}test`
      }
    );
  }
  return batch.commit();
};
