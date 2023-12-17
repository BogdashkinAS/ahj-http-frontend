import { TicketService } from './service';
import pen from '../img/pen.jpg';
import cross from '../img/cross.jpg';

// Функция добавления запроса на создание нового тикета
export function addInfo() {
  const squareForm = document.createElement('div');
  squareForm.classList.add('square-form');
  squareForm.innerHTML =`
    <p class="title">Добавить тикет</p>
    <p class="little-description">Краткое описание</p>
    <input type="text" class="little-description-input" name="lit-desc" maxlength="40" required>
    <p class="full-description">Подробное описание</p>
    <textarea rows="3" wrap="soft" style="resize: none;" type="text" class="full-description-input" name="full-desc" maxlength="212" required></textarea>
    <div class="btn-no">
      <p>Отмена</p>
    </div>
    <div class="btn-ok">
      <p>OK</p>
    </div>
`;
  document.body.appendChild(squareForm);
  const litInput = document.querySelector('.little-description-input');
  const fullInput = document.querySelector('.full-description-input');

  document.querySelector('.btn-ok').addEventListener('click', () => {
    if (!litInput.value) {
        litInput.value = '';
    }
    if (!fullInput.value) {
        fullInput.value = '';
    }
    console.log(litInput.value);
    console.log(fullInput.value);
    squareForm.remove();
    addTicket(litInput.value, fullInput.value);
  });

  document.querySelector('.btn-no').addEventListener('click', () => {
    const squareForm = document.querySelector('.square-form');
    squareForm.remove();
  });

}

// Функция добавления нового тикета
export function addTicket(name, description) {
  const timestamp = new Date().getTime();
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
  let newTicket = {
    name: name,
    description: description,
    status: false,
    created: formattedDate
  };

  TicketService.create(newTicket).then(data => {
    console.log('Создан элемент: ', data);
    const cards = document.createElement('div');
    cards.classList.add('cards');
    cards.setAttribute('id', data.id);
    cards.innerHTML =`
      <div class="card-checkbox"></div>
      <p class="card-little-description">${name}</p>
      <p class="card-full-description"></p>
      <p class="card-date">${formattedDate}</p>
      <div class="circle-pen">
        <img src="${pen}" alt="">
      </div>
      <div class="circle-delete">
        <img src="${cross}" alt="">
      </div>
    `;
    document.body.appendChild(cards);
  });

};

export function deleteTicket(delParent) {
  console.log(delParent.id);
  const delEl = document.createElement('div');
  delEl.classList.add('square-form-delete');
  delEl.innerHTML =`
    <p class="title-delete">Удалить тикет</p>
    <p class="little-description-delete">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
    <div class="btn-no-delete">
      <p>Отмена</p>
    </div>
    <div class="btn-ok-delete">
      <p>OK</p>
    </div>
  `;
  document.body.appendChild(delEl);
  
  document.querySelector('.btn-no-delete').addEventListener('click', () => {
    const delForm = document.querySelector('.square-form-delete');
    delForm.remove();
  });

  document.querySelector('.btn-ok-delete').addEventListener('click', () => {
    (async () => {
      const res = await TicketService.delete(delParent.id);
      const delForm = document.querySelector('.square-form-delete');
      if (res.status == "ok") {
        delForm.remove();
        delParent.remove();
        console.log('Элемент удален');
        allTicket();
      }
    })();
  });

}

