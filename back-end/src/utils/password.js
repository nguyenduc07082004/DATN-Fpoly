import bcrypt from "bcryptjs";

export const hassPassword = (password) => {
  // const salt = bcryptjs.genSaltSync(10);
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compareSync(password, hashPassword);
};
