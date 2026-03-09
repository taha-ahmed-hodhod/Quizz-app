const questionCards = document.querySelector(".exam-body");
export class Exam {
  constructor({ category, difficulty, numbers }) {
    this.grades   = 0;
    this.category = category;
    this.difficulty = difficulty;
    this.numbers  = numbers;
    // Mark feature
    this.markedQuestions = [];
    // Timer 
    this.timerInterval;  
    this.onTimeout;   
  }

  // Fetch data

  getQuestions = async () => {
    try {
      const res  = await fetch(
        `https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`
      );
      const data = await res.json();
      return data.results;
    } catch (err) {
      throw err;
    }
  };

 // Time bar
  startTimer = (durationSeconds, labelEl, fillEl, onTimeout) => {
    this.onTimeout = onTimeout;
    let remaining   = durationSeconds;        
    const total     = durationSeconds;         

    const format = (s) => {
      const m = String(Math.floor(s / 60)).padStart(2, "0");
      const sec = String(s % 60).padStart(2, "0");
      return `${m}:${sec}`;
    };

    // Modify format and bar style according to duration
    labelEl.textContent      = format(remaining);
    fillEl.style.width       = "100%";


    this.timerInterval = setInterval(() => {
      remaining -= 1;

      labelEl.textContent = format(remaining);

      const pct = (remaining / total) * 100;  
      fillEl.style.width = `${pct}%`;

      // change bar color
      fillEl.classList.remove("warning", "critical");
      if (pct <= 15) {
        fillEl.classList.add("critical");      
      } else if (pct <= 33) {
        fillEl.classList.add("warning");       
      }

      // Timeout
      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        onTimeout();
      }
    }, 1000);
  };

  // Stop the timer manually
  stopTimer = () => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  };


// Toggle marked questions
  toggleMark = (questionIndex) => {
    const pos = this.markedQuestions.indexOf(questionIndex);
    if (pos === -1) {
      this.markedQuestions.push(questionIndex);  
      return true;
    } else {
      this.markedQuestions.splice(pos, 1);      
      return false;
    }
  };

  isMarked = (questionIndex) => this.markedQuestions.includes(questionIndex);
}