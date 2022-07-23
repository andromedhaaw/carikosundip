const load = async (source) => {
  const req = await fetch(`./${source}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await req.json();
  return res;
};

const main = async () => {
  try {
    const loadKostPutra = await load('data_kost.json');
    const loadKostPutri = await load('data_kost_putri.json');

    const unionPutraPutri = [
      ...loadKostPutra,
      ...loadKostPutri
    ]
    localStorage.setItem("data", JSON.stringify(loadKostPutra))
    localStorage.setItem("union-data", JSON.stringify(unionPutraPutri))
    mappingData(loadKostPutra)
  } catch (error) {
    console.log(error);
  }
};
main();

let perPage = 20
let start = 1
let end = perPage

const mappingData = (data) => {
  const kostTotals = document.querySelector('.kost-totals') 
  kostTotals.textContent = `Page ${perPage} / ${data.length}`

  const pages = Math.ceil(data.length / perPage)
  const paginateData = data.slice(start - 1, end)
  printData(paginateData)

  const buttonPage = document.querySelector('.button-page')
  let button = ''
  for (let i = 1; i <= pages; i++) {
    button += `
      <button class="button-pagination" onClick="paginate(${i})">${i}</button>
    `
  }

  buttonPage.innerHTML = button
}

const paginate = (val) => {
  const storeData = localStorage.getItem("data")
  const paginatedData = JSON.parse(storeData)

  let start = perPage * (val - 1 ) // 3 * (2 - 1) = [3]
  let end = (perPage * val)
  const splicedData = paginatedData.slice(start, end)
  printData(splicedData)

  const buttonPagination = document.querySelectorAll(".button-pagination")
  buttonPagination.forEach((button) => button.classList.remove('active'))
  buttonPagination[val - 1].classList.add('active')

  const kostTotals = document.querySelector('.kost-totals') 
  kostTotals.textContent = `Page ${perPage * val} / ${paginatedData.length}`
}

const printData = (data) => {
  const kostList = document.querySelector('.kost-list')
  kostList.innerHTML = ''
  let kostListCard = ''
  data.forEach((item) => {
      kostListCard += `
        <div class="kost-list__card">
              <div class="kost-list__card__title">
                  <img src="${item.thumbnail}" alt="image" width="64">
                  <div class="kost-list__card__title__sub">
                      <h2>${item.Nama_kost}</h2>
                      <p>${item.Alamat}</p>
                  </div>
              </div>
              <div class="kost-list__card__detail">
                  <button class="btn-blue--outline">
                      Detail
                  </button>
              </div>
          </div>
      `
  })
  kostList.innerHTML = kostListCard
}

//search


const dataKost = localStorage.getItem("union-data")
let parsedDataKost = JSON.parse(dataKost)

function search_kos() {
  let input = document.getElementById('searchbar').value
  input = input.toLowerCase();

  const results = []
  for (i = 0; i < parsedDataKost.length; i++) {
    const obj = parsedDataKost[i];
    if (obj.Nama_kost.toLowerCase().includes(input)) {
      results.push(obj)
      // console.error(obj)
      // const elem = document.createElement("li")
      // elem.innerHTML = `${obj.Name} - ${obj.Color}`
      // x.appendChild(elem)
    }
  }
  mappingData(results)
}


// define the button (putri & putra)
const btnPutra = document.getElementById("putra")
const btnPutri = document.getElementById("putri")

btnPutra.addEventListener("click", async () => {
  const data = await load('data_kost.json');
  localStorage.setItem("data", JSON.stringify(data))
  mappingData(data)
})

btnPutri.addEventListener("click", async () => {
  const data = await load('data_kost_putri.json');
  localStorage.setItem("data", JSON.stringify(data))
  mappingData(data)
})


// define the button detail
