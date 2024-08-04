import axios from 'axios'
import { MoodConfigurations, PersonalityConfigurations } from './configTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL as string
const CHARACTER_NAME =process.env.EXPO_PUBLIC_CHARACTER_NAME as string
const WORKSPACE_ID = process.env.EXPO_PUBLIC_WORKSPACE_ID as string
const STUDIO_API_KEY = process.env.EXPO_PUBLIC_STUDIO_API_KEY as string
const STUDIO_API_SECRET = process.env.EXPO_PUBLIC_STUDIO_API_SECRET as string

const headers = {
  'Content-Type': 'application/json',
  'Grpc-Metadata-X-Authorization-Bearer-Type': 'studio_api'
}

export const fetchMoodConfig = async () => {

  try {
    const response = await axios.get(
      `${BASE_URL}/workspaces/${WORKSPACE_ID}/characters/${CHARACTER_NAME}`,
      {
        headers: headers,
        auth: {
          username: STUDIO_API_KEY,
          password: STUDIO_API_SECRET
        }
      }
    )
    return response.data.initialMood
  } catch (error) {
    console.error("Error fetching mood configuration:", error);
    return {}
  }
}

export const fetchPersonalityConfig = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/workspaces/${WORKSPACE_ID}/characters/${CHARACTER_NAME}`,
      {
        headers: headers,
        auth: {
          username: STUDIO_API_KEY,
          password: STUDIO_API_SECRET
        }
      }
    )
    return response.data.personality;
  } catch (error) {
    console.error("Error fetching personality configuration:", error);
    return {}
  }
}

export const updateMoodConfig = async (updateMoodConfig: MoodConfigurations) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/workspaces/${WORKSPACE_ID}/characters/${CHARACTER_NAME}`,
      {
        initialMood: updateMoodConfig
      },
      {
        headers: headers,
        auth: {
          username: STUDIO_API_KEY,
          password: STUDIO_API_SECRET
        }
      }
    )
    return response.data.initialMood
  } catch (error) {
    console.error("Error updating mood configuration:", error);
  }
}

export const updatePersonalityConfig = async (updatePersonalityConfig: PersonalityConfigurations) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/workspaces/${WORKSPACE_ID}/characters/${CHARACTER_NAME}`,
      {
        personality: updatePersonalityConfig
      },
      {
        headers: headers,
        auth: {
          username: STUDIO_API_KEY,
          password: STUDIO_API_SECRET
        }
      }
    )
    return response.data.personality
  } catch (error) {
    console.error("Error updating personality configuration:", error);
  }
}