import User from "../../model/user";
import bcrypt from "bcrypt"

class UserService {
  // Create a new user
    async createUser(data: { firstName: string; lastName?: string; email: string; password: string; role?: string }) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
    });
    console.log("User created:", user.toJSON());
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}


  // Get all users
  async getAllUsers() {
    return User.findAll();
  }

  // Get single user by ID
  async getUserById(id: string) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  // Update user
  async updateUser(id: string, data: { firstName?: string; lastName?: string; email?: string; password?: string; role?: string }) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return user.update(data);
  }

  // Delete user
  async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    await user.destroy();
    return { message: "User deleted successfully" };
  }
}

// Export a single instance
export default new UserService();