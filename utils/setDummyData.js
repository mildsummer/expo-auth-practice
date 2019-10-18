import { db } from './firebase';

const SIZE = 100;
export default (user) => {
  const batch = db.batch();
  for (let i = 0; i < SIZE; i++) {
    batch.set(
      db.collection('/posts').doc(),
      {
        author: user.uid,
        text: `${i}test`
      }
    );
  }
  batch.set(
    db.collection('/users').doc(user.uid),
    {
      postsSize: SIZE
    }
  );
  return batch.commit();
};
