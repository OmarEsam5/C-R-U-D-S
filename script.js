let title = document.getElementById("title")
let price = document.getElementById("price")
let taxes = document.getElementById("taxes")
let ads = document.getElementById("ads")
let discount = document.getElementById("discount")
let total = document.getElementById("total")
let count = document.getElementById("count")
let category = document.getElementById("category")
let createBut = document.getElementById("create")
let search = document.getElementById("search")
let searchTitle = document.getElementById("search-title")
let searchCategory = document.getElementById("search-category")
let outputs = document.querySelector(".outputs table tbody")


let arrData = []
let id = 1
let mode = "create";


let localItemId = localStorage.getItem("id")
if (localItemId != null) {
    id = localItemId
}
let localItem = localStorage.getItem("dataSet")
if (localItem != null) {
    arrData = JSON.parse(localItem)
    for (let i = 0; i < arrData.length; i++) {
        outputs.innerHTML += 
        `<tr>
            <td>${arrData[i].id}</td>
            <td>${arrData[i].title}</td>
            <td>${arrData[i].price}</td>
            <td>${arrData[i].taxes}</td>
            <td>${arrData[i].ads}</td>
            <td>${arrData[i].discount}</td>
            <td>${arrData[i].total}</td>
            <td>${arrData[i].category}</td>
            <td><button data-id="${arrData[i].id}" class="update">update</button></td>
            <td><button data-id="${arrData[i].id}" class="delete">delete</button></td>
        </tr>`
    }
}



function totalAll() {
    if (price.value != "") {
        total.innerHTML = (+price.value + +taxes.value + +ads.value ) - +discount.value
        total.style.background = "green"
    }else {
        total.innerHTML = ""
        total.style.background = "#a00d02"
    }
}


function Alldata() {
    countData = count.value === "" ? 1 : +count.value;
    countData = countData > 25 ? 25 : countData ;
    for (let i = 0; i < countData; i++) {
    let data = {
        id : +id,
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        category: category.value.toLowerCase(),
    }
        outputs.innerHTML += 
        `<tr>
            <td>${id}</td>
            <td>${data.title}</td>
            <td>${data.price}</td>
            <td>${data.taxes}</td>
            <td>${data.ads}</td>
            <td>${data.discount}</td>
            <td>${data.total}</td>
            <td>${data.category}</td>
            <td><button data-id="${data.id}" class="update">update</button></td>
            <td><button data-id="${data.id}" class="delete">delete</button></td>
        </tr>`
        id++
        arrData.push(data)
    }
    localStorage.setItem("id", id)
    localStorage.setItem("dataSet", JSON.stringify(arrData))
}


function deleteEle() {
    let eleV;
    let but = document.querySelectorAll(".outputs table tbody .delete");
    but.forEach((ele) => {
        ele.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.remove()
            arrData.forEach((ele) => {
                if (ele.id == e.target.dataset.id) {
                    eleV = ele
                }
            })
                arrData = arrData.filter((ele) => ele !== eleV)
                localStorage.setItem("dataSet", JSON.stringify(arrData))
            console.log(arrData)
            deletAllDiv()
        })
    })
}
deleteEle()


function cleanData() {
    title.value = ""
    price.value = ""
    taxes.value = ""
    ads.value = ""
    discount.value = ""
    totalAll()
    count.value = ""
    category.value = ""
    search.value = ""
}

// delete All

let deleteAll = document.querySelector("#delete-all")

function deletAllDiv() {
    if (outputs.innerHTML != "") {
        deleteAll.style.display = "block"
        deleteAll.innerHTML = `Delete All (${outputs.children.length})`
    } else {
        deleteAll.style.display = "none"
    }
}
deletAllDiv()


deleteAll.onclick = () => {
    let con = confirm("Are You Shur ?")
    if (con === true) {
        outputs.innerHTML = ""
        arrData = []
        localStorage.clear()
        deletAllDiv()
        id = 1
        window.location.reload()
    }
}

// update
let targetUpdate;
let targetDataSet;

function update() {
    let but = document.querySelectorAll(".update")
    but.forEach((ele) => {
        ele.addEventListener("click", (e) => {
            targetUpdate = e.target.parentElement.parentElement.children
            targetDataSet = e.target.dataset.id
            title.value = targetUpdate[1].textContent
            price.value = targetUpdate[2].textContent
            taxes.value = targetUpdate[3].textContent
            ads.value = targetUpdate[4].textContent
            discount.value = targetUpdate[5].textContent
            total.innerHTML = targetUpdate[6].textContent
            category.value = targetUpdate[7].textContent
            totalAll()
            mode = "update"
            createBut.textContent = "Update"
            count.style.display = "none"
            window.scrollTo({
                top : 0,
                behavior: "smooth",
            })
        })
    })
}
update()

createBut.onclick = () => {
    if (mode === "update") {
        arrData.forEach((eleD) => {
            if (eleD.id == targetDataSet) {
                eleD.title = title.value
                eleD.price = price.value
                eleD.taxes = taxes.value
                eleD.ads = ads.value
                eleD.discount = discount.value
                eleD.total = total.innerHTML
                eleD.category = category.value
                localStorage.setItem("dataSet", JSON.stringify(arrData))
            }
        })
        targetUpdate[1].textContent = title.value
        targetUpdate[2].textContent = price.value
        targetUpdate[3].textContent = taxes.value
        targetUpdate[4].textContent = ads.value
        targetUpdate[5].textContent = discount.value
        targetUpdate[6].textContent = total.innerHTML
        targetUpdate[7].textContent = category.value
        cleanData()
        mode = "create"
        createBut.textContent = "Create"
        count.style.display = "block"
        console.log(arrData)
    }else {
        if (title.value != "" && total.innerHTML != "" && category.value != "") {
            Alldata()
            deletAllDiv()
            cleanData()
        }
        update()
        deleteEle()
    }
}



// search
let chSe = "Search By Title"

function ele(e) {
    e.onclick = () => {
        chSe = e.textContent
        search.focus()
        search.placeholder = chSe
    }
}
ele(searchTitle)
ele(searchCategory)

search.oninput = () => {
    let ele = outputs.children
    if (chSe === "Search By Title") {
        for (let i = 0; i < ele.length; i++) {
            ele[i].style.display = "none"
            if (ele[i].children[1].textContent.includes(search.value.toLowerCase())) {
                ele[i].style.display = "table-row"
            }
        }
    } else {
        for (let i = 0; i < ele.length; i++) {
            ele[i].style.display = "none"
            if (ele[i].children[7].textContent.includes(search.value.toLowerCase())) {
                ele[i].style.display = "table-row"
            }
        }
    }
}


let scrollBut = document.querySelector(".scroll-top")

window.onscroll = () => {
    if (scrollY >= 400) {
        scrollBut.style.display = "block"
    }else {
        scrollBut.style.display = "none"
    }
}

scrollBut.onclick = () => {
    window.scrollTo({
        top : 0,
        behavior : "smooth"
    })
}