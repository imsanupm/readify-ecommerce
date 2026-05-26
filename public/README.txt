# Simple React To-Do List

A straightforward, component-based To-Do application built with React.js and Vite. This project covers full CRUD operations, persists data to Local Storage, and is written using only native React hooks all without reaching for any external libraries. State is persisted to the browser's Local Storage so tasks survive a page refresh.

---

## Features

- **Full CRUD** Tasks are automatically saved and restored on page load.
- **Uncontrolled Form** Uses the native browser `crypto.randomUUID()` to generate distinct IDs instead of relying on array indexes.
- **No Extra Dependencies** components/
TodoForm.jsx    # Text input and add button
TodoItem.jsx    # Single task row with edit and delete
TodoList.jsx    # List container that renders all tasks
manages state and localStorage
main.jsx            # Entry point
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react-todo-list.git

# Navigate into the project directory
cd react-todo-list

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Contributing

Contributions are welcome. If you are learning React and want to extend this project, feel free to fork it and open a pull request.

Built with love by **Sanukrishna PM**