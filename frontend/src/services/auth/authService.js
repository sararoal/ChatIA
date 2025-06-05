import axios from 'axios'
import { config } from "@/config/config.js";

export async function login(email, password) {
  try {
    const res = await axios.post(
      `${config.API_URI}/auth/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err.message);
    return null;
  }

}

export async function logout() {
  try {
    const res = await axios.post(
      `${config.API_URI}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Logout error:", err.message);
    return null;
  }
}
