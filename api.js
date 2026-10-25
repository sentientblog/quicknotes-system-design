
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const status = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

let notes = [];

// Reusable helper for GET, POST and DELETE requests.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error(
      `Request failed with status ${response.status}.`
    );
    error.status = response.status;
    throw error;
  }

  let data = null;

  if (response.status !== 204) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    }
  }

  return {
    data,
    status: response.status
  };
}

function showStatus(message, type = "") {
  status.textContent = message;
  status.classList.remove("success", "error");

  if (type) {
    status.classList.add(type);
  }
}

function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No notes to display. Load notes or create one.";
    notesList.appendChild(emptyItem);
    return;
  }

  notes.forEach((note) => {
    const item = document.createElement("li");
    item.classList.add("note");

    const title = document.createElement("h3");
    title.textContent = note.title || "(Untitled note)";

    const body = document.createElement("p");
    body.textContent = note.body || "No body provided.";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id, item, deleteBtn);
    });

    item.append(title, body, deleteBtn);
    notesList.appendChild(item);
  });
}

// GET: load the first 10 notes.
async function loadNotes() {
  loadBtn.disabled = true;
  showStatus("Loading notes...");

  try {
    const result = await request(`${API_URL}?_limit=10`);
    notes = result.data;

    renderNotes();

    if (notes.length === 0) {
      showStatus("No notes found.", "success");
    } else {
      showStatus(
        `Loaded ${notes.length} notes from the server.`,
        "success"
      );
    }
  } catch (error) {
    showStatus(
      "Unable to load notes. Please check your connection and try again.",
      "error"
    );
    console.error("Load notes failed:", error);
  } finally {
    loadBtn.disabled = false;
  }
}

// POST: create a note.
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value;

  if (!title) {
    showStatus("Please enter a title for your note.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must be 100 characters or fewer.", "error");
    titleInput.focus();
    return;
  }

  submitBtn.disabled = true;
  showStatus("Creating note...");

  try {
    const result = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    const createdNote = result.data;

    // JSONPlaceholder simulates POST and does not persist the note.
    // Keep it in this browser's current list until the list is reloaded.
    notes.unshift(createdNote);
    renderNotes();

    showStatus(
      `Note created (status ${result.status}, id ${createdNote.id}).`,
      "success"
    );

    noteForm.reset();
  } catch (error) {
    showStatus(
      "Unable to create the note. Please try again.",
      "error"
    );
    console.error("Create note failed:", error);
  } finally {
    submitBtn.disabled = false;
  }
}

// DELETE: remove a note.
async function deleteNote(noteId, item, deleteBtn) {
  deleteBtn.disabled = true;
  showStatus("Deleting note...");

  try {
    const result = await request(`${API_URL}/${noteId}`, {
      method: "DELETE"
    });

    // JSONPlaceholder simulates deletion; it does not alter server data.
    // Remove the note from the current client-side list after success.
    notes = notes.filter((note) => note.id !== noteId);
    item.remove();

    if (notes.length === 0) {
      renderNotes();
      showStatus(
        `Note deleted (status ${result.status}). No notes remain.`,
        "success"
      );
    } else {
      showStatus(`Note deleted (status ${result.status}).`, "success");
    }
  } catch (error) {
    deleteBtn.disabled = false;
    showStatus(
      "Unable to delete the note. Please try again.",
      "error"
    );
    console.error("Delete note failed:", error);
  }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
