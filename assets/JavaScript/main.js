// button section
const loadCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/peddy/categories"
    );
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.error("Error fatching categiries:", error);
  }
};

//  load by category
const loadPetsByCategories = async (categoryName) => {
  document.getElementById("spinner").style.display = "block";
  document.getElementById("selected-container").style.display = "none";
  document.getElementById("no-infomation").classList.add("hidden");

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`
    );
    const data = await res.json();
    document.getElementById("all-pets").innerHTML = "";
    setTimeout(() => {
      displayAllPets(data.data);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("selected-container").style.display = "block";
    }, 2000);
  } catch (error) {
    console.error("Error fetching pets by category:", error);
  }
};

// display category button
const displayCategories = (categories) => {
  categories.forEach((item) => {
    const btnDiv = document.getElementById("btn-container");
    const button = document.createElement("button");
    const btnIcon = document.createElement("img");
    const btnTxt = document.createTextNode(item.category);
    btnIcon.src = item.category_icon;
    btnIcon.classList = "h-7 w-8";
    button.classList =
      "btn bg-transparent primary-txt inter text-2xl border-2 ";
    button.onclick = () => {
      const allButtons = btnDiv.querySelectorAll("button");
      allButtons.forEach((btn) => {
        btn.classList.remove(
          "border-teal-200",
          "bg-[#E7F2F2]",
          "py-2",
          "px-4",
          "rounded-full"
        );
      });
      button.classList.add(
        "border-teal-200",
        "py-2",
        "px-4",
        "rounded-full",
        "bg-[#E7F2F2]"
      );
      loadPetsByCategories(item.category);
    };

    button.appendChild(btnIcon);
    button.appendChild(btnTxt);
    btnDiv.appendChild(button);
  });
};

// all pets
const loadAllPets = async () => {
  document.getElementById("spinner").style.display = "block";
  document.getElementById("selected-container").style.display = "none";
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    const data = await res.json();
    setTimeout(() => {
      displayAllPets(data.pets);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("selected-container").style.display = "block";
    }, 2000);
  } catch (error) {
    console.error("Error fetching pets by category:", error);
  }
};

// display all pets
const displayAllPets = (pets) => {
  const allPets = document.getElementById("all-pets");
  allPets.innerHTML = "";
  // sort by price
  document.getElementById("sort-price").addEventListener("click", () => {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("selected-container").style.display = "none";
    document.getElementById("no-information").classList.add("hidden");
    allPets.innerHTML = "";
    const sortByPrice = pets.sort((a, b) => b.price - a.price);
    setTimeout(() => {
      displayAllPets(sortByPrice);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("selected-container").style.display = "block";
    }, 2000);
  });

  if (pets.length === 0) {
    allPets.classList.add("hidden");
    document.getElementById("no-information").classList.remove("hidden");
  } else {
    allPets.classList.remove("hidden");
    document.getElementById("no-information").classList.add("hidden");
  }

  pets.forEach((item) => {
    const { image, pet_name, breed, date_of_birth, gender, price } = item;
    const card = document.createElement("div");
    card.classList.add("card", "shadow", "bg-base-100", "p-4");
    card.innerHTML = `
              <figure class=" h-full">
                <img
                  src="${image}"
                  alt=${pet_name}
                  class="rounded-xl w-full h-full " />
             </figure>
              <div class="mt-5">
                <h2 class="primary-txt text-xl inter font-bold">${pet_name}</h2>
                <p class="secondary-txt">
                  <i class="fa-solid fa-qrcode pr-1"></i>
                  <span>Breed: ${breed ? breed : "Not Available"}</span>
                </p>
                <p class="secondary-txt">
                  <i class="fa-regular fa-calendar pr-1"></i>
                  <span>Birth: ${
                    date_of_birth ? date_of_birth : "Not Availabe"
                  }</span>
                </p>
                <p class="secondary-txt">
                  <i class="fa-solid fa-mercury pr-1"></i>
                  <span>Gender: ${gender ? gender : "Not Availabe"}</span>
                </p>
                <p class="secondary-txt">
                  <i class="fa-solid fa-dollar-sign pr-1"></i>
                  <span>Price : ${price ? `${price} $` : "Not Availabe"}</span>
                </p>
                <div class="divider"></div>
                <div class="flex justify-between ">
                  <button
                    class="btn btn-sm border-[#0E7A8126] rounded-lg badge badge-outline"
                  >
                    <i class="fa-regular fa-thumbs-up text-xl"></i>
                  </button>
                  <button id="adopt-btn"
                    class="btn btn-sm border-[#0E7A8126] text-[#0E7A81] text-lg font-bold rounded-lg badge badge-outline"
                  >
                    Adopt
                  </button>
                  <button id="petDetails"
                    class="btn btn-sm border-[#0E7A8126] text-[#0E7A81] text-lg font-bold rounded-lg badge badge-outline"
                  >
                    Details
                  </button>
                </div>
              </div>
            
    `;
    // select Pets By Thumbs Up
    const selectPetsByThumbsUp = card.querySelector(".fa-thumbs-up");
    selectPetsByThumbsUp.addEventListener("click", async () => {
      try {
        const res = await fetch(
          `https://openapi.programming-hero.com/api/peddy/pet/${item.petId}`
        );
        const data = await res.json();
        const { image } = data.petData;
        const selectImage = document.getElementById("select-pets-container");
        const imgContainer = document.createElement("div");
        imgContainer.classList = "p-2 border object-cover h-full rounded-md ";
        imgContainer.innerHTML = `
         <img  class="h-full w-full rounded-md" src="${image}" alt="image">
         `;
        selectImage.appendChild(imgContainer);
      } catch (error) {
        console.error("Error fetching pet image:", error);
      }
    });

    // adopt congrates modal
    const showAdoptModal = card.querySelector("#adopt-btn");
    showAdoptModal.addEventListener("click", () => {
      const adoptModal = document.getElementById("my_modal_2");
      adoptModal.showModal();

      const countDown = document.getElementById("count-down");
      let countDownValue = 3;
      countDown.innerText = countDownValue;

      let countDownInterval = setInterval(() => {
        countDownValue--;
        countDown.innerText = countDownValue;
        if (countDownValue == 1) {
          clearInterval(countDownInterval);
          card.querySelector("#adopt-btn").setAttribute("disabled", true);
          card.querySelector("#adopt-btn").innerText = "Adopted";
          setTimeout(() => {
            adoptModal.close();
          }, 1000);
        }
      }, 1000);
    });
    // pet details
    const showPetDetailsByid = card.querySelector("#petDetails");
    showPetDetailsByid.addEventListener("click", async () => {
      try {
        const res = await fetch(
          `https://openapi.programming-hero.com/api/peddy/pet/${item.petId}`
        );
        const data = await res.json();
        const {
          breed,
          date_of_birth,
          price,
          image,
          gender,
          pet_details,
          vaccinated_status,
          pet_name,
        } = data.petData;
        const birthYear = new Date(date_of_birth).getFullYear();
        const modalContainer = document.getElementById("modalContent");
        modalContainer.innerHTML = `
        <div class="card bg-base-100">
          <figure class="">
            <img
              src="${image}"
              alt="image"
              class="rounded-xl w-full"
            />
          </figure>
          <div class="mt-5">
            <h2 class="primary-txt text-xl font-bold">${pet_name}</h2>
            <div class="grid grid-cols-2">
              <p class="secondary-txt">
                <i class="fa-solid fa-qrcode pr-1"></i>
                <span>Breed: ${breed ? breed : "Not Available"}</span>
              </p>
              <p class="secondary-txt">
                <i class="fa-regular fa-calendar pr-1"></i>
                <span
                  >Birth: ${birthYear ? birthYear : "Not Availabe"}</span
                >
              </p>
              <p class="secondary-txt">
                <i class="fa-solid fa-mercury pr-1"></i>
                <span>Gender: ${gender ? gender : "Not Availabe"}</span>
              </p>
              <p class="secondary-txt">
                <i class="fa-solid fa-dollar-sign pr-1"></i>
                <span>Price : ${price ? `${price} $` : "Not Availabe"}</span>
              </p>
              <p class="secondary-txt col-span-2">
                <i class="fa-solid fa-syringe pr-1"></i>
                <span>Vaccinated status: ${
                  vaccinated_status ? vaccinated_status : "Not Availabe"
                }
                </span>
              </p>
            </div>
            <div class="divider"></div>
            <div class="">
              <h3 class="primary-txt font-semibold">Details Information</h3>
              <p class="secondary-txt">
                ${pet_details}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-action">
          <form class="w-full" method="dialog">
            <button class="btn w-full bg-[#E7F2F2] border-teal-200 text-lg">
              Close
            </button>
          </form>
        </div>
         `;
        my_modal_5.showModal();
      } catch (error) {
        console.error("Error fetching pet image:", error);
      }
    });
    allPets.appendChild(card);
  });
};

loadCategories();
loadAllPets();
