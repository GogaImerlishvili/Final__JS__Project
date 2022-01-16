"use strict";

// Todo List JS

// Selectos
let burgerButton = document.querySelector(".hamburger");
let navList = document.querySelector(".nav-ul");
let inputValue = document.querySelector(".input-value");
let addButton = document.querySelector(".add-button");
let todoList = document.querySelector(".todo-list");
let filterOption = document.querySelector(".filter-todo");

// EventListeners
document.addEventListener("DOMContentLoaded", getTodos);
burgerButton.addEventListener("click", addMenu);
addButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheckInput);
filterOption.addEventListener("click", filterTodo);
inputValue.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    return addTodo();
  }
});

// Functions

function addMenu() {
  navList.classList.toggle("nav-active");
  burgerButton.classList.toggle("active");
}

function addTodo(event) {
  event.preventDefault();
  if (inputValue.value !== "") {
    const html = `<div class = "todo">
    <li class = "todo-item">${inputValue.value}</li> 
    <button class = "check-button"><i class = "fas fa-check-circle"></i></button>
    <button class = "edit-button"><i class = "fas fa-edit"></i></button>
    <button class = "trash-button"><i class = "fas fa-trash-alt"></i></button>
    </div>`;
    todoList.insertAdjacentHTML("beforeend", html);
    saveLocalTodos(inputValue.value);
    inputValue.value = "";
  }
}

function deleteCheckInput(e) {
  const item = e.target;
  console.log(item);
  if (item.classList[0] === "trash-button") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }
  if (item.classList[0] === "check-button") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
  if (item.classList[0] === "edit-button") {
    let editValue = prompt("edit the selected item", item.childNodes[0].value);
    item.childNodes[0].nodeValue = editValue;
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach((todo) => {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach((todo) => {
    const html = `<div class = "todo">
    <li class = "todo-item" readonly>${todo}</li>
    <button class = "check-button"><i class = "fas fa-check-circle"></i></button>
    <button class = "edit-button"><i class = "fas fa-edit"></i></button>
    <button class = "trash-button"><i class = "fas fa-trash-alt"></i></button>
    </div>`;
    todoList.insertAdjacentHTML("beforeend", html);
  });
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}


// Country Data js

// Selectors
let countriesContainer = document.querySelector(".countries");
let searchButton = document.querySelector(".search-button");
let searchInput = document.querySelector(".search-control");

// AddeventListeners
searchButton.addEventListener("click", getCountryData);

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    return getCountryData();
  }
});

// Functions
function renderCountry(data) {
  const html = `<article class="country">
      <img class="country__img" src="${data.flag}"/>
      <div class="country__data">
        <h3 class="country__name">${data.altSpellings[1]}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${+data.population / 1000000}</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].symbol}</p>
      </div>
    </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
}

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
};

function getCountryData() {
  let searchInput = document.querySelector(".search-control").value.trim();
  fetch(`https://restcountries.com/v2/name/${searchInput}`)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Country not fount ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Country not found ${response.status}`);
      }
      return response.json();
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      console.error(err);
      renderError(`Something went wrong ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}


// Slider JS

const carouselSlide = document.querySelector(".slide");
const carouselImages = document.querySelectorAll(".slide img");
console.log(carouselImages);
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let counter = 1;
let size = carouselImages[0].clientWidth;
carouselSlide.style.transform = `translateX(${-size * counter}px)`;

nextBtn.addEventListener("click", () => {
  if (counter >= carouselImages.length - 1) return;
  carouselSlide.style.transition = "transform 0.4s ease-in-out";
  counter++;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  console.log(carouselSlide)
});


prevBtn.addEventListener("click", () => {
  if (counter <= 0) return;
  carouselSlide.style.transition = "transform 0.4s ease-in-out";
  counter--;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
});

carouselSlide.addEventListener("transitionend", () => {
  if (carouselImages[counter].id === "lastClone") {
    carouselSlide.style.transition = "none";
    counter = carouselImages.length - 2;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  }
  if (carouselImages[counter].id === "firstClone") {
    carouselSlide.style.transition = "none";
    counter = carouselImages.length - counter;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  }
});

// Open Account JS
// Selectors
let modal = document.querySelector(".modal");
let overlay = document.querySelector(".overlay");
let btnShowModal = document.querySelector("#btn--open-modal");
let btnCloseModal = document.querySelector(".btn--close-modal");


// Modal Window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnShowModal.addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});


// FAQ JS

const faqs = document.querySelectorAll(".faq");

const section= document.querySelector('section');


section.addEventListener('click', e =>{
    if(e.target.className === 'btn-delete'){
        console.log(section);
        console.log(e.target.parentNode);
        const x = e.target.parentNode;
        x.style.display = 'none'
        
    }
    
})

faqs.forEach((faq) =>{
    faq.addEventListener("click", () => {
        faq.classList.toggle("activee");
    });
});

