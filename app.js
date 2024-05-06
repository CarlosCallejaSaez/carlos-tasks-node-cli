require("dotenv").config();
const readline = require("readline");
const mongoose = require("mongoose");
const {
  displayTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
} = require("./controllers/taskController");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

mongoose.connect(process.env.MONGO_URI);

console.log("Bienvenido a la aplicación de gestión de tareas.");

function askForTask() {
  displayTasks();
  rl.question(
    'Por favor, selecciona una opción:\n  1. Agregar nueva tarea\n  2. Marcar tarea como completada\n  3. Salir (o "exit" para salir): ',
    (answer) => {
      if (answer.toLowerCase() === "exit" || answer === "3") {
        rl.close();
      } else if (answer === "1") {
        rl.question("Por favor, introduce una nueva tarea: ", (taskTitle) => {
          addTask(taskTitle);
          askForTask();
        });
      } else if (answer === "2") {
        rl.question(
          "Por favor, introduce el número de la tarea que deseas marcar como completada: ",
          (taskIndex) => {
            toggleTaskCompletion(parseInt(taskIndex) - 1);
            askForTask();
          }
        );
      } else {
        console.log(
          "Opción inválida. Por favor, selecciona una opción válida."
        );
        askForTask();
      }
    }
  );
}

function askForDelete() {
  displayTasks();
  rl.question(
    'Por favor, introduce el número de la tarea que deseas eliminar (o escriba "exit" para salir): ',
    (answer) => {
      if (answer.toLowerCase() === "exit") {
        rl.close();
      } else {
        deleteTask(parseInt(answer) - 1);
        askForDelete();
      }
    }
  );
}

function askForToggleCompletion() {
  displayTasks();
  rl.question(
    'Por favor, introduce el número de la tarea que deseas marcar como completada o pendiente (o escriba "exit" para salir): ',
    (answer) => {
      if (answer.toLowerCase() === "exit") {
        rl.close();
      } else {
        const taskIndex = parseInt(answer) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          toggleTaskCompletion(taskIndex);
        } else {
          console.log(
            "Número de tarea inválido. Por favor, introduce un número válido."
          );
        }
        askForToggleCompletion();
      }
    }
  );
}
askForTask();

rl.on("line", (input) => {
  if (input.toLowerCase() === "delete") {
    askForDelete();
  } else if (input.toLowerCase() === "toggle") {
    askForToggleCompletion();
  } else if (input.toLowerCase() === "exit") {
    rl.close();
  }
});
