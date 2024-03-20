import { db } from '../../mongo';

const helloWorldCollection = () => {
  return db.collection('helloWorld');
};

export const findOneHelloWorld = async () => {
  const collection = helloWorldCollection();

  return collection.findOne();
};
