export default class Customizator {
    constructor() {
        this.btnBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');

        // Создадим возможность пользователю скидывать настройки до дефолтных
        this.clear = document.createElement('div');

        //Займем localStorage, что бы при повторном заходе на наш сайт, сохарнялись настройки
        this.scale = localStorage.getItem('scale') || 1; /* получаем значение свойства scale c помощью localStorage + если в 
        localStorage.getItem('scale') будет false то 1 будет стоять как значение по умолчанию как размер шрифта !  */

        this.color = localStorage.getItem('color') || "#e5ffbc"; // #e5ffbc - будет стоять по умолчанию

        this.btnBlock.addEventListener("click", (e) => this.onScaleChange(e));

        this.colorPicker.addEventListener("input", (e) => this.onColorChange(e));

        this.clear.addEventListener("click", () => this.reset());
    }

    onScaleChange(e) {
        // let scale; - это переменная уже не нужна потому что мы создали свойство this.scale и у нее есть значение из локалсторедж
        const body = document.querySelector('body');

        if (e) { /* Здесь вместо e.target.value оставим просто объект события e. Потому что в будущем нужно будет запустить метод,
который запустит инициализацию нашего проекта(тоесть установка всех дата атрибутов, всех фонтсайзов) на основе значение из нашего
локалстореджа. И когда мы будем запускать такой метод у нас не будет евента просто не будет. И если мы вдруг не передали объект события, тоесть он не вызвался в таком формате (e) => this.onScaleChange(e) то мы эту часть кода просто опустим 
if (e) {
    scale = +e.target.value.replace(/x/g, "");
} 
    Если же этот метод произошел во время СОБЫТИЯ то мы будем в this.scale = +e.target.value.replace(/x/g, "") */
            this.scale = +e.target.value.replace(/x/g, "");
        }

/* У нас фцункция recursy теряет значение this.scale потому что она создается как самя обычная фция и КОНТЕКТ ВЫЗОВА ОНА ТЕРЯЕТ !!!
   По этому создаем как стрелочную фцию . Было function recursy(element) {*/
        const recursy = (element) => {
            element.childNodes.forEach(node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) { 

                    if (!node.parentNode.getAttribute('data-fz')) { 

                    let value = window.getComputedStyle(node.parentNode, null).fontSize;
                    node.parentNode.setAttribute('data-fz', +value.replace(/px/g, "")); 
                    node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + "px"; 
                    /*Еще раз напомню что свойсвто this.scale приходит из локалстореджа, а если там ничего не передано то по дефолту стоит 1  */

                    } else { 
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + "px"; 
                    } 

                } else { 
                    recursy(node); 
                }
            });
        }

        recursy(body);

        localStorage.setItem('scale', this.scale);
    }

    onColorChange(e) {
        const body = document.querySelector('body');
        body.style.backgroundColor = e.target.value;
        localStorage.setItem('color', e.target.value); /* color - ключ, e.target.value - значение ключа. Теперь значение this.color
лежит значение прям из локалстореджа */ 
    }

    // Напишем метод который будет устанавливать backgroundColor для тега бади только когда мы заходим на нашу страницу когда у нас рендерится наша новая панелька
    setBgColor() {
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color;
        this.colorPicker.value = this.color;
    }

    // Для того что бы мы новые сталистичиские правила могли подключать к той странице на которой будет работать наш скрипт
    injectStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            .panel {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: fixed;
                top: 10px;
                right: 0;
                border: 1px solid rgba(0,0,0, .2);
                box-shadow: 0 0 20px rgba(0,0,0, .5);
                width: 300px;
                height: 60px;
                background-color: #fff;

            }

            .scale {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100px;
                height: 40px;
            }

            .scale_btn {
                display: block;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(0,0,0, .2);
                border-radius: 4px;
                font-size: 18px;
            }

            .color {
                width: 40px;
                height: 40px;
            }

            .clear {
                font-size: 20px;
                cursor: pointer;
            }
        `;
         /* Дело в том что мы сюда должны вставлять чистый css, а не sass. По этому вырезаем &_btn которая находилось в scale и прописываем .scale_btn
            Clear - стили для крестика !  */

         document.querySelector('head').appendChild(style); /* В head апендим style. И теперь когда наш скрипт будет подключаться к 
нашей странице он будет автоматически задавать сам для себя стилистические правила, что бы пользователю было приятно использовать
фционал.
    Таким образом наш скрипт не зависит от проекта к которому он подлкючается ! */
    }

    //Этот метод будет сбрасывать все значение в локалстореджи до дефолта
    reset() {
        localStorage.clear(); // clear - это метод локалстореджа по очистке
        
        /*Раз уж мы очистили все данные, мы должны помнить про все те свойства которые находятся внутри нашего объекта + после очистки
данных нам нужно изменить все это на странице что бы пользователь увидел изменения */
        this.scale = 1;
        this.color = "#e5ffbc";
        this.setBgColor();
        this.onScaleChange();
    } /* Все, теперь при клике на крестик весь локелсторедж очищается и подставляются дефолтные значение 1 и "#e5ffbc" */

    render() {
        this.injectStyle();
        this.setBgColor(); // Теперь каждый раз как я захожу на страницу будет подставляться значение из локалСтореджа
        this.onScaleChange(); /* Во внутрь ничего не передаем, соотвественно это условие проходит мимо if (e) {
            scale = +e.target.value.replace(/x/g, "");
        } */

        let scaleInputS = document.createElement('input'),
            scaleInputM = document.createElement('input'),
            panel = document.createElement('div');

        panel.append(this.btnBlock, this.colorPicker, this.clear); // апендим this.clear на страницу
        this.clear.innerHTML = `&times`; // &times - это спецсимвол КРЕСТИК
        this.clear.classList.add('clear');

        scaleInputS.classList.add('scale_btn');
        scaleInputM.classList.add('scale_btn');
        this.btnBlock.classList.add('scale');
        this.colorPicker.classList.add('color');

        scaleInputS.setAttribute('type', 'button');
        scaleInputM.setAttribute('type', 'button');
        scaleInputS.setAttribute('value', '1x'); 
        scaleInputM.setAttribute('value', '1.5x'); 
        this.colorPicker.setAttribute('type', 'color'); 
        this.colorPicker.setAttribute('value', '#e5ffbc'); 

        this.btnBlock.append(scaleInputS, scaleInputM);

        panel.classList.add('panel');

        document.querySelector('body').append(panel); 
    }
}

/* ВАЖНО! Во-первых: мы все это делаем внутри одного объекта, и уже его экземпляр загружаем в main.js. У нас есть класс при помощи которого создаются новые потомки при помощи опператора new.
          Во-вторых: все эти действия можно определять только к определеным тегам, определеным блокам, текста, и так далее, не обязательно на весь body или только на #text . Те к заголвкам, параграфам, к классам и тд, тоже самое с цветом
Теперь в конце пишу gulp prod*/