import { AuthProvider } from "@refinedev/core";
import { AuthService } from "@genezio/auth";
AuthService.getInstance().setTokenAndRegion("1-90fcbc65-eb01-4950-b629-d96423173ca0", "eu-central-1");

export const authProvider: AuthProvider = {

  register: async ({ username, email, password }) => {
    await AuthService.getInstance().register(email, password);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  login: async ({ username, email, password }) => {
    if ((username || email) && password) {
      await AuthService.getInstance().login(email, password);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    try {
      await AuthService.getInstance().logout();
    } catch (error) {}
    return {
      success: true,
      redirectTo: "/",
    };
  },
  check: async () => {
    try {
      let ui = (await AuthService.getInstance().userInfo());

      if (ui && ui.email) {
        return {
          authenticated: true,
        };
      }
    } catch (error) {}

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      let ui = await AuthService.getInstance().userInfo();
      if (ui && ui.email) {
        return {
          id: ui.userId,
          name: ui.email
        };
      }
    } catch (error) {}
    return null;
  },
  forgotPassword: async ({ email }) => {
    await AuthService.getInstance().resetPassword(email);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  updatePassword: async ({ password, token }) => {
    await AuthService.getInstance().resetPasswordConfirmation(token, password);    
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
