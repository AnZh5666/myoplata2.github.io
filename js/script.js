let obj = [];
let sum;
const btnAdd = document.querySelector(".btn-add");

async function getData() {
  let response = await fetch(
    "https://648a8b9517f1536d65e93b38.mockapi.io/oplata",
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Permissions-Policy": "Origin",
      },
    }
  );
  let result = await response.json();
  obj = Object.keys(result).map((key) => result[key]);
  obj.sort(
    (a, b) => moment(a.date, "DD.MM.YYYY") - moment(b.date, "DD.MM.YYYY")
  );
  fillTable(obj);
}
getData().catch(alert);

function fillTable(obj) {
  const out = document.querySelector(".out-table");
  out.innerHTML = "";
  obj.forEach((item, index) => {
    out.innerHTML += createStringTable(item, index);
    
  });
  /*  workedElems = document.querySelectorAll('.worked'); */
  sum = obj.reduce((acc, elem) => acc + +elem.cost, 0);
  const total = document.querySelector(".total");
  total.innerHTML = Math.round(sum);
}

const createStringTable = (item, index) => {
  return `
        <tr class="worked">
            <th scope="row">${index + 1}</th>
            <td>${item.name}</td>
            <td>${moment(item.date).format("DD.MM.YYYY")}</td>
            <td class="client" data-bs-toggle="modal" data-bs-target="#exampleModal">${
              item.client
            }</td>
            <td class="cost">${item.cost}</td>
            <td class="td-del"><button class="btn btn-del" onclick="deleteObj(${index},${
    item.id
  })"><img src="./img/archive.svg"></button></td>
        </tr>          
    `;
};
//функция удаляющая при нажатии на кнопку отмеченную строку
const deleteObj = async (index, item) => {
  await fetch(`https://648a8b9517f1536d65e93b38.mockapi.io/oplata/${item}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
  let delArr = [];
  
  sum = sum - obj[index].cost;
  obj.splice(index, 1);
  if (sum == 0) {
    total.innerHTML = "";
  }
  fillTable(obj);
};

const formInput = document.querySelector(".form-input");
formInput.addEventListener("submit", function (e) {
  e.preventDefault();
  obj = {
    name: formInput[0].value,
    date: formInput[1].value,
    client: formInput[2].value,
    cost: formInput[3].value,
  };
  formInput.reset();
  fetch("https://648a8b9517f1536d65e93b38.mockapi.io/oplata", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => {
      if (res.ok) {
        getData();
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
});


document.querySelector(".table").addEventListener("click", function (e) {
  let target = e.target; 
  const modalTable = document.querySelector(".modal-table");
  modalTable.innerHTML = "";
  
  if (target.className != 'client') {
    return 
  }
  else {      
      let arrClient = [];
      let sum2 = 0;
      let nameClient = ''; 
     
      nameClient = target.textContent;

       obj.map((item) => {
        if (nameClient === item.client) {
          arrClient.push(item);
          arrClient.sort((a, b) => moment(a.date, 'DD.MM.YYYY') - moment(b.date, 'DD.MM.YYYY'))
       }
      })
      sum2 = arrClient.reduce((acc, elem) => acc + +elem.cost, 0);

      arrClient.map((item, index) => {
        modalTable.innerHTML += `
          <tr class="worked">
              <th scope="row">${index + 1}</th>
              <td>${item.name}</td>
              <td>${moment(item.date).format("DD.MM.YYYY")}</td>
              <td class="client">${
                item.client
              }</td>
              <td class="cost">${item.cost}</td>
              <td class="td-del"><button class="btn btn-del" 
          })"><img src="./img/archive.svg"></button></td>
          </tr>
      `;
      })
  const totalModal = document.querySelector('.total-modal')
  totalModal.innerHTML = Math.round(sum2);
  arrClient = [];       
}});


