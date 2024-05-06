require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');

const Task = require('./models/task');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});




mongoose.connect(process.env.MONGO_URI);

function displayTasks() {
    Task.find({})
      .then(tasks => {
        if (tasks.length === 0) {
          console.log("No tienes tareas pendientes.");
        } else {
          console.log("Tareas pendientes:");
          tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.title} - ${task.completed ? 'Completada' : 'Pendiente'}`);
          });
        }
      })
      .catch(err => {
        console.error('Error al obtener las tareas:', err);
      });
  }
  

function addTask(taskTitle) {
    const newTask = new Task({
      title: taskTitle,
      completed: false
    });
    newTask.save()
      .then(savedTask => {
        console.log(`"${savedTask.title}" fue añadido a la lista de tareas.`);
      })
      .catch(err => {
        console.error('Error al guardar la tarea:', err);
      });
  }

function deleteTask(index) {
  Task.findOneAndDelete({}, (err, deletedTask) => {
    if (err) {
      console.error('Error al eliminar la tarea:', err);
    } else {
      console.log(`"${deletedTask.title}" fue eliminado de la lista de tareas.`);
    }
  });
}

function toggleTaskCompletion(index) {
    Task.findOne({})
      .then(task => {
        if (!task) {
          console.log('No se encontró ninguna tarea.');
          return;
        }
        task.completed = !task.completed;
        return task.save();
      })
      .then(updatedTask => {
        if (updatedTask) {
          console.log(`La tarea "${updatedTask.title}" ahora está ${updatedTask.completed ? 'completada' : 'pendiente'}.`);
        }
      })
      .catch(err => {
        console.error('Error al encontrar o actualizar la tarea:', err);
      });
  }
console.log('Bienvenido a la aplicación de gestión de tareas.');

function askForTask() {
    displayTasks();
    rl.question('Por favor, selecciona una opción:\n  1. Agregar nueva tarea\n  2. Marcar tarea como completada\n  3. Salir (o "exit" para salir): ', (answer) => {
      if (answer.toLowerCase() === 'exit' || answer === '3') {
        rl.close();
      } else if (answer === '1') {
        rl.question('Por favor, introduce una nueva tarea: ', (taskTitle) => {
          addTask(taskTitle);
          askForTask();
        });
      } else if (answer === '2') {
        rl.question('Por favor, introduce el número de la tarea que deseas marcar como completada: ', (taskIndex) => {
          toggleTaskCompletion(parseInt(taskIndex) - 1);
          askForTask();
        });
      } else {
        console.log('Opción inválida. Por favor, selecciona una opción válida.');
        askForTask();
      }
    });
  }
  

function askForDelete() {
  displayTasks();
  rl.question('Por favor, introduce el número de la tarea que deseas eliminar (o escriba "exit" para salir): ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      rl.close();
    } else {
      deleteTask(parseInt(answer) - 1);
      askForDelete();
    }
  });
}

function askForToggleCompletion() {
    displayTasks();
    rl.question('Por favor, introduce el número de la tarea que deseas marcar como completada o pendiente (o escriba "exit" para salir): ', (answer) => {
      if (answer.toLowerCase() === 'exit') {
        rl.close();
      } else {
        const taskIndex = parseInt(answer) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          toggleTaskCompletion(taskIndex);
        } else {
          console.log('Número de tarea inválido. Por favor, introduce un número válido.');
        }
        askForToggleCompletion();
      }
    });
  }
askForTask();


rl.on('line', (input) => {
  if (input.toLowerCase() === 'delete') {
    askForDelete();
  } else if (input.toLowerCase() === 'toggle') {
    askForToggleCompletion();
  } else if (input.toLowerCase() === 'exit') {
    rl.close();
  }
});
