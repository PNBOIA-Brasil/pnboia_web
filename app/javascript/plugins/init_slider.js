
const sliderCodes = () => {
	
	const slider = document.getElementById("slider"); // основная обертка
    if (slider) {
        const sliderContent = document.querySelector(".slider-content"); // обертка для контейнера слайдов и контролов
        const sliderWrapper = document.querySelector(".slider-content-wrapper"); // контейнер для слайдов
        const elements = document.querySelectorAll(".slider-content__item"); // обертка для слайда
        const sliderContentControls = createHTMLElement("div", "slider-content__controls"); // блок контролов внутри sliderContent
        let dotsWrapper = null; // Обертка dots
        let prevButton = null; // Кнопки
        let nextButton = null;
        let autoButton = null;
        let leftArrow = null; // Стрелки
        let rightArrow = null;
        let intervalId = true; //идентификатор setInterval
        
        const itemsInfo = {
            offset: 0, // смещение контейнера со слайдами относительно начальной точки (первый слайд)
            position: {
                current: 0, // номер текущего слайда
                min: 0, // первый слайд
                max: elements.length - 1 // последний слайд	
            },
            intervalSpeed: 3000, // Скорость смены слайдов в авторежиме

            update: function(value) {
                this.position.current = value;
                this.offset = -value;
            },
            reset: function() {
                this.position.current = 0;
                this.offset = 0;
            }	
        };

        const controlsInfo = {
            buttonsEnabled: false,
            dotsEnabled: false,
            prevButtonDisabled: true,
            nextButtonDisabled: false
        };

        function init(props) {
            // let {buttonsEnabled, dotsEnabled} = controlsInfo;
            let {intervalSpeed, position, offset} = itemsInfo;
            
            if (slider && sliderContent && sliderWrapper && elements) {
                if (props && props.intervalSpeed) {
                    intervalSpeed = props.intervalSpeed;
                }
                if (props && props.currentItem) {
                    if ( parseInt(props.currentItem) >= position.min && parseInt(props.currentItem) <= position.max ) {
                        position.current = props.currentItem;
                        offset = - props.currentItem;	
                    }
                }
                if (props && props.buttons) {
                    controlsInfo.buttonsEnabled = true;
                }
                if (props && props.dots) {
                    controlsInfo.dotsEnabled = true;
                }
                
                _updateControlsInfo();
                _createControls(controlsInfo.dotsEnabled, controlsInfo.buttonsEnabled);
                _render();
                setInterval(function(){
                    if (itemsInfo.position.current < itemsInfo.position.max) {
                        itemsInfo.update(itemsInfo.position.current + 1);
                    } else {
                        itemsInfo.reset();
                    }
                    _slideItem();
                }, itemsInfo.intervalSpeed)
                console.log(itemsInfo.intervalSpeed)
            } else {
            }
        }

        function _updateControlsInfo() {
            const {current, min, max} = itemsInfo.position;
            controlsInfo.prevButtonDisabled = current > min ? false : true;
            controlsInfo.nextButtonDisabled = current < max ? false : true;
        }

        function _createControls(dots = false, buttons = false) {
            
            sliderContent.append(sliderContentControls);

            createArrows();
            buttons ? createButtons() : null;
            dots ? createDots() : null;
            
            // Arrows function
            function createArrows() {
                const dValueLeftArrow = "M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z";
                const dValueRightArrow = "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z";
                const leftArrowSVG = createSVG(dValueLeftArrow);
                const rightArrowSVG = createSVG(dValueRightArrow);
                
                leftArrow = createHTMLElement("div", "prev-arrow");
                leftArrow.append(leftArrowSVG);
                leftArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
                
                rightArrow = createHTMLElement("div", "next-arrow");
                rightArrow.append(rightArrowSVG);
                rightArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

                sliderContentControls.append(leftArrow, rightArrow);
                
                // SVG function
                function createSVG(dValue, color="currentColor") {
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("viewBox", "0 0 256 512");
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("fill", color);
                    path.setAttribute("d", dValue);
                    svg.appendChild(path);	
                    return svg;
                }
            }

            // Dots function
            function createDots() {
                dotsWrapper = createHTMLElement("div", "dots");			
                for(let i = 0; i < itemsInfo.position.max + 1; i++) {
                    const dot = document.createElement("div");
                    dot.className = "dot";
                    dot.addEventListener("click", function() {
                        updateItemsInfo(i);
                    })
                    dotsWrapper.append(dot);		
                }
                sliderContentControls.append(dotsWrapper);	
            }
            
            // Buttons function
            function createButtons(autoMode = true) {
                const controlsWrapper = createHTMLElement("div", "slider-controls");
                prevButton = createHTMLElement("button", "prev-control", "Prev");
                prevButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
                
                autoButton = createHTMLElement("button", "auto-control", "Auto");
                autoButton.addEventListener("click", () => {
                    intervalId = setInterval(function(){
                        if (itemsInfo.position.current < itemsInfo.position.max) {
                            itemsInfo.update(itemsInfo.position.current + 1);
                        } else {
                            itemsInfo.reset();
                        }
                        _slideItem();
                    }, itemsInfo.intervalSpeed)
                })

                nextButton = createHTMLElement("button", "next-control", "Next");
                nextButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

                controlsWrapper.append(prevButton, autoButton, nextButton);
                slider.append(controlsWrapper);
            }
        }

        function setClass(options) {
            if (options) {
                options.forEach(({element, className, disabled}) => {
                    if (element) {
                        disabled ? element.classList.add(className) : element.classList.remove(className)	
                    } else {
                        console.log("Error: function setClass(): element = ", element);
                    }
                })
            }
        }

        function updateItemsInfo(value) {
            itemsInfo.update(value);
            _slideItem(true);	
        }

        function _render() {
            const {prevButtonDisabled, nextButtonDisabled} = controlsInfo;
            let controlsArray = [
                {element: leftArrow, className: "d-none", disabled: prevButtonDisabled},
                {element: rightArrow, className: "d-none", disabled: nextButtonDisabled}
            ];
            if (controlsInfo.buttonsEnabled) {
                controlsArray = [
                    ...controlsArray, 
                    {element:prevButton, className: "disabled", disabled: prevButtonDisabled},
                    {element:nextButton, className: "disabled", disabled: nextButtonDisabled}
                ];
            }
            
            setClass(controlsArray);

            sliderWrapper.style.transform = `translateX(${itemsInfo.offset*100}%)`;	
            
            if (controlsInfo.dotsEnabled) {
                if (document.querySelector(".dot--active")) {
                    document.querySelector(".dot--active").classList.remove("dot--active");	
                }
                dotsWrapper.children[itemsInfo.position.current].classList.add("dot--active");
            }
        }

        function _slideItem(autoMode = true) {
            console.log(autoMode)
            console.log('zzzzzz')
            if (autoMode && intervalId) {
                clearInterval(intervalId);
            }
            _updateControlsInfo();
            _render();
            
        }

        function createHTMLElement(tagName="div", className, innerHTML) {
            const element = document.createElement(tagName);
            className ? element.className = className : null;
            innerHTML ? element.innerHTML = innerHTML : null;
            return element;
        }

        return {init};
    }
};

const initSlider = () => {
	
	const slider = document.getElementById("slider"); // основная обертка
    if (slider) {
        sliderCodes().init({
            intervalSpeed: 3000,
            currentItem: 0,
            buttons: true,
            dots: true,
            autoMode: true
        });
    }
};

export { initSlider };