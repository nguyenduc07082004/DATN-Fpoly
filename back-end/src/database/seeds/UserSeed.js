import User from '../../models/UserModels.js';
import { hassPassword } from '../../utils/password.js';
export const users = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    password: hassPassword("12345678"),  
    phone: "1234567890",
    address: "123 Street Name, City",
    role: "admin"
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    email: "jane.doe@example.com",
    password: hassPassword("12345678"),  
    phone: "0987654321",
    address: "456 Another St, City",
    role: "user"
  },
];

export const insertUsers = () => User.insertMany(users);