// Функция апдейта тикета
export function updateTicket(upParent) {
  TicketService.get(upParent.id).then(data => {
    console.log(data.name, data.description);
    const updateEl = document.createElement('div');
    updateEl.classList.add('square-form-update');
    updateEl.innerHTML =`
      <p class="title-update">Изменить тикет</p>
      <p class="little-description-update">Краткое описание</p>
      <input type="text" class="little-description-input-update" name="lit-desc" maxlength="40" required>
      <p class="full-description-update">Подробное описание</p>
      <textarea rows="3" wrap="soft" style="resize: none;" type="text" class="full-description-input-update" name="full-desc" maxlength="212" required></textarea>
      <div class="btn-no-update">
        <p>Отмена</p>
      </div>
      <div class="btn-ok-update">
        <p>OK</p>
      </div>
    `;
    document.body.appendChild(updateEl);
    const oldName = updateEl.querySelector('.little-description-input-update');
    const oldDescription = updateEl.querySelector('.full-description-input-update');
    oldName.value = data.name;
    oldDescription.value = data.description;
    
    
    document.querySelector('.btn-no-update').addEventListener('click', () => {
      updateEl.remove();
    });

    document.querySelector('.btn-ok-update').addEventListener('click', () => {
      const name = document.querySelector('.little-description-input-update').value;
      const description = document.querySelector('.full-description-input-update').value;
      const nameNew = document.querySelector('.card-little-description');

      let ticket = {
        name: name,
        description: description,
        id: upParent.id
      };
    
      TicketService.update(ticket).then(data => {
        nameNew.textContent = name;
        console.log('Обновлен элемент: ', data);
      });
      updateEl.remove();
      allTicket();
    });
    });

}


// Функция изменения статуса тикета
export function checkTicket(checkStatus, status) {
  // console.log('Изменение статуса элемента: ', checkStatus);
  let ticketCheck = {
    status: status,
    id: checkStatus.id
  };

  TicketService.update(ticketCheck).then(data => {
    console.log('Обновлен элемент: ', data);
  });
  
}

// Функция полного описания тикета
export function fullTicket(id) {
  console.log('Полное описание элемента: ', id);

  TicketService.get(id).then(data => {
    console.log('Описание: ', data.description);
    const formFull = document.getElementById(id);
    formFull.classList.add('active');
    const fullEl = document.createElement('div');
    fullEl.classList.add('full-description');
    fullEl.innerHTML =`
      <p>${data.description}</p>
    `;
    formFull.appendChild(fullEl);
  });
  
}


// Функция информации всех тикетов
export function allTicket() {
  const cards = document.querySelectorAll('.cards');
  cards.forEach(card => {
    console.log(card);
    card.remove();
  });
  TicketService.all().then(data => {
    console.log('Все тикеты: ', data);
    data.forEach(el => {
      const cards = document.createElement('div');
      cards.classList.add('cards');
      cards.setAttribute('id', el.id);
      cards.innerHTML =`
        <div class="card-checkbox"></div>
        <p class="card-little-description">${el.name}</p>
        <p class="card-full-description"></p>
        <p class="card-date">${el.created}</p>
        <div class="circle-pen">
          <img src="${pen}" alt="">
        </div>
        <div class="circle-delete">
          <img src="${cross}" alt="">
        </div>
      `;
      document.body.appendChild(cards);
    });
  });
}

document.querySelector('.add-ticket').addEventListener('click', () => {
  addInfo();  
});

document.addEventListener('click', (e) => {
  const delElem = e.target.parentElement;
  if (delElem && delElem.className === 'circle-delete') {
    const delParent = delElem.closest('.cards');
    deleteTicket(delParent);
  }
});

document.addEventListener('click', (e) => {
  const updateElem = e.target.parentElement;
  if (updateElem && updateElem.className === 'circle-pen') {
    const upParent = updateElem.closest('.cards');
    updateTicket(upParent);
  }
});

document.addEventListener('click', (e) => {
  const checkEl = e.target;
  let checkStatus = checkEl.closest('.cards');
  if (checkEl.className === 'card-checkbox') {
    checkEl.classList.add('active');
    checkTicket(checkStatus, true);
  } else if (checkEl.className === 'card-checkbox active') {
    checkEl.classList.remove('active');
    checkTicket(checkStatus, false);
  }  
});


document.addEventListener('click', (e) => {
  const open = e.target.parentElement;
  const open2 = e.target;
  if (open && open.className === 'circle-delete' ) {
    console.log('Mode circle-delete');
  } else if (open && open.className === 'circle-pen' ) {
    console.log('Mode pen');
  } else if (open2 && open2.className === 'card-checkbox' ) {
    console.log('Mode checkbox');
  } else if (open2 && open2.className === 'card-checkbox active' ) {
    console.log('Mode checkbox active');
  } else if (open2 && open2.className === 'cards active' ) {
    allTicket();
  } else if (open2 && open2.className === 'cards' ) {
    console.log('No content');
    fullTicket(open2.id);
  }
});
