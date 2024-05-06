const mongoose = require('mongoose');
const Task = require('../models/task');

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

module.exports = {
  displayTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion
};
