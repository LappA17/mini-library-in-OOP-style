import Customizator from "./customizator";

window.addEventListener("DOMContentLoaded", () => {
    const panel = new Customizator(); /* new - директива, при помощи которой создаем новый Customizator, когда мы создаем
экземпляр класса(те новый объект), который помещается в переменную. Теперь в panel есть свойства с файла customizator.js !*/
    panel.render(); // выполнится весь код рендера с кастомизатора js
});