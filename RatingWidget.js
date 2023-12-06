class RatingWidget extends HTMLElement {
    constructor() {
      super();
  
      const shadow = this.attachShadow({ mode: 'open' });
  
      const style = document.createElement('style');
      style.textContent = `
        .rating-stars {
          display: inline-block;
        }
  
        .rating-star {
          font-size: 30px;
          cursor: pointer;
          color: #ccc;
        }
  
        .rating-star:hover,
        .rating-star.hovered {
          color: #f5a623;
        }
  
        .rating-star.selected {
          color: #f5a623;
        }
  
        .rating-result {
          margin-top: 20px;
          font-size: 20px;
        }
      `;
  
      shadow.appendChild(style);
      
      const form = document.createElement('form');
      form.setAttribute('action', 'https://httpbin.org/post');
      form.setAttribute('method', 'POST');
      form.innerHTML = `
        <label for="rating">How satisfied are you?</label>
        <input type="hidden" name="question" value="How satisfied are you?">
        <input type="hidden" name="sentBy" value="HTML">
        <div class="rating-stars"></div>
        <input type="hidden" id="rating" name="rating" required>
      `;
      shadow.appendChild(form);
      const responseContainer = document.createElement('p');

      shadow.appendChild(responseContainer);
  
      const starsContainer = form.querySelector('.rating-stars');
  
      const maxRating = 5;  
  
      const updateHoveredStars = (index) => {
        const stars = starsContainer.querySelectorAll('.rating-star');
        stars.forEach((star, i) => {
          star.classList.toggle('hovered', i <= index);
        });
      };
  
      const updateStars = (index) => {
        const stars = starsContainer.querySelectorAll('.rating-star');
        stars.forEach((star, i) => {
          star.classList.toggle('selected', i <= index);
        });
        form.rating.value = index + 1; 
      };
  
      for (let i = 0; i < maxRating; i++) {
        const star = document.createElement('span');
        star.classList.add('rating-star');
        star.textContent = '★';
        star.addEventListener('click', () => {updateStars(i); handleFormSubmit()})
        star.addEventListener('mouseover', () => updateHoveredStars(i));
        star.addEventListener('mouseout', () => updateHoveredStars(-1)); 
        starsContainer.appendChild(star);
      }
  
      const handleFormSubmit = async () => {
        const formData = new FormData(form);
        // Add the 'sentBy' form value
        formData.append('sentBy', 'JS');
      
        try {
          const response = await fetch(form.action, {
            method: form.method,
            headers: {
              // Add the custom header
              'X-Sent-By': 'JS'
            },
            body: formData,
          });
          const data = await response.json();
          console.log(data);
          const rated = data.form.rating;
          if (rated < Math.round(0.8 * maxRating)) {
              responseContainer.innerText = `Thanks for the ${rated} stars, we will do our best to improve!`;
          } else {
              responseContainer.innerText = `Thanks for the ${rated} stars!`;
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
    }
    
  }
  

  customElements.define('rating-widget', RatingWidget);
  