import { APP_CONFIG } from "../config/config.js";
import { renderUsers } from "../views/users.view.js";

export async function initUsersPage() {

  try {

    let users = JSON.parse(
      localStorage.getItem("greenhouse_users")
    );

    if (!users) {

      const response = await fetch(
        APP_CONFIG.localData.users
      );

      const data = await response.json();

      users = data.users;

      localStorage.setItem(
        "greenhouse_users",
        JSON.stringify(users)
      );

    }

    renderUsers(users);

  } catch (error) {

    console.error(error);

  }

}