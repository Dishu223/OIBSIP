class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, historyLogContentElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.historyLogContentElement = historyLogContentElement;
        this.history = [];
        this.clear();
    }

    clear() {
        this.currentOperandTextElement.classList.add('clearing');
        setTimeout(() => {
            this.currentOperand = '';
            this.previousOperand = '';
            this.operation = undefined;
            this.history = [];
            this.updateDisplay();
            this.updateHistoryDisplay();
            this.currentOperandTextElement.classList.remove('clearing');
        }, 200);
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        const expression = `${this.getDisplayNumber(prev)} ${this.operation} ${this.getDisplayNumber(current)}`;
        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '÷': computation = prev / current; break;
            default: return;
        }
        
        const result = Math.round(computation * 1000000) / 1000000;
        this.addHistory(expression, result);
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }

    addHistory(expression, result) {
        this.history.unshift({ expression, result });
        if (this.history.length > 10) this.history.pop();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyLogContentElement.innerHTML = '';
        this.history.forEach(entry => {
            const historyEntry = document.createElement('div');
            historyEntry.classList.add('history-entry');
            
            const textContainer = document.createElement('div');
            
            const expressionDiv = document.createElement('div');
            expressionDiv.classList.add('expression');
            expressionDiv.innerText = entry.expression;
            
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result');
            resultDiv.innerText = `= ${this.getDisplayNumber(entry.result)}`;
            
            textContainer.appendChild(expressionDiv);
            textContainer.appendChild(resultDiv);
            
            // Create and add the copy button
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-btn');
            copyButton.innerHTML = `<i class='bx bx-copy'></i>`; // Using Boxicons for the icon
            
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(entry.result);
                copyButton.innerHTML = `<i class='bx bx-check'></i>`;
                setTimeout(() => {
                    copyButton.innerHTML = `<i class='bx bx-copy'></i>`;
                }, 1500);
            });
            
            historyEntry.appendChild(textContainer);
            historyEntry.appendChild(copyButton);
            this.historyLogContentElement.appendChild(historyEntry);
        });
    }

    getDisplayNumber(number) {
        // ... (this method is unchanged)
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        // ... (this method is unchanged)
        this.currentOperandTextElement.innerHTML = '';
        const numberString = this.currentOperand.toString();
        const integerPart = numberString.split('.')[0];
        const decimalPart = numberString.split('.')[1];
        const formattedInteger = parseFloat(integerPart).toLocaleString('en', { maximumFractionDigits: 0 });
        if (integerPart !== '' && !isNaN(integerPart)) {
             formattedInteger.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                this.currentOperandTextElement.appendChild(charSpan);
            });
        }
        if (decimalPart != null) {
            const decimalSpan = document.createElement('span');
            decimalSpan.innerText = '.';
            this.currentOperandTextElement.appendChild(decimalSpan);
            decimalPart.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                this.currentOperandTextElement.appendChild(charSpan);
            });
        }
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}


// --- DOM Element Selection ---
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const historyLogContentElement = document.querySelector('[data-history-log-content]');

// --- Initializing the Calculator ---
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, historyLogContentElement);

// --- Event Listeners for Mouse Clicks ---
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// --- Event Listener for Keyboard Input (with Visual Feedback) ---
window.addEventListener('keydown', (event) => {
    let key = event.key;
    let buttonToAnimate;

    if (key >= 0 && key <= 9 || key === '.') {
        calculator.appendNumber(key);
        buttonToAnimate = [...numberButtons].find(btn => btn.innerText === key);
    } else if (key === '=' || key === 'Enter') {
        calculator.compute();
        buttonToAnimate = equalsButton;
    } else if (key === 'Backspace') {
        calculator.delete();
        buttonToAnimate = deleteButton;
    } else if (key === 'Escape') {
        calculator.clear();
        buttonToAnimate = allClearButton;
    } else if (key === '+' || key === '-' || key === '*') {
        calculator.chooseOperation(key);
        buttonToAnimate = [...operatorButtons].find(btn => btn.innerText === key);
    } else if (key === '/') {
        calculator.chooseOperation('÷');
        buttonToAnimate = [...operatorButtons].find(btn => btn.innerText === '÷');
    }

    // If a corresponding button was found, animate it
    if (buttonToAnimate) {
        buttonToAnimate.classList.add('key-press');
        setTimeout(() => {
            buttonToAnimate.classList.remove('key-press');
        }, 150);
    }
    
    calculator.updateDisplay();
});

// --- Theme Switcher Logic ---
const themeRadios = document.querySelectorAll('input[name="theme"]');
themeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        document.body.classList.remove('dark-mode', 'cyberpunk-mode');

        if (radio.id === 'theme-dark') {
            document.body.classList.add('dark-mode');
        } else if (radio.id === 'theme-cyber') {
            document.body.classList.add('cyberpunk-mode');
        }
    });
});

/*info tooltip*/
document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.querySelector('.info-tooltip');
    if (tooltip) {
        // Show the tooltip after 5 seconds
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 5000);

        // Hide the tooltip after 20 seconds total
        setTimeout(() => {
            tooltip.classList.remove('visible');
        }, 20000);
    }
});