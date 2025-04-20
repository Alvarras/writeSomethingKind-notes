// API utility functions for interacting with the Dicoding Notes API

const API_BASE_URL = "https://notes-api.dicoding.dev/v2"

// Fetch all active (non-archived) notes
export async function fetchNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch notes")
    }

    return data.data || []
  } catch (error) {
    console.error("Error fetching notes:", error)
    throw error
  }
}

// Fetch all archived notes
export async function fetchArchivedNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/archived`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch archived notes")
    }

    return data.data || []
  } catch (error) {
    console.error("Error fetching archived notes:", error)
    throw error
  }
}

// Create a new note
export async function createNote(title, body) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to create note")
    }

    return data.data
  } catch (error) {
    console.error("Error creating note:", error)
    throw error
  }
}

// Get a single note by ID
export async function getNote(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to get note")
    }

    return data.data
  } catch (error) {
    console.error(`Error getting note ${id}:`, error)
    throw error
  }
}

// Archive a note
export async function archiveNote(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to archive note")
    }

    return true
  } catch (error) {
    console.error(`Error archiving note ${id}:`, error)
    throw error
  }
}

// Unarchive a note
export async function unarchiveNote(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to unarchive note")
    }

    return true
  } catch (error) {
    console.error(`Error unarchiving note ${id}:`, error)
    throw error
  }
}

// Delete a note
export async function deleteNote(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to delete note")
    }

    return true
  } catch (error) {
    console.error(`Error deleting note ${id}:`, error)
    throw error
  }
}
