import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: '',
      email: 'admin@example.com',
      password: hashSync('123456', 10),
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: hashSync('123456', 10),
    }
  ],

};

export default sampleData;
